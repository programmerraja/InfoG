function toggleNav() {
	
		let togglebutton=document.querySelector(".lines");
		let closebutton=document.querySelector(".crosslines");
		var nav_list=document.querySelector(".nav_list");
		togglebutton.addEventListener("click",toggle);
		closebutton.addEventListener("click",toggle);

		function toggle()
		{
			nav_list.classList.toggle("nav_list_show");		
			closebutton.classList.toggle("crosslines_show");
			togglebutton.classList.toggle("lines_hide");
		}
		// body...
	}
toggleNav();