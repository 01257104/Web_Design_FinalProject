let Gamestart_Button = document.querySelector('#Gamestart_Button');
let GameTitle = document.querySelector('#game-title');

Gamestart_Button.addEventListener('click', () => {
    Gamestart_Button.classList.add('fade_out');
    GameTitle.classList.add('fade_out');
});

Gamestart_Button.addEventListener('animationend', () => {
    console.log('Animation ended');
    // GameTitle.remove();
    // Gamestart_Button.remove();
})
