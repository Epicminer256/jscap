class capturecard2Video{
    constructor(video, videoProperties){
        this.video = video;
        this.videoProperties = videoProperties;
        this.mediaDevices = navigator.mediaDevices;
    }
    changeDevice(){
        let constraints = {
            video: {
              width: {
                  min: this.videoProperties.width,
                  max: this.videoProperties.width,
              },
              height: {
                  min: this.videoProperties.height,
                  max: this.videoProperties.height,
              },
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
