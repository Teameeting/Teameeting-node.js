"use strict"

var crypto      = require("crypto");

/**
 * get a random string number with n
 *
 * @param length the length string
 * @returns {random string number}
 */
exports.randomStrNumber = function(length) {
    var random="";
    for(var i=0; i < length; i++) {
        random += Math.floor(Math.random() * 10);
    }
    return random;
}

exports.randomString = function() {
    var strRandom = Math.random().toString(36).substr(2,8);
    return strRandom;
}

exports.randomIdString = function(length) {
    var strRandom = Math.random().toString(36).substr(2, length);
    return strRandom;
}

exports.getMeetingId = function() {
    var number = 400000000000;
    var strRandom = Math.random().toString(36).substr(2, length);
    return strRandom;
}

exports.generateToken = function (data) {
    var random          = Math.floor(Math.random() * 100001);
    var timestamp       = (new Date()).getTime();
    var sha256          = crypto.createHmac("sha256", random + "WOO" + timestamp);

    return sha256.update(data).digest("md5");
}

exports.aesCrypto = function(data) {
    var cipher = crypto.createCipher('aes-256-cbc','InmDync68rtc99')
    var crypted = cipher.update(data,'utf8','hex')
    crypted += cipher.final('hex')
    return crypted;
}

exports.aesDecipher = function (data) {
    var decipher = crypto.createDecipher('aes-256-cbc','InmDync68rtc99')
    var dec = decipher.update(data,'hex','utf8')
    dec += decipher.final('utf8')
    return dec;
}