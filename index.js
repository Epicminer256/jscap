function main(){
    // Remove loading screen
    document.getElementById('waitjs').remove()

    var video = document.createElement('video');
    video.muted = true;
    
    document.body.appendChild(video)
    let introText = document.createElement('p');
    introText.classList.add("centerscreen")
    introText.textContent = "Hover the left side to open menu"
    document.body.appendChild(introText) 
    function removeIntro(){
        introText.remove()
	document.body.removeEventListener("mousedown", removeIntro, false);
	document.body.removeEventListener("keydown", removeIntro, false);
    }
    document.body.addEventListener("mousedown", removeIntro, true)
    document.body.addEventListener("keydown", removeIntro, true)
    setTimeout(removeIntro, 5000)
    
    window.videoSettings = new videoProperties();
    window.mShortcuts = new mouseShortcuts(video);
    window.cap2vid = new capturecard2Video(video, videoSettings)
    window.sidebar = new capturecard2VideoSidebar(cap2vid)
    window.keybinds = new capturecard2VideoKeybinds(cap2vid)

    // Starts the video
    cap2vid.changeDevice()
}

class capturecard2VideoKeybinds{
    constructor(cap2vid){
        this.cap2vid = cap2vid
        window.addEventListener('keydown', this.onkey.bind(this));
    }
    openHelp(){
        alert(`Keybinds:
        ? or / : Show Help page

        f : Fullscreen (or double click video)
        l : Lock/Hide mouse cursor (or single click video)
        m : Mutes and unmutes
	p : Request Picture in Picture

        w : Set width
        h : Set height
        s : Set FPS
        `)
    }
    onkey(e){ 
        if(e.key == "f"){
            document.body.requestFullscreen();
        }
        if(e.key == "l"){
            document.body.requestPointerLock();
        }
        // add changing devices later
        if(e.key == "w"){
            this.videoProperties.width = prompt("What width do you want to set?", videoSettings.width);
        }
        if(e.key == "h"){
            this.videoProperties.height = prompt("What height do you want to set?", videoSettings.height);
        }
        if(e.key == "s"){
            this.videoProperties.fps = prompt("What FPS do you want to set?", videoSettings.fps);
        }
        // add toggle mute later
        if(e.key == "p"){
            this.cap2vid.video.requestPictureInPicture();
        }
        if(e.key == "?" || e.key == "/"){
            this.openHelp();
        }
    }
}
class capturecard2VideoSidebar{
    constructor(capturecard2Video){
        this.cap2vid = capturecard2Video;

        this.videobottom = document.createElement('div');

        this.muteButton = document.createElement('button');
        this.muteButton.textContent = 'Unmute (m)';
        this.muteButton.onclick = this.toggleMute.bind(this);
        this.videobottom.appendChild(this.muteButton);
        
        this.widthElement = document.createElement('input');
        this.widthElement.onchange = (object) => {
            videoSettings.width = object.srcElement.value
            cap2vid.changeDevice()
        }
        this.widthElement.value = this.cap2vid.videoProperties.width;
        this.videobottom.appendChild(this.widthElement)
        
        this.heightElement = document.createElement('input');
        this.heightElement.onchange = (object) => {
            videoSettings.height = object.srcElement.value
            cap2vid.changeDevice()
        }
        this.heightElement.value = this.cap2vid.videoProperties.height;
        this.videobottom.appendChild(this.heightElement)

        this.fpsElement = document.createElement('input');
        this.fpsElement.onchange = (object) => {
            videoSettings.fps = object.srcElement.value
            cap2vid.changeDevice()
        }
        this.fpsElement.value = this.cap2vid.videoProperties.fps;
        this.videobottom.appendChild(this.fpsElement)
        this.videobottom.id = "videobottom"

        this.settingbar = document.createElement('div');
        this.settingbar.id = "settingbar"
        this.hoverbar = document.createElement('div');
        this.hoverbar.id = "hoverbar"
        this.devices = document.createElement('div');
        this.devices.id = "devices"
        this.buttons = document.createElement('div');
       
        this.helpElement = document.createElement('button');
        this.muteElement = document.createElement('button');
        this.refreshElement = document.createElement('button');
        this.pipElement = document.createElement('button');

        this.helpElement.onclick = this.openHelp;
        this.muteElement.onclick = this.togglemute;
        this.refreshElement.onclick = this.getDevices;
        this.pipElement.onclick = this.cap2vid.video.requestPictureInPicture;

        document.body.appendChild(this.hoverbar);
        document.body.appendChild(this.settingbar);
        this.settingbar.appendChild(this.devices);
        this.settingbar.appendChild(this.buttons);
        this.settingbar.appendChild(this.videobottom);
 
        this.refreshDevices()
	
	setInterval(this.refreshDevices.bind(this), 1000)
    }
    changeDeviceHandler(element,ms){
        // ms is essentually self, come up with a better name
        if(element.srcElement.getAttribute('videoDevice') == null){}else{
            ms.cap2vid.videoProperties.deviceId.video = element.srcElement.getAttribute('videoDevice')
        }
        if(element.srcElement.getAttribute('audioDevice') == null){}else{
            ms.cap2vid.videoProperties.deviceId.audio = element.srcElement.getAttribute('audioDevice')
        }
        ms.cap2vid.changeDevice()
    }
    toggleMute(){
        this.cap2vid.video.muted = !this.cap2vid.video.muted
        if(video.muted == true){
            this.muteButton.textContent = "Unmute (m)"
        }else{
            this.muteButton.textContent = "Mute (m)"
        }
    }
    refreshDevices(){
        this.cap2vid.mediaDevices.enumerateDevices().then((mediaDevices) => {
            this.devices.innerHTML = `
            `;
            let d = {}
            mediaDevices.forEach(mediaDevice => {
                let label = "";
                if(mediaDevice.label == ""){
                  label = "Null/Default"
                }else{
                  label = mediaDevice.label
                }
                if(mediaDevice.kind == 'videoinput') {
                    if(typeof this.devices[mediaDevice.groupId] == "undefined"){
                        d[mediaDevice.groupId] = {
                            "label": label
                        }
                    }
                    d[mediaDevice.groupId]["video"] = mediaDevice.deviceId
                }
                if(mediaDevice.kind == 'audioinput') {
                    if(typeof this.devices[mediaDevice.groupId] == "undefined"){
                        d[mediaDevice.groupId] = {
                            "label": label
                        }
                    }
                    d[mediaDevice.groupId]["audio"] = mediaDevice.deviceId
                }
            });
            for(let e in d){
                if(typeof d[e]["video"] == "string" || typeof d[e]["audio"] == "string"){
                    let a = document.createElement('button');
                    let iconhtml = ""
                    if(typeof d[e]["video"] == "string" && typeof d[e]["audio"] == "string"){
                        a.id = "vaButton";
                        iconhtml = iconhtml + `<i class="bi bi-collection-play-fill"></i>`
                        a.setAttribute('videoDevice', d[e]["video"])
			if(d[e]['video'] == this.cap2vid.videoProperties.deviceId.video && d[e]['audio'] == this.cap2vid.videoProperties.deviceId.audio){
			    iconhtml = '<i class="bi bi-camera-video-fill"></i>';
			}
                        a.setAttribute('audioDevice', d[e]["audio"])
                    }else{
                        if(typeof d[e]["video"] == "string"){
                            a.id = "videoButton";
                            iconhtml = iconhtml + `<i class="bi bi-camera-video"></i>`
                            a.setAttribute('videoDevice', d[e]["video"])
                            if(d[e]['video'] == this.cap2vid.videoProperties.deviceId.video){
                                iconhtml = '<i class="bi bi-camera-video-fill"></i>';
			    }
                        }
                        if(typeof d[e]["audio"] == "string"){
                            a.id = "audioButton";
                            iconhtml = iconhtml + `<i class="bi bi-speaker"></i>`
                            a.setAttribute('audioDevice', d[e]["audio"])
				if(d[e]['audio'] == this.cap2vid.videoProperties.deviceId.audio){
                                iconhtml = '<i class="bi bi-speaker-fill"></i>';
			    }
                        }
                        a.innerHTML = iconhtml + d[e]["label"];
                        a.onclick = (e) => {
                            this.changeDeviceHandler(e, this)
                        }
                        this.devices.appendChild(a);
                    }
                }
            }
        });
    }
}

class capturecard2Video{
    constructor(video, videoProperties){
        this.video = video;
        this.videoProperties = videoProperties;
        this.mediaDevices = navigator.mediaDevices;
    }
    changeDevice(){
        let constraints = {
            video: {
              width: this.videoProperties.width,
              height: this.videoProperties.height,
              frameRate: this.videoProperties.fps
            },
            audio: {
                echoCancellation: false,
                autoGainControl: false,
                noiseSuppression: false,
            }
        }
        if(typeof this.videoProperties.deviceId.video == "string"){
            constraints.video.deviceId = this.videoProperties.deviceId.video
        }
        if(typeof this.videoProperties.deviceId.audio == "string"){
            constraints.audio.deviceId = this.videoProperties.deviceId.audio
        }
        this.mediaDevices.getUserMedia(constraints).then((stream) => {
            this.video.srcObject = stream;
            this.video.addEventListener("loadedmetadata", () => {
                this.video.play();
            });
        }).catch(alert);
    }
}

class videoProperties{
    constructor(){
        this.width = 1280;
        this.height = 720;
        this.fps = 60;
        this.deviceId = {
            audio: false,
            video: false
        };
    }
}

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

main()
