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
