var popup_container=document.querySelector(".popup_container");
var is_sucess=true;
async function removeVictim(event){

			let removeicon= event.target;
			let id=removeicon.classList[1];
			let body=JSON.stringify({"id":id});
			let res=await fetch("/api/remove",{
											method:"post",
											headers:{"Content-Type":"application/json"},
											body:body
										});
			res=await res.json();
			if(res.status=="Sucess")
			{
				popup_container.style.display="flex";
				popup_container.children[0].children[0].innerText="Sucessfully removed";
			}
			else
			{
				popup_container.style.display="flex";
				popup_container.children[0].children[0].innerText=res.error_msg;
				is_sucess=false;
			}

}
function closePopup()
{
	var popup_container=document.querySelector(".popup_container");
	popup_container.style.display="none";
	if(is_sucess){
		window.history.back();
	}

}

function main(){
	var popup_button=document.querySelector(".popup_button");
	popup_button.addEventListener("click",closePopup);

}
main();
