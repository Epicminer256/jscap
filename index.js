document.getElementById('waitjs').remove()

var video = document.createElement('video');
video.muted = true;

document.body.appendChild(video)


window.videoSettings = new videoProperties();
window.mShortcuts = new mouseShortcuts(video);
window.cap2vid = new capturecard2Video(video, videoSettings)
window.sidebar = new capturecard2VideoSidebar(window.cap2vid)

// Starts the video
cap2vid.changeDevice()
