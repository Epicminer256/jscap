class IntroText{
	contructor(){
		self.introText = document.createElement('p');
		self.introText.classList.add("centerscreen")
		self.introText.id = "introText"
		self.introText.textContent = "Hover the left side to open menu"
		document.body.appendChild(introText) 


		document.body.addEventListener("mousedown", removeIntro, true)
		document.body.addEventListener("keydown", removeIntro, true)
		setTimeout(self.removeIntro, 5000)
	}

	removeIntro(){
		self.introText.remove()
		document.body.removeEventListener("mousedown", removeIntro, false);
		document.body.removeEventListener("keydown", removeIntro, false);
	}
}
