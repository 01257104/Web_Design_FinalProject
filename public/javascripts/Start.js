//轉場的javascript
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('Gamestart_Button');
    const transitionBlock = document.getElementById('TransitionBlock');

    startButton.addEventListener('click', () => {
        //將轉場的localstorage設為true，觸發轉場
        localStorage.setItem("Gamemode transition", true);
        // 加入 .active 類，觸發轉場動畫
        transitionBlock.classList.add('active');

        setTimeout(() => {
            // 替換為您的遊戲頁面路徑
            location.href = "http://localhost:3000/";
        }, 300); // 與 CSS transition 的時間一致
    });
});

//選單按鈕地展開與收縮
document.addEventListener('DOMContentLoaded', () => {
    const menuButton = document.getElementById('menuButton');
    const sidebar = document.getElementById('sidebar');

    // 點擊按鈕切換選單展開/收起
    menuButton.addEventListener('click', () => {
        sidebar.classList.toggle('open'); // 切換 sidebar 的 open 狀態
        menuButton.classList.toggle('rotate'); // 切換按鈕的旋轉效果
    });

    // 點擊選單內的項目後自動收起選單
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            sidebar.classList.remove('open');
            menuButton.classList.remove('rotate');
        });
    });
});



// 取得影片元素和淡入元素
const video = document.getElementById('myVideo');
const fadeContent = document.getElementById('fadeContent');

// 當影片播放結束時執行
video.addEventListener('ended', function () {
    // 影片播放結束後添加 active 類別，觸發淡入效果
    if (fadeContent) {
        fadeContent.classList.add('active');
    }
});

//兩個影片接續撥放
document.addEventListener('DOMContentLoaded', () => {
    const videoElement = document.getElementById('myVideo');
    const videoSource = document.getElementById('videoSource');

    // 定義三部影片的路徑
    const videos = ['background1.mp4', 'background2.mp4'];
    let currentVideoIndex = 0;

    // 監聽影片結束事件
    videoElement.addEventListener('ended', () => {
        // 如果不是最後一部影片，切換到下一部影片
        if (currentVideoIndex < videos.length - 1) {
            currentVideoIndex++;
            videoSource.src = videos[currentVideoIndex];
            videoElement.load(); // 重新加載影片
            videoElement.play(); // 播放影片
        } else {
            // 如果是最後一部影片，設置為循環播放
            videoElement.loop = true;
            videoElement.play(); // 播放影片
        }
    });
});

//backgroundmusic
document.addEventListener('click', () => {
    const audio = document.getElementById('backgroundMusic');
    audio.volume=0.4;
    if (audio.muted) {
        audio.muted = false;
        audio.play();
    }
});
