//怪物數值
let MobHP = [100, 500, 1000, 500, 100];
let mob_id = ["mob1HP", "mob2HP", "mob3HP", "mob4HP", "mob5HP"]

for (let i = 0; i < 5; ++i) {
    document.getElementById(mob_id[i]).textContent = MobHP[i];
}

function attack(index, damage) {
    MobHP[index] -= damage;
    document.getElementById(mob_id[index]).textContent = MobHP[index];
    console.log("attack successfully");
}

//玩家數值
let currentHP = 100; let totalHP = 100;
document.getElementById("currentHP").textContent = currentHP;
document.getElementById("totalHP").textContent = totalHP;

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
    if(char === ' '){//將space元素轉為non breaking space元素
        char= '&nbsp;';
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
        }else if(inputText[index] != " " && targetText[index] == " "){
            span.classList.add("blank_incorrect");
            span.classList.remove("incorrect", "correct");
        }else {
            span.classList.add("incorrect");
            span.classList.remove("correct", "blank_incorrect");
        }
    });
}

//Enter吃進value
let typeBoxValue = document.getElementById("typeBox");
typeBoxValue.addEventListener("keypress", CorrectRateCal, false);//吃到鍵盤指令就呼叫CorrectRateCal函式

//比對正確率並計時
function CorrectRateCal(event){
    let input = typeBoxValue.value;
    let targetTextArray = [], inputTextArray = [];
    let count = 0;
    if (event.key === "Enter") {//如果吃到的指令是enter，啟動計算
        event.preventDefault();
        targetText.split('').forEach((char, index)=>{//將目標文本拆分成陣列
            targetTextArray[index] = char;
        });
        input.split('').forEach((char, index) => {//將inputText拆分成陣列
            inputTextArray[index] = char;
        });
        for(let i = 0;i<inputTextArray.length;++i){
            if(targetTextArray[i] === inputTextArray[i]){
                count++;
            }
        }
        let correctRate = count / targetText.length * 100;
        console.log(`count = ${count}`);
        console.log(correctRate);
        DamageCalculate(correctRate);

        //reset
        const inputField = document.getElementById("typeBox");
        inputField.value = "";//清除input值
        targetTextContainer.childNodes.forEach(span => {//清除所有標記
            span.classList.remove("correct", "incorrect", "blank_incorrect");
        })
    }
}

//傷害計算公式
function DamageCalculate(correctRate){
    let damage = Math.round(correctRate * 10);
    for(let i = 0; i < 5; ++i){
        attack(i, damage);
    }
}

//計時器
function CountDown(){
    let now = new Date();
    let start = now.getTime();//紀錄開始時間
    document.addEventListener()
}