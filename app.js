/*
 * @Author: your name
 * @Date: 2019-10-29 22:14:53
 * @LastEditTime: 2019-11-30 22:10:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vote\app.js
 */
const express = require('express');
const socketIo = require('socket.io');
const url = require('url');
const sharp = require('sharp');
const fs = require('fs');
const fsp = fs.promises;
const svgCaptcha = require('svg-captcha');
const session = require('express-session')
const md5 = require('md5');
const cors = require('cors');

const http = require('http');
const app = express();
const server = http.createServer(app);
const ioServer = socketIo(server);
const multer = require('multer');
const uploader = multer({
    dest: './upload/',
    preservePath: true,
});


const cookieParser = require('cookie-parser')
const sqlite = require('sqlite');
const dbPromise = sqlite.open(__dirname + '/db/voting-site.sqlite3');

let db;
(async function(){
    db = await dbPromise;
})()

const port = 3005;
app.locals.pretty = true;


var changePasswordMap = {};

// setTimeout(() => {
//     delete changePasswordMap[token]
// }, 60 * 1000 * 20); //20分钟后自动删除token

//session设置
// app.use(session({secret: 'my_secret', resave: false, saveUninitialized: true, cookie: {maxAge: 60000}}));
app.use(cookieParser('my_secret')) //用于实现cookie的解析
var sessions = {}
app.use(function session(req, res, next){
    var sessionid = req.cookies.sessionid;
    if(!sessionid){
        sessionid = Math.random().toString(16).slice(2);
        res.cookie('sessionid', sessionid)
    }
    if(!sessions[sessionid]){
        sessions[sessionid] = {};
    }
        
    req.session = sessions[sessionid]

    next();
})
//跨域设置
app.use(cors({
    maxAge:86400,
    credentials: true,
    origin: function(origin, cb){
        cb(null, true)
    },
}))

//socket.io加入房间
global.ioServer = ioServer
ioServer.on('connection', socket => {
    socket.on('select room', roomid => {
        socket.join('/vote/' + roomid);
    })
})



app.use(express.json())//解析JSON请求体的中间键

app.use(express.static(__dirname + '/static'));
app.use(express.static('./dist'))
app.use('/upload', express.static(__dirname + '/upload'));

//解析url编码的中间键
app.use(express.urlencoded({
    extended: true
}))



//前端页面业务逻辑

//获取用户信息
app.get('/userinfo', async (req, res, next) => {
    var userid = req.signedCookies.userid
    if (userid) {
      res.json(await db.get('SELECT id,name,avatar FROM users WHERE id=?', userid))
    } else {
      res.status(404).end()
    }
})

app.post('/vote', async (req, res, next) => {
    var voteInfo = req.body;
    var userid = req.signedCookies.userid;

    //创建一个投票并将信息插入votes中
    await db.run(`INSERT INTO votes (title, desc, userid, singleSelection, deadline, anonymouse) VALUES (?, ?, ?, ?, ?, ?)`, voteInfo.title, voteInfo.desc, userid, voteInfo.singleSelection, new Date(voteInfo.deadline).getTime(), voteInfo.anonymouse);
    //查询出刚创建的投票的id
    var vote = await db.get('SELECT * FROM votes ORDER BY id DESC LIMIT 1')
    //将投票选项信息加入options中
    await Promise.all(voteInfo.options.map(option => {
        return db.run('INSERT INTO options (content, voteid) VALUES (?, ?)', option, vote.id)
    }))
    //创建后跳转至投票页面
    if(req.is('json')){
        res.json(vote);
    }else{
        res.redirect('/vote/' + vote.id);
    }
}) 

//用户投票
app.post('/voteup', async (req, res, next) => {
    var body = req.body;
    var userid = req.signedCookies.userid;
    var voteid = body.voteid;
    var vote = await db.get('SELECT * FROM votes WHERE id=?', voteid);

    var voteupInfo = await db.get('SELECT * FROM voteups WHERE userid=? AND voteid=?', userid, body.voteid);
    if(!userid){
        res.status(401).json({
            code: -1,
            msg: '非登陆用户不能投票'
        })
        return
    }else if(Date.now() > vote.deadline){
        res.status(403).json({
            code: -1,
            msg: "当前投票已截止"
        })
        return
    }else{
        if(voteupInfo){//已经投过票
            // return res.end()
            await db.run('UPDATE voteups SET optionid=? WHERE userid=?', body.optionid, userid);
        }else{
            await db.run('INSERT INTO voteups (userid, optionid, voteid) VALUES (?, ?, ?)', userid, body.optionid, body.voteid);
        }
    }
    ioServer.in(`/vote/${voteid}`).emit('new vote', {
        userid,
        voteid,
        optionid: body.optionid,
    })

    var voteups = await db.all('SELECT * FROM voteups WHERE voteid=?', body.voteid);
    res.json(voteups);
})

