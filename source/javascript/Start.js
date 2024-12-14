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

//音量調整
document.addEventListener('DOMContentLoaded', () => {
    const volumeSlider = document.getElementById('volumeSlider'); // 音量滑桿
    const volumeLabel = document.getElementById('volumeLabel');   // 音量百分比
    const mediaElements = document.querySelectorAll('video, audio'); // 所有影音元素

    // 當滑桿值變化時，調整所有音頻元素的音量
    volumeSlider.addEventListener('input', () => {
        const volume = volumeSlider.value; // 取得滑桿值 (0 ~ 1)
        mediaElements.forEach(media => {
            media.volume = volume; // 設定每個影音元素的音量
        });

        // 更新音量百分比顯示
        const volumePercent = Math.round(volume * 100); // 轉換為百分比
        volumeLabel.textContent = `${volumePercent}%`;
        console.log(`整體音量調整為: ${volumePercent}%`);
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
