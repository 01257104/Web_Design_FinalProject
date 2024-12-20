//Part Main Structure
//=======================================================================我是分隔線==================================================================
//開始的轉場
const transitionBlock = document.getElementById('TransitionBlock');
function startGameTransition() {
    return new Promise(resolve => {
        localStorage.setItem("Gamemode transition", false);
        transitionBlock.style.zIndex = 100;//將Block設到最上層
        // 延遲移除黑屏效果
        setTimeout(() => {
            transitionBlock.classList.add('hidden'); // 加入滑出的 class
        }, 300); // 延遲讓用戶能看到黑屏效果
        setTimeout(() => {
            resolve();
        }, 700);
    });
}
//從json檔案fetch生成文'
fetchTextJSON();
//=======================================================================我是分隔線==================================================================



//Part怪物
//=======================================================================我是分隔線==================================================================
//基本數據
let MobHP = [], MobHP_original = [300, 500, 700, 500, 300];
let MobLevel = [1, 2, 3, 2, 1];
let mobAlive = [true, true, true, true, true];
let mobCD_original = [2, 3, 4, 3, 2], mobCD_current = [];
let mobAtkVal = [1000, 100, 200, 100, 50];
let mobPicSrc = ['../images/Gray_Square.png',
    '../images/Orange_Circle.png',
    '../images/Yellow_Triangle.png',
    '../images/Purple_Hexagon.png',
    '../images/Pink_Pentagon.png'];
//BOSS數據
let BossHP = [700, 1000, 2500];
let BossPicSrc = ['../images/Elon Ma!.jpg', '../images/Elon Ma!.jpg', '../images/Elon Ma!.jpg'];
let BossIndex = 0;
//localStorage設定
localStorage.setItem('userName', 'Eric');
localStorage.setItem("Turn", 1);
localStorage.setItem("score", 0);
localStorage.setItem('renewScore', 0);
mob_init(localStorage.getItem("Turn"));
setTimeout(() => {
    document.getElementById('scoreArea').innerHTML = '<p>score : </p><span id = "score">0</span>';

}, 325);

async function mob_init(turn) {
    document.getElementById('typeBox').disabled = true;
    await startGameTransition();  // 確認是否觸發開始轉場
    await Turn_Transition(turn);  // 等待轉場動畫結束

    // 動態生成HTML中的mob
    let mobArea = document.getElementById('mobArea');
    mobArea.innerHTML = '';
    mobArea.style.display = 'none';
    for (let i = 0; i < 5; ++i) {
        let mob = document.createElement('div');
        mob.classList.add(`mob${i}`, 'mob');
        mob.setAttribute('id', `mob${i}`);
        mob.innerHTML = `
            <ul>
                <li>CD: <span id="mob${i}CD"></span></li>
                <li><span class="mobHP" id="mob${i}HP"></span></li>
            </ul>
            <div id="image-container">
                <img id="mobPic${i}" src="${mobPicSrc[i]}">
                <div id="displayDamage${i}" class="displayDamage"></div>
            </div>
        `;
        mob.style.display = 'flex';
        mobArea.appendChild(mob);
    }

    // 編輯怪物基本數據
    for (let i = 0; i < 5; ++i) {
        // Boss產生
        if (i == 2 && turn % 3 == 0) {
            await BossWarningAnimation();
            MobHP[i] = BossHP[BossIndex++];
            BossIndex = (BossIndex >= 3) ? 0 : BossIndex;
            let mobPic = document.getElementById(`mobPic${i}`);
            mobPic.src = BossPicSrc[BossIndex];
        } else {
            MobHP[i] = MobHP_original[i];
            mobCD_current[i] = mobCD_original[i];
        }

        mobAlive[i] = true;
        document.getElementById(`mob${i}HP`).textContent = `${MobHP[i]}/${MobHP[i]}`;
        document.getElementById(`mob${i}HP`).style.width = `${MobHP[i] / MobHP_original[i] * 100}%`;
        mobCD_current[i] = mobCD_original[i];
        document.getElementById(`mob${i}CD`).textContent = mobCD_current[i];
    }

    // 等待mob區域的動畫結束再顯示
    await MobArea_Animation();

    document.getElementById('typeBox').disabled = false;
    typeBox_Focus();
}

