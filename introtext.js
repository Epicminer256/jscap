class IntroText{
	constructor(){
		this.introText = document.createElement('p');
		this.introText.classList.add("centerscreen")
		this.introText.id = "introText"
		this.introText.textContent = "Hover the left side to open menu"

		document.body.appendChild(this.introText) 

		// Thanks Javascript, I have to mention what "this" means with whatever this means
		this.removeIntro = this.removeIntro.bind(this)

		document.body.addEventListener("mousedown", this.removeIntro, true)
		document.body.addEventListener("keydown", this.removeIntro, true)
		setTimeout(this.removeIntro, 5000)
	}

	removeIntro(){
		this.introText.remove()
		document.body.removeEventListener("mousedown", this.removeIntro, false);
		document.body.removeEventListener("keydown", this.removeIntro, false);
	}
}
