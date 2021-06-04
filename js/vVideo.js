
const params = new URLSearchParams(window.location.search);
const videoId = params.get("watch")

let width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
let height = (window.innerHeight > 0) ? window.innerHeight : screen.height;

console.log('Video ID: ',videoId)
console.log('Width: ',width)
console.log('Height: ',height)

let ver = document.getElementById('ver')
//ver.textContent = "v0.0.9"

let setWidthHeight = function () {
    let vidctrl = document.getElementById('vidctrl')
    if (width > height) {                               // Landscape
        console.log('Orientation: Landscape')
        vidctrl.setAttribute("width","100%")
        vidctrl.removeAttribute("height")
    } else {                                            // Portrait
        console.log('Orientation: Portrait')
        vidctrl.setAttribute("height","100%")
        vidctrl.removeAttribute("width")
    }
}

let setVideoAttr = function () {
    let vidsrc = document.getElementById('vidsrc')
    vidsrc.setAttribute("src","video/"+videoId+".mp4")
    vidsrc.setAttribute("type","video/mp4")
    vidctrl.setAttribute("src","video/"+videoId+".mp4")
    vidctrl.setAttribute("type","video/mp4")
}