function BossWarningAnimation() {
    return new Promise(resolve => {
        let warningBlock = document.getElementById('warningBlock');

        warningBlock.classList.remove("warningBlock_fade");
        warningBlock.offsetHeight;  // 觸發重排，讓動畫能夠重新開始
        warningBlock.classList.add('warningBlock_fade');
        warningBlock.style.display = 'flex';

        // 等待動畫結束
        warningBlock.addEventListener('animationend', () => {
            warningBlock.classList.remove("warningBlock_fade");
            warningBlock.style.display = 'none';
            resolve();
        });
    });
}

async function MobArea_Animation() {
    return new Promise(resolve => {
        let mobArea = document.getElementById('mobArea');
        mobArea.classList.remove("mob_fade_in");
        void mobArea.offsetWidth; // 觸發重排，使動畫重新啟動
        mobArea.classList.add('mob_fade_in');
        mobArea.style.display = 'flex';
        mobArea.addEventListener('animationend', () => {
            mobArea.classList.remove("mob_fade_in");
            resolve();
        }, { once: true });
    });
}



async function Turn_Transition(turn) {
    return new Promise(resolve => {
        let showTurn = document.getElementById('turnBlock');
        showTurn.innerHTML = `<div>Turn${turn}</div>`;
        // 觸發動畫
        showTurn.classList.remove('turnAnimation'); // 確保清除之前的動畫狀態
        void showTurn.offsetWidth; // 觸發重排，使動畫重新啟動
        showTurn.classList.add('turnAnimation'); // 再次添加動畫類
        showTurn.style.display = 'block';
        showTurn.style.zIndex = 200;

        showTurn.addEventListener('animationend', () => {//動畫結束
            showTurn.classList.remove('turnAnimation');
            showTurn.style.display = 'none';
            showTurn.style.zIndex = 0;

            resolve();
        });
    });

}

async function Mob_move() {//Mob行動步驟
    let allDied = true;
    //更新mob生存狀態
    for (let i = 0; i < 5; ++i) {
        if (MobHP[i] <= 0 && mobAlive[i] === true) {//剛剛被打死
            mobAlive[i] = false;

            // 更新分數
            let score = parseInt(localStorage.getItem("score"));
            score += MobLevel[i] * 1000;
            localStorage.setItem("score", score);
            document.getElementById('score').textContent = score;  // 更新顯示score

            // 執行怪物死亡動畫
            Mob_fade_out(i);
        }
    }

    for (let i = 0; i < 5; ++i) {
        if (mobAlive[i]) {//mob沒死才計算CD，避免mob死亡仍然攻擊玩家
            mobCD_current[i]--;//CD減少1
            document.getElementById(`mob${i}CD`).textContent = mobCD_current[i];//更新顯示
            allDied = false;
        }
    }
    if (allDied) {//mob全死，重置mob並進入下一回合
        let turn = parseInt(localStorage.getItem("Turn"));
        localStorage.setItem("Turn", turn + 1); // 確保回合數更新
        await spaceFunc();//等待450毫秒
        async function spaceFunc() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, 450);
            });
        }
        await mob_init(turn + 1); // 確保初始化完成後再繼續

        //恢復typeBox並focus
        document.getElementById('typeBox').disabled = false;
        typeBox_Focus();

        //重置計時器
        document.getElementById('displayTime').textContent = '0';
        return;
    }
    for (let i = 0; i < 5; ++i) {
        if (mobCD_current[i] <= 0 && currentHP > 0) {//CD到0了，且玩家仍存活
            await mob_attack(i);// 等待動畫結束後再繼續

            if (currentHP <= 0) {//檢查玩家生存狀態
                player_died();//玩家死亡
                break;
            }

            mobCD_current[i] = mobCD_original[i]; // 重置CD
            document.getElementById(`mob${i}CD`).textContent = mobCD_current[i]; // 更新顯示
        }
    }
    //從json檔案fetch生成文'
    fetchTextJSON();
    //恢復typeBox並focus
    document.getElementById('typeBox').disabled = false;
    typeBox_Focus();
    //重置計時器
    document.getElementById('displayTime').textContent = '0';
}

