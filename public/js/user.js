var popup_container = document.querySelector(".popup_container");
var loading_container = document.querySelector(".loading_container");


async function getLink() {

  let scammername = document.querySelector(".scammername").value;

  let redirect_link = document.querySelector(".img_link").value;

  let linkbox = document.querySelector(".link");
  linkbox.value = "Fetching.........";

  let body = JSON.stringify({
    "scammername": scammername,
    redirect_link: redirect_link
  })

  let res = await fetch("/api/link", {
    method: "post",
    headers: {
      "Content-Type": "application/json"
    },
    body: body
  });
  res = await res.json();
  if (res.status === "Sucess") {
    linkbox.value = window.location.origin + "/token/" + res.token;
    fetchVictim();
  } else if (res.status === "Failed") {
    linkbox.value = "";
    popup_container.style.display = "flex";
    popup_container.children[0].children[0].innerText = res.error_msg;
  }
}


function insertToTable(obj, table) {
  let row = '<div class="tr">\
						  	<div class="td">\
						  	<a href="' + window.location.origin + '/user/scammer/id/' + obj.user_id + '">' + obj.scammername + '</a></div>\
						  	<div class="td">' + obj.isvisited + '</div>\
					  	</div>'

  table.innerHTML += row;
}
async function fetchVictim() {
  loading_container.style.display = "flex";
  var table = document.querySelector(".table");
  var info_text = document.querySelector(".info_text");
  var children = table.children;
  if (children.length > 1) {
    for (let i = 0; i < children.length; i++) {
      children[1].remove();
    }
  }
  try {
    let res = await fetch("/api/get");
    res = await res.json();
    if (res.status == "Sucess") {
      if (res["scammerdata"]) {
        if (res["scammerdata"].length > 0) {
          loading_container.style.display = "none";
          table.style.display = "flex";
          info_text.style.display = "none";
          res["scammerdata"].forEach((scammer) => {
            var user_id = scammer["_id"];
            var scammername = scammer["name"];
            var ip = scammer["ip"] ? scammer["ip"] : "Not Known";
            var city = scammer["city"] ? scammer["city"] : "Not Known";
            var region = scammer["region"] ? scammer["region"] : "Not Known";
            var country = scammer["country"] ? scammer["country"] : "Not Known";
            var org = scammer["org"] ? scammer["org"] : "Not Known";

            if (scammer["device"]) {
              var vendor = scammer["device"]["vendor"] ? scammer["device"]["vendor"] : "Not Known";
              var model = scammer["device"]["model"] ? scammer["device"]["model"] : "Not Known";
              var type = scammer["device"]["type"] ? scammer["device"]["type"] : "Not Known";
            } else {
              var vendor = "Not Known";
              var model = "Not Known";
              var type = "Not Known";
            }
            var link = window.location.origin + "/token/" + scammer["token"];
            var os = scammer["os"] ? scammer["os"] : "Not Known";
            var browser = scammer["browser"] ? scammer["browser"] : "Not Known";
            var isvisited = scammer["isvisited"];
            insertToTable({
              user_id,
              scammername,
              ip,
              city,
              region,
              country,
              org,
              vendor,
              model,
              type,
              isvisited,
              link
            }, table);
          });
        } else {
          info_text.style.display = "block";
        }
      }
    } else {
      popup_container.style.display = "flex";
      popup_container.children[0].children[0].innerText = res.error_msg;
    }
    loading_container.style.display = "none";
  } catch (e) {
    popup_container.style.display = "flex";
    popup_container.children[0].children[0].innerText = e.message;
  }

}

function copyLink() {
  let copytext = document.querySelector(".link");
  copytext.select();
  copytext.setSelectionRange(0, 99999);
  document.execCommand("copy");
  let text = document.querySelector(".copy_text");
  text.style.display = "flex";
  setTimeout(() => {
    document.querySelector(".copy_text").style.display = "none"
  }, 500);
}

function main() {
  fetchVictim();
  var getbutton = document.querySelector(".getlink");
  getbutton.addEventListener("click", getLink);

  var copybutton = document.querySelector(".copy-img");
  copybutton.addEventListener("click", copyLink);

}

main()