//获取某个投票的基本信息
app.get('/vote/:id', async(req, res, next) => {
    var info = await db.get('SELECT * FROM votes WHERE id=?', req.params.id)
    var options = await db.all('SELECT * FROM options WHERE voteid=?', req.params.id)
    // var voteups = await db.all('SELECT userid,optionid,voteid FROM voteups WHERE voteid=?', req.params.id);
    var voteups = await db.all(`SELECT 
        users.avatar as avatar, 
        voteups.userid as userid,
        voteups.optionid as optionid,
        voteups.voteid as voteid 
        FROM voteups join users 
        on voteups.userid=users.id
        WHERE voteups.voteid=?`, req.params.id);

    res.json({
        info, options, voteups
    });
})

//我参加过的投票
app.route('/myjoin')
    .get(async (req, res, next) => {
        var myjoin = await db.all('SELECT votes.id,votes.title,votes.desc,votes.deadline FROM votes JOIN voteups ON votes.id=voteups.voteid WHERE voteups.userid=?', req.signedCookies.userid);
        res.json({
            myjoin,
        })
    })
    .post(async (req, res, next) => {
        await db.run('DELETE FROM votes WHERE id=?', req.body.voteid);
        await db.run('DELETE FROM options WHERE voteid=?', req.body.voteid);
        await db.run('DELETE FROM voteups WHERE voteid=?', req.body.voteid);
        res.end()
    })
//我创建的投票
app.route('/mycreate')
    .get(async (req, res, next) => {
        var mycreate = await db.all('SELECT * FROM votes WHERE userid=?', req.signedCookies.userid);
        res.json({
            mycreate,
        })
    })
    .post(async (req, res, next) => {
        await db.run('DELETE FROM votes WHERE id=?', req.body.voteid);
        await db.run('DELETE FROM options WHERE voteid=?', req.body.voteid);
        await db.run('DELETE FROM voteups WHERE voteid=?', req.body.voteid);
        res.end()
    })



//账户信息业务逻辑
app.get('/captcha', (req, res, next) => {
    var captcha = svgCaptcha.create();
    res.type('svg');
    res.end(captcha.data)
    
    req.session.captcha = captcha.text.toLowerCase();
})
app.route('/login')
    .post(async (req, res, next) => {
        var tryLoginUser = req.body;
        //验证码
        if(tryLoginUser.captcha != req.session.captcha){
            res.json({code: 0, msg: '验证码错误！'})
            return
        }

        var user = await db.get(`SELECT * FROM users WHERE name=? AND password=?`, 
        tryLoginUser.name, md5(md5(tryLoginUser.password)));
        if(user){
            res.cookie('userid', user.id, {
                signed: true
            })
            res.json({code: 1, msg: "登陆成功"})
        }else{
            res.json({code: -1, msg: '用户名或密码错误'})
        }
    })

app.route('/register')
    .post(uploader.single('avatar'), async (req, res, next) => {
        var userInfo = req.body;
    
        var user = await db.get(`SELECT * FROM users WHERE name=?`, userInfo.name);
        if(user){
            if(req.file){
                await fsp.unlink(req.file.path)
            }
            res.status(401).json({
                code: -1,
                msg: '该用户名已被占用'
            })
        }else{
            //处理头像
            if(req.file){
                var imgBuf = await fsp.readFile(req.file.path);
                await sharp(imgBuf)//把头像文件变小
                    .resize(256)
                    .toFile(req.file.path);
            }
            await db.run(`INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?)`, 
            userInfo.name, userInfo.email, md5(md5(userInfo.password)), req.file ? req.file.path : null);
            res.json({
                code: 0,
                msg: '注册成功'
            })
        }
    })

app.route('/forgot')
    .post(async (req, res, next) => {
        var email = req.body.email;

        var user = await db.get(`SELECT * FROM users WHERE email=?`, email);
        if(!user){
            res.json({
                code: -1,
                msg: '不存在此用户！'
            })
        }

        var token = Math.random().toString().slice(2) //随机生成一个数作为token的值
        changePasswordMap[token] = email //通过map将用户与token关联起来
        var link = `http://localhost:3005/#/change-password/${token}`
        console.log(link);
        res.json({
            code: 0,
            msg: '已向您的邮箱发送密码重置链接'
        })
    })

app.route('/change-password/:token')
    .get(async (req, res, next) => {
        var token = req.params.token
        var users = await db.all('SELECT * FROM users');
        var user = users.find(it => it.email == changePasswordMap[token]);//通过token查找出user
        res.json({
            token,
        })
    })
    .post(async (req, res, next) => {
        var token = req.params.token 
        var users = await db.all('SELECT * FROM users');
        var user = users.find(it => it.email == changePasswordMap[token]);
        var password = req.body.password;
        if(user){
            await db.run(`UPDATE users SET password=? WHERE name=?`, md5(md5(password)), user.name);
            delete changePasswordMap[token];
            
            res.json({
                code: 0,
                msg:'密码修改成功'
            })
        }else{
            res.json({
                code: -1,
                msg: '此链接已失效'
            })
        }
    })

app.get('/logout',(req, res, next) => {
    res.clearCookie('userid');  //删除cookie值
    res.end()  //跳转到首页
})



server.listen(port, () => {
    console.log('server listening on port', port)
})