async function mob_attack(mobIndex) {//怪物攻擊玩家
    //window.alert(`mob${mobIndex} attack!`);
    currentHP = (currentHP - mobAtkVal[mobIndex]) > 0 ? currentHP - mobAtkVal[mobIndex] : 0;//玩家生命減少對應mob的攻擊力
    await mob_attack_Animation_step1(mobIndex);
    mob_attack_Animation_step2(mobIndex);
    await mob_attack_damage_Animation(mobIndex);
}

function mob_attack_Animation_step1(mobIndex) {
    return new Promise(resolve => {
        let mob = document.getElementById(`mob${mobIndex}`);
        mob.classList.add('mob_attack_step1');
        mob.addEventListener('animationend', () => {
            //console.log(`Animation for mob${mobIndex} finished!`); // 確認事件觸發
            mob.classList.remove('mob_attack_step1');
            resolve();
        });
    });
}

function mob_attack_Animation_step2(mobIndex) {
    let mob = document.getElementById(`mob${mobIndex}`);
    mob.classList.add('mob_attack_step2');
    mob.addEventListener('animationend', () => {
        //console.log(`Animation for mob${mobIndex} finished!`); // 確認事件觸發
        mob.classList.remove('mob_attack_step2');
    });
}

function mob_attack_damage_Animation(mobIndex) {
    return new Promise(resolve => {
        let effect = document.getElementById('damageEffect');
        effect.textContent = `HP - ${mobAtkVal[mobIndex]}`;
        effect.style.display = 'flex';
        effect.style.zIndex = 200;
        // 觸發動畫
        effect.classList.remove('animate'); // 確保清除之前的動畫狀態
        void effect.offsetWidth; // 觸發重排，使動畫重新啟動
        effect.classList.add('animate'); // 再次添加動畫類
        //更新血量條顯示
        document.getElementById('playerHP_Left').style.height = `${currentHP / totalHP * 100}%`;
        document.getElementById('playerHP_Right').style.height = `${currentHP / totalHP * 100}%`;
        document.getElementById("currentHP").textContent = currentHP;//更新顯示

        effect.addEventListener('animationend', () => {//動畫結束
            console.log(`Animation for mob${mobIndex} finished!`); // 確認事件觸發
            effect.classList.remove('animate');
            effect.style.display = 'none';
            effect.style.zIndex = 0;

            resolve();
        });
    });
}

// 隱藏死亡的怪物
function Mob_fade_out(index) {
    let mob = document.getElementById(`mob${index}`);

    mob.classList.remove('mob_fade_out');
    void mob.offsetWidth; // 觸發重排
    mob.classList.add('mob_fade_out');

    mob.addEventListener('animationend', () => {
        mob.classList.remove('mob_fade_out');
        mob.style.opacity = '0';
    }, { once: true });
}
//=======================================================================我是分隔線==================================================================



//Part玩家
//=======================================================================我是分隔線==================================================================
let currentHP, totalHP = 500;
currentHP = totalHP;
document.getElementById("currentHP").textContent = currentHP;
document.getElementById("totalHP").textContent = totalHP;

async function attack(index, damage) {
    // 更新怪物生命
    MobHP[index] = (MobHP[index] - damage < 0) ? 0 : MobHP[index] - damage;
    document.getElementById(`mob${index}HP`).textContent = `${MobHP[index]}/${MobHP_original[index]}`;
    document.getElementById(`mob${index}HP`).style.width = `${(MobHP[index] / MobHP_original[index]) * 100}%`;

    await displayDamage(index, damage);  // 顯示傷害動畫
}


