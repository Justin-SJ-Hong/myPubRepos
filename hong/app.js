const express = require('express');
const fs = require('fs');
const app = express();

// DB 연결(mysql 또는 mongoDB 등의 데이터베이스 드라이버를 사용)
const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'hong',
    password: '0000'
});

const db = pool.promise();
app.set('db', db);

//바디파서
app.use(express.json());
app.use(express.urlencoded({extended : true}));
//쿠키파서
const cookieparser = require('cookie-parser');
app.use(cookieparser());

app.use(async (req, res, next) => {
    console.log("COOKIE", req.cookies);
    const {auth} = req.cookies;
    let member = null;
    if(auth) {
        const sql = "SELECT * FROM user WHERE id=?";
        const [rows] = await db.execute(sql, [auth]);
        member = rows[0];
    }
    app.set('member', member);
    next();
})

app.listen(4000, () => {
    console.log(`Server Listen at http://localhost:4000`);
});

app.get('/', (req, res) => {
    const file = fs.readFileSync('./views/index.html');
    res.end(file);
});

app.get('/', (req, res) => {
    const file = fs.readFileSync('./views/join.html');
    res.end(file);
});