function closePopup()
{
	var popup_container=document.querySelector(".popup_container");
	popup_container.style.display="none";
}

function main(){
	var popup_button=document.querySelector(".popup_button");
	popup_button.addEventListener("click",closePopup);
}
main();