function displayDamage(index, damage) {//顯示mob受到的傷害
    return new Promise(resolve => {//確保動畫結束再做下一步
        let output = document.getElementById(`displayDamage${index}`);
        output.textContent = `-${damage}`;
        output.style.display = 'block';// 顯示元素並觸發動畫

        setTimeout(() => {
            output.classList.add('mob_fade_out');
        }, 350);
        document.addEventListener('animationend', () => {
            output.style.display = 'none'; // 隱藏元素
            resolve();
        });
    });
}

function PlayerHP_bar(current, total) {
    let bar = document.getElementById('playerHP');
    bar.style.height = `${current / total * 100}%`;
}

//玩家死亡
async function player_died() {
    document.getElementById('typeBox').disabled = true;
    localStorage.setItem('renewScore', 1);

    const score = localStorage.getItem('score');
    document.getElementById('settleScore').textContent = `Your score is ${score}`;
    //排行榜按鈕
    document.getElementById('rankbtn').addEventListener('click', () => {
        document.getElementById('rank').style.display = 'flex';
    });
    //回主畫面按鈕
    document.getElementById('Back_to_StartMode').addEventListener('click', () => {
        localStorage.clear();
        location.href = 'Start.html';
    });
    document.getElementById('tryAgain').addEventListener('click', () => {
        localStorage.clear();
        location.href = location.href;//重新載入頁面
    });
    await menu_fade_in();
}

function returnToGame(){
    document.getElementById('rank').style.display = 'none';
}

function menu_fade_in() {
    return new Promise(resolve => {
        let playerDied = document.getElementById('playerDied');

        // 顯示元素並強制重繪
        playerDied.style.display = 'flex';
        void playerDied.offsetWidth;

        // 添加動畫類別
        playerDied.classList.add('menuFadein');

        // 監聽目標元素的動畫結束事件
        playerDied.addEventListener('animationend', function onAnimationEnd(event) {
            if (event.target === playerDied) { // 確保是目標元素
                playerDied.classList.remove('menuFadein'); // 清除動畫類別
                playerDied.removeEventListener('animationend', onAnimationEnd); // 移除事件監聽
                resolve(); // 完成 Promise
            }
        });
    });
}


function KillAllBtn() {
    //關閉typeBox
    document.getElementById('typeBox').disabled = true;
    for (let i = 0; i < 5; ++i) {
        attack(i, 777);
    }
    if (currentHP > 0) {
        setTimeout(() => {
            Mob_move();
        }, 1000);//一秒延遲
    }
}
//=======================================================================我是分隔線==================================================================



//Part Typing
//=======================================================================我是分隔線==================================================================
//輸入欄位focus
function typeBox_Focus() {
    document.getElementById("typeBox").focus();
}

//目標文本
let targetText = "init";
const targetTextContainer = document.getElementById("TextContainer");

function fetchTextJSON() {
    // 使用 fetch 來讀取 words.json 檔案
    fetch('../JSON_Data/words.json')
        .then(response => response.json())  // 解析 JSON 資料
        .then(data => {
            // 取得 words 屬性並顯示在頁面上
            JsonTextArray = data.words;
            console.log(JsonTextArray[getRandomNum(JsonTextArray.length)]);
            targetText = JsonTextArray[getRandomNum(JsonTextArray.length)];
            targetTextContainer.innerHTML = "";
            split_targetText_to_span();
        })
        .catch(error => {
            console.error('Error fetching JSON:', error);
        })
}

function getRandomNum(max) {
    return Math.floor(Math.random() * max);
}

function split_targetText_to_span() {
    targetText.split("").forEach(char => {//將假文拆分
        let span = document.createElement("span");//新增一個span元素
        if (char === ' ') {//將space元素轉為non breaking space元素
            char = '&nbsp;';
        }
        span.innerHTML = char;//將拆分出來的元素(char)新增到span的內容裡
        targetTextContainer.appendChild(span);//新增span到HTML中
    });
}

