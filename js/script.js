console.log("hello");
let currentSong=new Audio();
let songs;
function secondsToMinutesSeconds(seconds) {
    // Calculate minutes and remaining seconds
    if(isNaN(seconds)||seconds<0){
        return "00:00";
    }
    const minutes=Math.floor(seconds/60);
    const remainingSeconds=Math.floor(seconds%60);
    const formattedMinutes=String(minutes).padStart(2,'0');
    const formattedSeconds=String(remainingSeconds).padStart(2,'0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }
  

async function getSongs(){
    let a=await fetch("http://127.0.0.1:5500/songs/");
    let response=await a.text();
    console.log(response);
   let div=document.createElement("div");
   div.innerHTML=response;
   let as=div.getElementsByTagName("a");
   console.log(as)
   let songs=[]
   for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split("/songs/")[1])
    }
}
return songs;
  
}
const playMusic=(track,pause=false)=>{
    // let audio=new Audio("/songs/"+track)
    currentSong.src="/songs/"+track
    if(!pause){

        currentSong.play()
        play.src="img/play.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"

}
async function main(){
   

    // get the song list
    let songs=await getSongs()
    playMusic(songs[0],true)
    console.log(songs)
    // show all the songs in the playlist
    let songUL=document.querySelector(".songList").getElementsByTagName("ul")[0]
    for(const song of songs){
        songUL.innerHTML=songUL.innerHTML+`
        <li>
                            <img src="img/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20"," ")}</div>
                                <div>Nakul</div>
                            </div>
                            <div class="playnow">
                                <span>Play now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div>
                        </li>
        `
    }

// audio.addEventListener("loadeddata", () => {
//   let duration = audio.duration;
//   console.log(audio.duration,audio.currentSrc,audio.currentTime)
//   // The duration variable now holds the duration (in seconds) of the audio clip
// });

// Attach an event listener to each song
Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
    e.addEventListener("click",element=>{
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());

    })
});
// Attach an event listener to play,next and previous
play.addEventListener("click",()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src="img/play.svg"
    }
    else{
        currentSong.pause()
        play.src="img/pause.svg"
    }
})
// Listen for time update event
currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime, currentSong.duration)
    document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%"
})
// Add an event listener to seek bar
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
document.querySelector(".circle").style.left=percent+"%";
currentSong.currentTime= ((currentSong.duration)*percent)/100
})

//add an event listener for hamburger:
document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left="0"
    
})
//add an event listener for Close button:
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-120%"
    
})
// add an event listener

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

        // Add an event to volume
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            console.log("Setting volume to", e.target.value, "/ 100")
            currentSong.volume = parseInt(e.target.value) / 100
            if (currentSong.volume >0){
                document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
            }
        })

}
main()