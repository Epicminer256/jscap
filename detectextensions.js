let a = setInterval(() => {
	if(document.querySelector(".vimiumReset")){
		alert("You are using vimium, you should exclude this website and use the site's built-in keybinds")
		clearInterval(a)
	}
}, 1000)
