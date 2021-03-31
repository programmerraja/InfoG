var popup_container=document.querySelector(".popup_container");


async function RemoveUser(event)
	{
		let user_id=event.target.id;
		let body=JSON.stringify({user_id:user_id});
		
		let res=await fetch("/admin/user/remove/",{
											method:"post",
											headers:{"Content-Type":"application/json"},
											body:body
										}
							);
		res=await res.json();
		if(res.status==="Sucess")
		{
			popup_container.style.display="flex";
			popup_container.children[0].children[0].innerText=res.error_msg;
			fetchUser();

		}
		else
		{
			popup_container.style.display="flex";
			popup_container.children[0].children[0].innerText=res.error_msg;
			fetchUser();
		}
		
	}

  
	function insertToTable(obj,table){
				console.log(obj)
				let row='<div class="tr">\
						  	<div class="td">'+obj.username+'</a></div>\
						  	<div class="td">'+obj.email+'</div>\
						  	<div class="td">'+obj.created_date+'</div>\
						  	<div class="td">'+obj.is_verified+'</div>\
						  	<div class="td">\
						  	<input type="button" class="remove_user" value="Remove" id="'+obj.user_id+'">\
						  	</div>\
					  	</div>'
				
				table.innerHTML+=row;
		}

	async function fetchUser()
	{
		var table = document.querySelector(".table");
		var info_text=document.querySelector(".info_text");
		var children=table.children;
		if(children.length>1){
			for(let i=0;i<children.length;i++)
			{
				children[1].remove();
			}
		}
		
		let res=await fetch("/admin/users/");
		res=await res.json();
		console.log(res);
		if(res.status=="Sucess")
		{
			if(res["users"]){
			if(res["users"].length>0)
			{
				table.style.display="flex";
				info_text.style.display="none";
				res["users"].forEach((user)=>
				{
					var user_id=user["_id"];
					var username=user["name"];
					var email=user["email"];
					var is_verified=user["is_email_verified"];

					insertToTable({user_id,username,email,is_verified},table);

				});	
			}}	
		}
	}

 
async function  main() {
		await fetchUser();
		let remove_user=document.querySelectorAll(".remove_user");
		remove_user.forEach((button)=>{button.addEventListener("click",(e)=>{RemoveUser(e)})});
	}

main()