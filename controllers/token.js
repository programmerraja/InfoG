//node modules
const path = require("path");
const uaparser = require("ua-parser-js");
const axios = require("axios");

//model
const scammermodel = require("../models/Scammer");
const usermodel = require("../models/User");
//utill
const {
    AppError,
    logError
} = require("../util/util");

//handling GET /token/:id
async function get(req, res) {

    let token = req.params.token;

    let ip = req.headers["x-forwarded-for"] || req.ip;
    let useragent = uaparser(req.headers["user-agent"]);
    let browser = useragent["browser"]["name"];
    let os = useragent["os"]["name"];
    let device = useragent["device"];

    let scammer = await scammermodel.findOne({
        token: token
    });
    let redirect_link = scammer.redirect_link;

    //update only if user token is avalible else not 
    if (scammer) {

        //if he vistied as second we need to create new one 
        if (scammer.isvisited) {
            await storeNewdata(scammer, ip, token, useragent, browser, os, device, scammer.user_id, scammer.name);
        } else {
            await updateOldData(scammer, ip, token, useragent, browser, os, device);
        }
        //if user give redirect link we need to redirect there else need to render error page
        if (redirect_link) {
            res.redirect(redirect_link);
        } else {
            //render the error page
            res.render("error");
        }
    } else {
        //render the error page
        res.render("error");
    }

}

async function storeNewdata(scammer, ip, token, useragent, browser, os, device, user_id, name) {

    let data = await getLocation(ip);
    if (data) {
        let {
            city,
            region,
            country,
            org
        } = data;
        let new_scammer = new scammermodel({
            token: token,
            scammername: scammer.
            scammername,
            isvisited: true,
            ip: ip,
            city: city,
            region: region,
            country: country,
            city: city,
            org: org,
            device: device,
            os: os,
            browser: browser,
            visited_date: new Date(),
            user_id: user_id,
            name: name
        });
        new_scammer.save()
            .catch((err) => {
                logError(err);
            });
    }
}

async function updateOldData(scammer, ip, token, useragent, browser, os, device) {
    let data = await getLocation(ip);
    try {
        if (data) {
            let {
                city,
                region,
                country,
                org
            } = data;

            let new_scammer = await scammermodel.findOneAndUpdate({
                token: token
            }, {
                scammername: scammer.scammername,
                isvisited: true,
                ip: ip,
                city: city,
                region: region,
                country: country,
                city: city,
                org: org,
                device: device,
                os: os,
                browser: browser,
                visited_date: new Date()
            });
        }
    } catch (err) {
        logError(err);
    }
}

//getting location based on ip add
async function getLocation(ip) {
    try {
        let res = await axios.get("https://ipapi.co/" + ip + "/json/");
        if (res["data"]["error"] == true) {
            console.log(res["data"]["reason"]);
        }
        return res["data"];
    } catch (err) {
        logError(err);
        return -1;
    }

}

module.exports = {
    get
};