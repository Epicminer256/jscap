function main(){
    // Remove loading screen
    document.getElementById('waitjs').remove()

    var video = document.createElement('video');
    video.muted = true;
    
    const videoSettings = new videoProperties();
    const mShortcuts = new mouseShortcuts(video);
    const cap2vid = new capturecard2Video(video, videoSettings)
    const sidebar = new sideBar(cap2vid)

    document.body.addEventListener('mousedown', (e) => {
        mShortcuts.clicked(e, mShortcuts)
    });

    var settingbar = document.createElement('div');
    var hoverbar = document.createElement('div');
    var devices = document.createElement('div');
    var buttons = document.createElement('div');
    var videobottom = document.createElement('div');
    var wInEl = document.createElement('input');
    var hInEl = document.createElement('input');
    var fpsInEl = document.createElement('input');

    settingbar.id = "settingbar";
    hoverbar.id = "hoverbar";
    devices.id = "devices";
    buttons.id = "buttons";
    video.id = "video";
    videobottom.id = "videobottom";
    wInEl.id = "wInEl";
    hInEl.id = "hInEl";
    fpsInEl.id = "fpsInEl";

    document.body.appendChild(hoverbar);
    document.body.appendChild(settingbar);
    document.body.appendChild(video)
    settingbar.appendChild(devices);
    settingbar.appendChild(buttons);
    settingbar.appendChild(videobottom);
    videobottom.innerHTML = `
    Width:<input id="wInEl">Height:<input id="hInEl">FPS:<input id="fpsInEl">
    `
    document.getElementById('wInEl').value = videoSettings.width;
    document.getElementById('hInEl').value = videoSettings.height;
    document.getElementById('fpsInEl').value = videoSettings.fps;

    // Input handlers
    var singleClick = function(e) {
        if (document.pointerLockElement === document.body) {
            document.exitPointerLock()
        }else{
            document.body.requestPointerLock()
        }
    }

    function openHelp(){
        alert(`Keybinds:
        ? or / : Show Help page

        f : Fullscreen (or double click video)
        l : Lock/Hide mouse cursor (or single click video)
        m : Mutes and unmutes

        c : change devices
        w : Set width
        h : Set height
        s : Set FPS
        `)
    }
    window.addEventListener('keydown', function (e) {
        if(e.key == "f"){
            document.body.requestFullscreen();
        }
        if(e.key == "l"){
            document.body.requestPointerLock();
        }
        if(e.key == "c"){
            getDevices()
            let arr = []
            let finalstring = ""
            for(let devi in d){
                arr.push(d[devi])
            }
            for(let devi in arr){
                finalstring += devi+": "+arr[devi].label+"\n";
            }
            a = arr[prompt("What device do you want to use?\n"+finalstring)]
            console.log(a)
            if(typeof a['video'] == 'string'){
                videoSettings.deviceId.video = a['video']
            }
            if(typeof a['audio'] == 'string'){
                videoSettings.deviceId.audio = a['audio']
            }
            cap2vid.changeDevice()
        }
            
        if(e.key == "w"){
            videoSettings.width = prompt("What width do you want to set?", videoSettings.width);
        }
        if(e.key == "h"){
            videoSettings.height = prompt("What height do you want to set?", videoSettings.height);
        }
        if(e.key == "s"){
            videoSettings.fps = prompt("What FPS do you want to set?", videoSettings.fps);
        }
        if(e.key == "m"){
            toggleMute();
        }
        if(e.key == "p"){
            video.requestPictureInPicture();
        }
        if(e.key == "?" || e.key == "/"){
            openHelp();
        }
    }, false);              
    function toggleMute(){
        video.muted = !video.muted
        if(video.muted == true){
            document.getElementById('mute').textContent = "Unmute (m)"
        }else{
            document.getElementById('mute').textContent = "Mute (m)"
        }
    }
    document.getElementById('wInEl').onchange = (object) => {
        videoSettings.width = object.srcElement.value
        cap2vid.changeDevice()
    }
    document.getElementById('hInEl').onchange = (object) => {
        videoSettings.height = object.srcElement.value
        cap2vid.changeDevice()
    }
    document.getElementById('fpsInEl').onchange = (object) => {
        videoSettings.fps = object.srcElement.value
        cap2vid.changeDevice()
    }
    function changeDeviceHandler(element){
        if(element.srcElement.getAttribute('videoDevice') == null){}else{
            videoSettings.deviceId.video = element.srcElement.getAttribute('videoDevice')
        }
        if(element.srcElement.getAttribute('audioDevice') == null){}else{
            videoSettings.deviceId.audio = element.srcElement.getAttribute('audioDevice')
        }
        cap2vid.changeDevice()
    }
    function getDevices(){
        cap2vid.mediaDevices.enumerateDevices().then((mediaDevices) => {
            devices.innerHTML = `
            <button onclick=openHelp() >Getting started (?)</button>
            <button id="mute" onclick=toggleMute() >Unmute (m)</button>
            <button onclick=getDevices() >Refresh (r)</button>
            <button onclick=video.requestPictureInPicture()> Picture in picture (p)</button>
            <br>`;
            d = {}
            mediaDevices.forEach(mediaDevice => {
                if(mediaDevice.label == ""){
                  label = "Null/Default"
                }else{
                  label = mediaDevice.label
                }
                if(mediaDevice.kind == 'videoinput') {
                    if(typeof devices[mediaDevice.groupId] == "undefined"){
                        d[mediaDevice.groupId] = {
                            "label": label
                        }
                    }
                    d[mediaDevice.groupId]["video"] = mediaDevice.deviceId
                }
                if(mediaDevice.kind == 'audioinput') {
                    if(typeof devices[mediaDevice.groupId] == "undefined"){
                        d[mediaDevice.groupId] = {
                            "label": label
                        }
                    }
                    d[mediaDevice.groupId]["audio"] = mediaDevice.deviceId
                }
            });
            for(e in d){
                if(typeof d[e]["video"] == "string" || typeof d[e]["audio"] == "string"){
                    a = document.createElement('button');
                    iconhtml = ""
                    if(typeof d[e]["video"] == "string" && typeof d[e]["audio"] == "string"){
                        a.id = "vaButton";
                        iconhtml = iconhtml + `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-collection-play" viewBox="0 0 16 16"><path d="M2 3a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 0-1h-11A.5.5 0 0 0 2 3zm2-2a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7A.5.5 0 0 0 4 1zm2.765 5.576A.5.5 0 0 0 6 7v5a.5.5 0 0 0 .765.424l4-2.5a.5.5 0 0 0 0-.848l-4-2.5z"></path><path d="M1.5 14.5A1.5 1.5 0 0 1 0 13V6a1.5 1.5 0 0 1 1.5-1.5h13A1.5 1.5 0 0 1 16 6v7a1.5 1.5 0 0 1-1.5 1.5h-13zm13-1a.5.5 0 0 0 .5-.5V6a.5.5 0 0 0-.5-.5h-13A.5.5 0 0 0 1 6v7a.5.5 0 0 0 .5.5h13z"></path></svg>`
                        a.setAttribute('videoDevice', d[e]["video"])
                        a.setAttribute('audioDevice', d[e]["audio"])
                    }else{
                        if(typeof d[e]["video"] == "string"){
                            a.id = "videoButton";
                            iconhtml = iconhtml + `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0z" fill="none"></path><path fill="white" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"></path></svg>`
                            a.setAttribute('videoDevice', d[e]["video"])
                        }
                        if(typeof d[e]["audio"] == "string"){
                            a.id = "audioButton";
                            iconhtml = iconhtml + `<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M0 0h24v24H0z" fill="none"/><path fill="white" d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>`
                            a.setAttribute('audioDevice', d[e]["audio"])
                        }
                        a.innerHTML = iconhtml + d[e]["label"];
                        a.onclick = changeDeviceHandler
                        devices.appendChild(a);
                    }
                }
            }
        });
    }

    // Starts the video
    getDevices()
    cap2vid.changeDevice()
}

class sideBar{
    constructor(video, videoProperties){
        
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
    clicked(e, ms){
        // ms is essentually just the "self" variable
        // remove this comment later when a better var name is made
        if(e.target == ms.videoElement || document.pointerLockElement === document.body){
            clearTimeout(ms.timer);
            ms.clicks++;
            ms.timer = setTimeout(function() {
                if(ms.clicks==1) ms.singleClick(e);
                if(ms.clicks==2) ms.doubleClick(e);
                ms.clicks = 0;
            }, ms.doubleClickTime);
        }
    }
}

main()
