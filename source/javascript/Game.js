//開始轉場
const transitionBlock = document.getElementById('TransitionBlock');

if (localStorage.getItem("Gamemode transition") == "true") {//localstorage為true才轉場
    localStorage.setItem("Gamemode transition", false);
    transitionBlock.style.zIndex = 100;//將Block設到最上層
    // 延遲移除黑屏效果
    setTimeout(() => {
        transitionBlock.classList.add('hidden'); // 加入滑出的 class
    }, 300); // 延遲讓用戶能看到黑屏效果
}
else{//false的話直接消失
    transitionBlock.style.display = "none";
    transitionBlock.style.zIndex = 0;
}


//怪物數值
let MobHP = [200, 500, 10000, 500, 200];
let mobCD_original = [1, 2, 3, 2, 2], mobCD_current = [];
let mobAtkVal = [5, 10, 20, 10, 5];

for (let i = 0; i < 5; ++i) {//初始化顯示mobHP mobCD
    document.getElementById(`mob${i}HP`).textContent = MobHP[i];
    mobCD_current[i] = mobCD_original[i];
    document.getElementById(`mob${i}CD`).textContent = mobCD_current[i];
}

function checkCD(mobIndex) {
    mobCD_current[mobIndex]--;//CD減少1
    if (mobCD_current[mobIndex] <= 0) {//CD到0了
        console.log(`mob${mobIndex}的CD = 0`);
        attackPlayer(mobIndex);
        mobCD_current[mobIndex] += mobCD_original[mobIndex];//CD重置
    }
    document.getElementById(`mob${mobIndex}CD`).textContent = mobCD_current[mobIndex];//更新顯示
}

function attackPlayer(mobIndex) {//怪物攻擊玩家
    currentHP -= mobAtkVal[mobIndex];//玩家生命減少對應mob的攻擊力
    document.getElementById("currentHP").textContent = currentHP;//更新顯示
}

function checkMobAlive(mobIndex) {
    if (MobHP[mobIndex] <= 0) {
        MobHP[mobIndex] = 0;
        let mob = document.getElementById(`mob${mobIndex}`);
        mob.classList.add("fade_out");
        return false;
    }
    else{
        return true;
    }
}

//玩家數值
let currentHP = 100; let totalHP = 100;
document.getElementById("currentHP").textContent = currentHP;
document.getElementById("totalHP").textContent = totalHP;

function attack(index, damage) {//攻擊怪物
    MobHP[index] -= damage;
    displayDamage(index, damage);
    if(checkMobAlive(index)){//mob沒死才計算CD，避免mob死亡仍然攻擊玩家
        checkCD(index);//玩家攻擊mob一次，MobCD--
        console.log("attack successfully");
    }
    document.getElementById(`mob${index}HP`).textContent = MobHP[index];//更新顯示怪物生命
}

function displayDamage(index, damage) {
    // 獲取顯示的元素
    let output = document.getElementById(`displayDamage${index}`);
    
    // 設置顯示的文字
    output.textContent = `-${damage}`;
    
    // 顯示元素並觸發動畫
    output.style.display = 'block';
    
    // 觸發動畫
    output.classList.remove('animate'); // 確保清除之前的動畫狀態
    void output.offsetWidth; // 觸發重排，使動畫重新啟動
    output.classList.add('animate'); // 再次添加動畫類

    setTimeout(() => {
        output.classList.add('fade_out');
    }, 300);
    setTimeout(() => {
        output.classList.remove('fade_out');
        output.style.display = 'none'; // 隱藏元素
    }, 500);
}



document.getElementById("attackBtn").addEventListener('click', () => {//測試用攻擊
    for (let i = 0; i < 5; ++i) {
        attack(i, 100);
    }
});

//輸入欄位focus
//document.getElementById("typeBox").focus();
function typeBox_Focus() {
    document.getElementById("typeBox").focus();
}

//目標文本
const targetText = "at all say face see still move do may no right time few by face eye write end begin how state write make little write into program develop thing right possible never also she most many real problem order against play form find.";
const targetTextContainer = document.getElementById("TextContainer");

targetText.split("").forEach(char => {//將假文拆分
    let span = document.createElement("span");//新增一個span元素
    if (char === ' ') {//將space元素轉為non breaking space元素
        char = '&nbsp;';
    }
    span.innerHTML = char;//將拆分出來的元素(char)新增到span的內容裡
    targetTextContainer.appendChild(span);//新增span到HTML中
});

//時刻比對文字正確並修改顏色
function Check_Input() {
    const inputText = document.getElementById("typeBox").value;

    targetTextContainer.childNodes.forEach((span, index) => {
        if (inputText[index] === undefined) {
            span.classList.remove("correct", "incorrect", "blank_incorrect");
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

//Enter吃進value
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
    //開始計時
    if (firstKeypress) {//第一次打字
        Timer();
        firstKeypress = false;
    }

    let input = typeBoxValue.value;
    let targetTextArray = [], inputTextArray = [];
    let CorrectCount = 0;
    if (event.key === "Enter" || autoComplete) {//如果吃到的指令是enter，吃進value並結算
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
        DamageCalculate(correctRate, duration);

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
    let damage = Math.round(correctRate * 5 / duration);//傷害計算公式
    for (let i = 0; i < 5; ++i) {
        attack(i, damage);
    }
}