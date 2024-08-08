class mouseShortcuts{
	constructor(video){
		this.clicks = 0;
		this.doubleClickTime = 250
		this.timer = false;
		this.videoElement = video;
		document.body.addEventListener('mousedown', this.clicked.bind(this));
	}
	singleClick(){
		if (document.pointerLockElement === document.body) {
			document.exitPointerLock()
		}else{
			document.body.requestPointerLock()
		}
	}
	doubleClick(){
		if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) {
			if (document.documentElement.requestFullscreen) {
				document.documentElement.requestFullscreen();
			} else if (document.documentElement.mozRequestFullScreen) {
				document.documentElement.mozRequestFullScreen();
			} else if (document.documentElement.webkitRequestFullscreen) {
				document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			}
		} else {
			if (document.cancelFullScreen) {
				document.cancelFullScreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			}
		}
	}
	handleClickCount(){
		if(this.clicks==1) this.singleClick();
		if(this.clicks==2) this.doubleClick();
		this.clicks = 0;
	}
	clicked(e){
		if(e.target == this.videoElement || document.pointerLockElement === document.body){
			this.clicks++;
			this.timer = setTimeout(this.handleClickCount.bind(this), this.doubleClickTime);
		}
	}
}