//時刻比對文字正確並修改顏色
function Check_Input() {
    const inputText = document.getElementById("typeBox").value;

    targetTextContainer.childNodes.forEach((span, index) => {
        if (inputText[index] === undefined) {
            span.classList = "";
        } else if (inputText[index] === targetText[index]) {
            span.classList.add("correct");
            span.classList.remove("incorrect", "blank_incorrect");
        } else if (inputText[index] != " " && targetText[index] == " ") {
            span.classList.add("blank_incorrect");
            span.classList.remove("incorrect", "correct");
        } else {
            span.classList.add("incorrect");
            span.classList.remove("correct", "blank_incorrect");
        }
    });
    if (inputText.length == targetText.length) {//當打到最後一個字自動送出
        CorrectRateCal('', true);
    }
}

//吃進鍵盤value
let typeBoxValue = document.getElementById("typeBox");
typeBoxValue.addEventListener("keypress", CorrectRateCal, false);//每次吃到鍵盤指令就呼叫CorrectRateCal函式
let firstKeypress = true;//用於檢測是否是第一個打得字，避免重複計時
let start, end, duration, displayTime = 0, timerInterval;//用於計時的變數
document.getElementById('displayTime').textContent = displayTime;

function Timer() {
    let now = new Date();
    start = now.getTime();//getTime的單位為millisecond
    clearInterval(timerInterval);//確保之前的計時器被清除
    timerInterval = setInterval(updateTime, 100); // 每100毫秒更新一次顯示
}

function updateTime() {
    let now = new Date();
    let elapsedTime = (now.getTime() - start) / 1000;//單位為sec
    displayTime = Math.floor(elapsedTime * 100) / 100; //顯示至小數點後兩位
    document.getElementById('displayTime').textContent = displayTime.toFixed(2);
}

//比對正確率並結算時間
function CorrectRateCal(event, autoComplete = false) {
    if (event.key === "Enter") {
        event.preventDefault();
        return;
    }
    if (firstKeypress) {//第一次打字
        Timer();
        firstKeypress = false;
    }

    let input = typeBoxValue.value;
    let targetTextArray = [], inputTextArray = [];
    let CorrectCount = 0;
    if (autoComplete) {//打字完成
        if (!autoComplete) {//如果是用EnventListenr來執行，要防止報錯
            event.preventDefault();//防止報錯用
        }
        //結束計時
        clearInterval(timerInterval); // 停止計時
        updateTime(); // 最後更新時間
        duration = displayTime.toFixed(2);//更新duration
        console.log(`耗時:${duration}sec`);//計算耗時
        firstKeypress = true;//重設firstKeypress


        targetText.split('').forEach((char, index) => {//將目標文本拆分成陣列
            targetTextArray[index] = char;
        });
        input.split('').forEach((char, index) => {//將inputText拆分成陣列
            inputTextArray[index] = char;
        });
        for (let i = 0; i < inputTextArray.length; ++i) {
            if (targetTextArray[i] === inputTextArray[i]) {
                CorrectCount++;
            }
        }
        let correctRate = CorrectCount / targetText.length * 100;
        console.log(`CorrectCount = ${CorrectCount}`);
        console.log(correctRate);
        DamageCalculate(correctRate, duration);//傷害計算

        //reset
        const inputField = document.getElementById("typeBox");
        inputField.value = "";//清除input值
        targetTextContainer.childNodes.forEach(span => {//清除所有標記
            span.classList.remove("correct", "incorrect", "blank_incorrect");
        })
    }
}

//傷害計算
function DamageCalculate(correctRate, duration) {
    //關閉typeBox
    document.getElementById('typeBox').disabled = true;
    let damage = Math.round(correctRate / duration);//傷害計算公式
    for (let i = 0; i < 5; ++i) {
        attack(i, damage);//玩家攻擊mob
    }
    setTimeout(() => {
        Mob_move();
    }, 1000);//一秒延遲
}
//=======================================================================我是分隔線==================================================================