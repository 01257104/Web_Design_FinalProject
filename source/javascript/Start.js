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
            location.href = "./source/html/Game.html";
        }, 300); // 與 CSS transition 的時間一致
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
