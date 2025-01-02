//轉場的javascript
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('Gamestart_Button');
    const transitionBlock = document.getElementById('TransitionBlock');

    startButton.addEventListener('click', () => {
        
        localStorage.setItem("Gamemode transition", true);
       
        transitionBlock.classList.add('active');

        setTimeout(() => {
            //render server連結
            location.href = "https://web-design-finalproject.onrender.com/";
            //本地端連結
            //location.href = "http://localhost:3000/";
        }, 300);
    });
});

//選單按鈕地展開與收縮
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');

    // 切換選單展開/收起
    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('open'); 
        menuButton.classList.toggle('rotate'); 
    });

    //收起選單
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
            menuButton.classList.remove('rotate');
        });
    });
});



const video = document.getElementById('myVideo');
const fadeContent = document.getElementById('fadeContent');

video.addEventListener('ended', function () {
    if (fadeContent) {
        fadeContent.classList.add('active');
    }
});

//兩個影片接續撥放
document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('myVideo');
    const videoSource = document.getElementById('videoSource');

    const videos = ['background1.mp4', 'background2.mp4'];
    let currentVideoIndex = 0;

    videoElement.addEventListener('ended', () => {
        if (currentVideoIndex < videos.length - 1) {
            currentVideoIndex++;
            videoSource.src = videos[currentVideoIndex];
            videoElement.load();
            videoElement.play(); 
        } else {
            videoElement.loop = true;
            videoElement.play(); 
        }
    });
});

//backgroundmusic
document.addEventListener('click', () => {
    const audio = document.getElementById('backgroundMusic');
    audio.volume = 0.4;
    if (audio.muted) {
        audio.muted = false;
        audio.play();
    }
});
