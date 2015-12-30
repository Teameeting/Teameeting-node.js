"use strict"

var nodemailer = require("nodemailer");

exports.validateUser = function(req, res, cb) {
    var sign = req.body.sign;
    if (null == sign || sign.length == 0) {
        return dynchttp.sendMissParams(req, res, "sign");
    } else {
        var session = dyncutils.aesDecipher(sign);
        var array = session.split(":", 2);
        redisClient.get(array[0], function(err, data) {
            if(err) {
                cb(null, false);
            } else {
                if (data === sign) {
                    //redisClient.expire(array[0], 60 * 60);
                    cb(null, array[0]);
                } else {
                    cb(null, false);
                }
            }
        })
    }
}

exports.sendEmail = function(email, url, req, cb) {
    // 开启一个 SMTP 连接池
    var smtpTransport = nodemailer.createTransport("SMTP",{
        host: "smtp.exmail.qq.com", // 主机
        secureConnection: true, // 使用 SSL
        port: 465, // SMTP 端口
        auth: {
            user: "hi@dync.cc", // 账号
            pass: "Dync@123456!@#" // 密码
        }
    });
    // 设置邮件内容
    var mailOptions = {
        from: "anyrtc<hi@dync.cc>", // 发件地址
        to: email, // 收件列表
        subject: "欢迎您使用anyrtc！立即激活您的账户", // 标题
        // HTML body
        html: '<p><b>亲爱的</b> '+ email +'<d/> 用户</p>' +
        '<p>感谢您注册anyrtc账户！要激活您的账户，请点击下面的链接确认您的电子邮件地址。</p>' +
        '<p>'+ url+'</p>',
    }
    // 发送邮件
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
        }else{
            //console.log("Message sent: " + response.message);
            cb(null, true);
        }
        smtpTransport.close(); // 如果没用，关闭连接池
    });
}

/**
 *
 * @param req
 * @param res
 */
exports.sendDbError = function(req, res) {
    res.status(500).send({requestid: req._startTime.valueOf(), code:500, message: 'server exception'});
}

exports.sendSuccessWithAuthorization = function(req, res, authorization, message) {
    res.status(200).send(message);
}

exports.sendSuccess = function(req, res, message) {
    res.status(200).send(message);
}

exports.sendMissParams = function(req, res, param) {
    var responseJson = {
        requestid: req._startTime.valueOf(),
        code: 300,
        message: param + ' is null or length is 0'
    };
    res.status(200).send(responseJson);
}

exports.sendErrorParams = function(req, res, param) {
    var responseJson = {
        requestid: req._startTime.valueOf(),
        code: 301,
        message: param + ' is error'
    };
    res.status(200).send(responseJson);
}

exports.sendAuthorizationFailed = function (req, res) {
    var responseJson = {
        requestid: req._startTime.valueOf(),
        code: 400,
        message: 'authorization failed, please sign in first'
    };
    res.status(200).send(responseJson);
}