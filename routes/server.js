// 引入套件
// const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const mongoose = require('mongoose');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');

mongoose.connect('mongodb+srv://yaochenwu0111:Eric527957@cluster0.zv3ow.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
const db = mongoose.connection;

// 與資料庫連線發生錯誤時
db.on('error', console.error.bind(console, 'Connection fails!'));

// 與資料庫連線成功連線時
db.once('open', function () {
    console.log('Connected to database...');
});

// 該collection的格式設定
const scoreSchema = new mongoose.Schema({
    name: { //事項名稱
        type: String, //設定該欄位的格式
        required: true //設定該欄位是否必填
    },
    score: { //是否已完成
        type: String,
        required: true,
    }
})

const Score = mongoose.model('Score', scoreSchema);

// 取得全部資料
// 使用非同步，才能夠等待資料庫回應
router.get("/", async (req, res) => {
    // 使用try catch方便Debug的報錯訊息
    try {
        // 找出Todo資料資料表中的全部資料
        const score = await Score.find();
        // 將回傳的資訊轉成Json格式後回傳
        res.json(score);
    } catch (err) {
        // 如果資料庫出現錯誤時回報 status:500 並回傳錯誤訊息 
        res.status(500).json({ message: err.message })
    }
});

// 新增rank
// 將Method改為Post
router.post("/", async (req, res) => {
    // 從req.body中取出資料
    const score = new Score({
        name: req.body.name,
        score: req.body.score
    });
    try {
        // 使用.save()將資料存進資料庫
        const newScore = await score.save();
        // 回傳status:201代表新增成功 並回傳新增的資料
        res.status(201).json(newScore);
    } catch (err) {
        // 錯誤訊息發生回傳400 代表使用者傳入錯誤的資訊
        console.log(err);
        res.status(400).json({ message: err.message })
    }
});


router.get('/get-words', (req, res) => {
    //const pythonScript = path.join(__dirname, 'Project/routes/python_script.py');
    const process = spawn('python', ['routes/python_script.py']);

    let result = '';

    process.stdout.on('data', (data) => {
        result += data.toString();
    });

    process.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
        console.error(`Error from Python script: ${data.toString()}`);
    });


    process.on('close', (code) => {
        if (code === 0) {
            res.json({ sentence: result.trim() });
        } else {
            console.error(`Python script failed with exit code ${code}`);
            res.status(500).json({ error: 'Python script failed' });
        }
    });
});


// Export 該Router
module.exports = router;