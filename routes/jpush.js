/**
 * Created by root on 15-12-15.
 */
var express = require('express');
var router = express.Router();

var JPush = require("../node_modules/jpush-sdk/lib/JPush/JPush.js");
var client = JPush.buildClient(config.jpush_key, config.jpush_secret, 3, null);

/**
 * push meeting room message by jpush
 */
router.post("/pushMeetingMsg", function(req, res, next) {

    var meetingid = req.body.meetingid;
    var msgFromid = req.body.msgFromId;
    var meetingOnlineMembers = req.body.meetingOnlineMembers;
    var pushMsg = req.body.pushMsg;
    var notification = req.body.notification;
    var extra = req.body.extra;

    if (null == meetingid || meetingid.length == 0) {
        return dynchttp.sendMissParams(req, res, "meetingid");
    }
    if (null == msgFromid || msgFromid.length == 0) {
        return dynchttp.sendMissParams(req, res, "msgFromid");
    }
    if (null == meetingOnlineMembers || meetingOnlineMembers.length == 0) {
        return dynchttp.sendMissParams(req, res, "meetingOnlineMembers");
    }

    if (null == pushMsg || pushMsg.length == 0) {
        return dynchttp.sendMissParams(req, res, "pushMsg");
    }
    if (null == notification || notification.length == 0) {
        return dynchttp.sendMissParams(req, res, "notification");
    }
    var jsonExtra;
    if (null == extra || extra.length == 0) {
        extra = "{}";
    }
    jsonExtra= JSON.parse(extra);

    var jsonArrayOnlineMember = eval(JSON.parse(meetingOnlineMembers));

    db.getPushMeetingList([meetingid], function (err, response) {
        if(!err) {
            if(response.length > 0) {
                var userList = "";
                for (var i = 0; i< response.length; i++) {
                    if(msgFromid != response[i].userid && dyncutils.isExistInArray(response[i].userid, jsonArrayOnlineMember) == 0) {
                        if (i == 0 || userList == "") {
                            userList += "" + response[i].userid + "";
                        } else {
                            userList += "," + response[i].userid + "";
                        }
                    }
                }

                console.log("userList: " + userList);
                if (userList != "") {
                    if(jsonExtra.tags == 4) {
                        client.push().setPlatform(JPush.ALL)
                            .setAudience(JPush.tag(userList), JPush.alias(userList))
                            .setNotification(notification, JPush.ios(notification, 'ring.caf', 0, false, jsonExtra), JPush.android(notification, null, 1, jsonExtra))
                            .setMessage(pushMsg)
                            .setOptions(null, 0, null, null, null)
                            .send(function(err, response) {
                                if (err) {
                                    console.log(err.message);
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 400,
                                        message: err.message
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                } else {
                                    console.log('Sendno: ' + response.sendno);
                                    console.log('Msg_id: ' + response.msg_id);
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 200,
                                        message: 'push message succuss'
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                }
                            });
                    } else {
                        client.push().setPlatform(JPush.ALL)
                            .setAudience(JPush.tag(userList), JPush.alias(userList))
                            .setNotification(notification, JPush.ios(notification, 'default.caf', 0, false, jsonExtra), JPush.android(notification, null, 1, jsonExtra))
                            .setMessage(pushMsg)
                            .setOptions(null, 0, null, null, null)
                            .send(function(err, response) {
                                if (err) {
                                    console.log(err.message);
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 400,
                                        message: err.message
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                } else {
                                    console.log('Sendno: ' + response.sendno);
                                    console.log('Msg_id: ' + response.msg_id);
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 200,
                                        message: 'push message succuss'
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                }
                            });
                    }

                } else {
                    var responseJson = {
                        requestid: req._startTime.valueOf(),
                        code: 400,
                        message: 'no offline body to push'
                    };
                    dynchttp.sendSuccess(req, res, responseJson);
                }
            } else {
                var responseJson = {
                    requestid: req._startTime.valueOf(),
                    code: 203,
                    message: 'meeting room has no member to push'
                };
                dynchttp.sendSuccess(req, res, responseJson);
            }
        } else {
            dynchttp.sendDbError(req, res);
        }
    })

})

/**
 * push common message by jpush
 */
router.post("/pushCommonMsg", function(req, res, next) {
    var targetid = req.body.targetid;
    var pushMsg = req.body.pushMsg;
    var notification = req.body.notification;
    var extra = req.body.extra;

    if (null == targetid || targetid.length == 0) {
        return dynchttp.sendMissParams(req, res, "targetid");
    } /*else if(!isArray(targetid)) {
        return dynchttp.sendErrorParams(req, res, "targetid");
    }*/
    console.log("extra: " + extra);
    if (null == pushMsg || pushMsg.length == 0) {
        return dynchttp.sendMissParams(req, res, "pushMsg");
    }
    if (null == notification || notification.length == 0) {
        return dynchttp.sendMissParams(req, res, "notification");
    }
    var jsonExtra;
    if (null == extra || extra.length == 0) {
        extra = "{}";
    }
    jsonExtra= JSON.parse(extra);

    var targetArray = eval(targetid);
    if(targetArray.length > 0) {
        var userList = "";
        for (var i = 0; i< targetArray.length; i++) {
            if (i == 0) {
                userList += "" + targetArray[i] + "";
            } else {
                userList += "," + targetArray[i] + "";
            }
        }

        if(jsonExtra.tags == 4) {
            client.push().setPlatform(JPush.ALL)
                .setAudience(JPush.tag(userList), JPush.alias(userList))
                .setNotification(notification, JPush.ios(notification, 'ring.caf', 0, false, jsonExtra), JPush.android(notification, null, 1, jsonExtra))
                .setMessage(pushMsg)
                .setOptions(null, 0, null, null, null)
                .send(function(err, response) {
                    if (err) {
                        console.log(err.message);
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: err.message
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        console.log('Sendno: ' + response.sendno);
                        console.log('Msg_id: ' + response.msg_id);
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'push message succuss'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                });
        } else {
            client.push().setPlatform(JPush.ALL)
                .setAudience(JPush.tag(userList), JPush.alias(userList))
                .setNotification(notification, JPush.ios(notification, 'default.caf', 0, false, jsonExtra), JPush.android(notification, null, 1, jsonExtra))
                .setMessage(pushMsg)
                .setOptions(null, 0, null, null, null)
                .send(function(err, response) {
                    if (err) {
                        console.log(err.message);
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: err.message
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        console.log('Sendno: ' + response.sendno);
                        console.log('Msg_id: ' + response.msg_id);
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'push message succuss'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                });
        }
        console.log("userList: " + userList.toString());
    } else {
        var responseJson = {
            requestid: req._startTime.valueOf(),
            code: 203,
            message: 'meeting room has no member to push'
        };
        dynchttp.sendSuccess(req, res, responseJson);
    }
})

module.exports = router;
