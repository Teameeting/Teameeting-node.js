/**
 * Created by skyline on 15-12-2.
 */
var express = require('express');
var router = express.Router();

router.get('/getMeetingInfo/:meetingid', function(req, res, next) {
    var meetingid = req.params.meetingid;
    var userid = req.params.userid;
    db.queryMeetingInfoById([meetingid, userid], function (err, response) {
        if (!err) {
            if(response.length > 0) {
                var responseJson = {
                    requestid: req._startTime.valueOf(),
                    code: 200,
                    meetingInfo:response[0],
                    message: 'get meeting info success'
                };
                dynchttp.sendSuccess(req, res, responseJson);
            } else {
                var responseJson = {
                    requestid: req._startTime.valueOf(),
                    code: 400,
                    message: 'meeting is not exist'
                };
                dynchttp.sendSuccess(req, res, responseJson);
            }
        } else {
            dynchttp.sendDbError(req, res);
        }
    })
});

router.post('/applyRoom', function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            //var meetingid = req.body.meetingid;//dyncutils.randomIdString(12);
            var meetname = req.body.meetingname;
            var meetdesc = req.body.meetdesc;
            var meetusable = req.body.meetenable;
            var pushable = req.body.pushable;
            /** meet type:def/temp/daily:0/1/2 */
            var meettype1 = req.body.meetingtype;
            /** meet type:def/meeting/p2p/live:0/1/2/3 */
            var meettype2 = 1;
            var time = (new Date()).valueOf();

            //if (null == meetingid || meetingid.length == 0) {
            //    return dynchttp.sendMissParams(req, res, "meetingid");
            //}
            if (null == meetname || meetname.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingname");
            }
            if (null == meettype1 || meettype1.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingtype");
            }
            if (null == meetusable || meetusable.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetenable");
            }
            if (null == pushable || pushable.length == 0) {
                return dynchttp.sendMissParams(req, res, "pushable");
            }
            db.queryMeetingCount(function (err, response) {
                if (!err) {
                    var meetingid = 400000000000;
                    if(response.length > 0 && response[0].meetingNum > 0) {
                        meetingid = parseInt(response[0].maxMeetingid) + 1;
                    } else {
                        meetingid = 400000000000 + response.length ;
                    }

                    console.log(meetingid)
                    db.queryMeetingInfoById([meetingid], function (err, response) {
                        if (!err) {
                            if (response.length > 0) {
                                var responseJson = {
                                    requestid: req._startTime.valueOf(),
                                    code: 202,
                                    message: 'meetingid has exist'
                                };
                                dynchttp.sendSuccess(req, res, responseJson);
                            } else {
                                db.insertMeeting([userid, meetingid, meetname, meetdesc, meetusable, pushable, meettype1, meettype2, time],
                                    function (err, response) {
                                        if (!err) {
                                            if (response.affectedRows == 1) {
                                                var responseJson = {
                                                    requestid: req._startTime.valueOf(),
                                                    code: 200,
                                                    meetingInfo: {meetingid: meetingid, meetname: meetname, meetdesc: meetdesc, meetusable: meetusable, pushable: pushable, meettype: meettype1, jointime:time},
                                                    message: 'apply meeting success'
                                                };
                                                dynchttp.sendSuccess(req, res, responseJson);
                                            } else {
                                                var responseJson = {
                                                    requestid: req._startTime.valueOf(),
                                                    code: 400,
                                                    message: 'apply meeting failed'
                                                };
                                                dynchttp.sendSuccess(req, res, responseJson);
                                            }
                                        } else {
                                            dynchttp.sendDbError(req, res);
                                        }
                                    })
                            }
                        } else {
                            dynchttp.sendDbError(req, res);
                        }
                    })
                } else {
                    dynchttp.sendDbError(req, res);
                }
            })
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
});

router.post('/deleteRoom', function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }

            db.queryMeetingOwner([meetingid, userid], function (err, response) {
                if(!err) {
                    if(response.length > 0) {
                        if(response[0].owner == 1) {
                            db.deleteUserMeeting([meetingid, userid], function (err, response) {
                                if (!err) {
                                    if(response.affectedRows == 1) {
                                        db.deleteMeetingInfo([meetingid, userid], function (err, response) {
                                            if (!err) {
                                                if(response.affectedRows == 1) {
                                                    var responseJson = {
                                                        requestid: req._startTime.valueOf(),
                                                        code: 200,
                                                        message: 'delete meeting success'
                                                    };
                                                    dynchttp.sendSuccess(req, res, responseJson);
                                                } else {
                                                    var responseJson = {
                                                        requestid: req._startTime.valueOf(),
                                                        code: 400,
                                                        message: 'delete meeting failed'
                                                    };
                                                    dynchttp.sendSuccess(req, res, responseJson);
                                                }
                                            } else {
                                                dynchttp.sendDbError(req, res);
                                            }
                                        })
                                    } else {
                                        var responseJson = {
                                            requestid: req._startTime.valueOf(),
                                            code: 400,
                                            message: 'delete meeting failed'
                                        };
                                        dynchttp.sendSuccess(req, res, responseJson);
                                    }
                                } else {
                                    dynchttp.sendDbError(req, res);
                                }
                            })
                        } else {
                            db.deleteUserMeeting([meetingid, userid], function (err, response) {
                                if (!err) {
                                    if(response.affectedRows == 1) {
                                        var responseJson = {
                                            requestid: req._startTime.valueOf(),
                                            code: 200,
                                            message: 'delete meeting success'
                                        };
                                        dynchttp.sendSuccess(req, res, responseJson);
                                    } else {
                                        var responseJson = {
                                            requestid: req._startTime.valueOf(),
                                            code: 400,
                                            message: 'delete meeting failed'
                                        };
                                        dynchttp.sendSuccess(req, res, responseJson);
                                    }
                                } else {
                                    dynchttp.sendDbError(req, res);
                                }
                            })
                        }
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 201,
                            message: 'meeting room not exist'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            })
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
});

/**
 * insert the participants information into database
 */
router.post("/insertUserMeetingRoom", function (req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            var pushable = req.body.pushable;
            var time = (new Date()).valueOf();
            var type = 0;

            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }

            if (null == pushable || pushable.length == 0) {
                pushable = 1;
            } else if (pushable > 1 || pushable < 0) {
                return dynchttp.sendErrorParams(req, res, "pushable");
            }

            db.queryMeetingOwner([meetingid, userid], function (err, response) {
                if(!err) {
                    if(response.length > 0) {
                        db.updateMeetJoinTime([(new Date().valueOf()), meetingid, userid], function (err, response) {
                            if (!err) {
                                if(response.affectedRows == 1) {
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 200,
                                        message: 'insert user meeting room success'
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                } else {
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 400,
                                        message: 'insert user meeting room failed'
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                }
                            } else {
                                dynchttp.sendDbError(req, res);
                            }
                        })
                    } else {
                        db.insertUserMeeting([userid, meetingid, type, pushable, time], function (err, response) {
                            if (!err) {
                                if (response.affectedRows == 1) {
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 200,
                                        message: 'insert user meeting room success'
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                } else {
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 400,
                                        message: 'insert user meeting room failed'
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                }
                            } else {
                                dynchttp.sendDbError(req, res);
                            }
                        });
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            });
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
})


router.post('/updateRoomAddMemNumber', function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }
            db.getMeetMemNumber([meetingid], function (err, response) {
                if (!err) {
                    if (response.length > 0) {
                        var number = response[0].memnumber;
                        number += 1;
                        db.updateMeetMemNumber([number, meetingid], function (err, response) {
                            if (!err) {
                                if (response.affectedRows == 1) {
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 200,
                                        message: 'update meeting room success'
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                } else {
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 400,
                                        message: 'update meeting room failed'
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                }
                            } else {
                                dynchttp.sendDbError(req, res);
                            }
                        })
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 201,
                            message: 'meeting room not exist'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            })


        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
});

router.post('/updateRoomMinusMemNumber', function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }
            db.getMeetMemNumber([meetingid], function (err, response) {
                if (!err) {
                    if (response.length > 0) {
                        var number = response[0].memnumber;
                        if (number > 1) {
                            number -= 1;
                        } else {
                            number = 0;
                        }
                        db.updateMeetMemNumber([number, meetingid], function (err, response) {
                            if (!err) {
                                if (response.affectedRows == 1) {
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 200,
                                        message: 'update meeting room success'
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                } else {
                                    var responseJson = {
                                        requestid: req._startTime.valueOf(),
                                        code: 400,
                                        message: 'update meeting room failed'
                                    };
                                    dynchttp.sendSuccess(req, res, responseJson);
                                }
                            } else {
                                dynchttp.sendDbError(req, res);
                            }
                        })
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 201,
                            message: 'meeting room not exist'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            });
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
});

/**
 * this method is used by server to update the count of meeting room number
 */
router.post('/updateRoomMemNumber', function(req, res, next) {
    var meetingid = req.body.meetingid;
    var number = req.body.meetingMemNumber;
    if (null == meetingid || meetingid.length == 0) {
        return dynchttp.sendMissParams(req, res, "meetingid");
    }
    if (null == number || number.length == 0) {
        return dynchttp.sendMissParams(req, res, "meetingMemNumber");
    }
    db.updateMeetMemNumber([number, meetingid], function (err, response) {
        if (!err) {
            if (response.affectedRows == 1) {
                var responseJson = {
                    requestid: req._startTime.valueOf(),
                    code: 200,
                    message: 'update meeting room success'
                };
                dynchttp.sendSuccess(req, res, responseJson);
            } else {
                var responseJson = {
                    requestid: req._startTime.valueOf(),
                    code: 400,
                    message: 'update meeting room failed'
                };
                dynchttp.sendSuccess(req, res, responseJson);
            }
        } else {
            dynchttp.sendDbError(req, res);
        }
    });
});

/**
 * update the meeting room is pushable or not
 */
router.post('/updateRoomPushable', function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            var pushable = req.body.pushable;

            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }
            if (null == pushable || pushable.length == 0) {
                return dynchttp.sendMissParams(req, res, "pushable");
            }
            if (pushable > 1 || pushable < 0) {
                return dynchttp.sendErrorParams(req, res, "pushable");
            }

            db.updateMeetPushable([pushable, meetingid, userid], function (err, response) {
                if (!err) {
                    if(response.affectedRows == 1) {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'update meeting room success'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: 'update meeting room failed'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            })
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
});

router.post('/updateRoomEnable', function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            var enable = req.body.enable;
            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }
            if (null == enable || enable.length == 0) {
                return dynchttp.sendMissParams(req, res, "enable");
            }
            if (enable > 2 || enable < 0) {
                return dynchttp.sendErrorParams(req, res, "enable");
            }

            db.updateMeetusable([enable, meetingid, userid], function (err, response) {
                if (!err) {
                    if(response.affectedRows == 1) {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'update meeting room success'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: 'update meeting room failed'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            })
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
});

router.post('/updateMeetRoomName', function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            var roomname = req.body.meetingname;
            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }
            if (null == roomname || roomname.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingname");
            }

            db.updateMeetRoomName([roomname, meetingid, userid], function (err, response) {
                if (!err) {
                    if(response.affectedRows == 1) {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'update meetting room name success'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: 'update meeting room name failed'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            })
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
});

router.post('/updateUserMeetingJointime', function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }

            db.updateMeetJoinTime([(new Date().valueOf()), meetingid, userid], function (err, response) {
                if (!err) {
                    if(response.affectedRows == 1) {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'update user meeting jointime success'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: 'update user meeting jointime failed'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            })
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
});

router.post('/getRoomList', function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var pageNum = req.body.pageNum;
            var pageSize = req.body.pageSize;

            if (null == pageNum || pageNum.length == 0) {
                return dynchttp.sendMissParams(req, res, "pageNum");
            }
            if (null == pageSize || pageSize.length == 0) {
                return dynchttp.sendMissParams(req, res, "pageSize");
            }

            db.getUserMeetingList([userid], Number(pageNum), Number(pageSize), function (err, response) {
                if (!err) {
                    var responseJson = {
                        requestid: req._startTime.valueOf(),
                        code: 200,
                        meetingList: response,
                        message: 'get user meeting room list success'
                    };
                    dynchttp.sendSuccess(req, res, responseJson);
                } else {
                    dynchttp.sendDbError(req, res);
                }
            })
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
});

/**
 * get room message list api to app
 */
router.post('/getMeetingMsgList', function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            var pageNum = req.body.pageNum;
            var pageSize = req.body.pageSize;

            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }
            if (null == pageNum || pageNum.length == 0) {
                return dynchttp.sendMissParams(req, res, "pageNum");
            }
            if (null == pageSize || pageSize.length == 0) {
                return dynchttp.sendMissParams(req, res, "pageSize");
            }

            db.getUserMeetingList([meetingid], Number(pageNum), Number(pageSize), function (err, response) {
                if (!err) {
                    var responseJson = {
                        requestid: req._startTime.valueOf(),
                        code: 200,
                        messageList: response,
                        message: 'get meeting room message list success'
                    };
                    dynchttp.sendSuccess(req, res, responseJson);
                } else {
                    dynchttp.sendDbError(req, res);
                }
            })
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
});


/***
 * insert the room message from server;
 */
router.post("/insertMeetingMsg", function (req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            var messageid = req.body.messageid;
            var messagetype = req.body.messagetype;
            var sessionid = req.body.sessionid;
            var userid = req.body.userid;
            var message = req.body.strMsg;

            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }
            if (null == messageid || messageid.length == 0) {
                return dynchttp.sendMissParams(req, res, "messageid");
            }
            if (null == messagetype || messagetype.length == 0) {
                return dynchttp.sendMissParams(req, res, "messagetype");
            }
            if (null == sessionid || sessionid.length == 0) {
                return dynchttp.sendMissParams(req, res, "sessionid");
            }
            if (null == userid || userid.length == 0) {
                return dynchttp.sendMissParams(req, res, "userid");
            }
            if (null == message || message.length == 0) {
                return dynchttp.sendMissParams(req, res, "strMsg");
            }

            db.insertRoomMessage([messagetype, messageid, meetingid, sessionid, userid, message], function (err, response) {
                if (!err) {
                    if (response.affectedRows == 1) {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'insert meeting room message success'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: 'insert meeting room message failed'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            });
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
})

router.post("/insertSessionMeetingInfo", function (req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var meetingid = req.body.meetingid;
            var sessionid = req.body.sessionid;
            var sessionstatus = req.body.sessionstatus;
            var sessiontype = req.body.sessiontype;
            var sessionnumber = req.body.sessionnumber;

            if (null == meetingid || meetingid.length == 0) {
                return dynchttp.sendMissParams(req, res, "meetingid");
            }
            if (null == sessionid || sessionid.length == 0) {
                return dynchttp.sendMissParams(req, res, "sessionid");
            }
            if (null == sessionstatus || sessionstatus.length == 0) {
                return dynchttp.sendMissParams(req, res, "sessionstatus");
            }
            if (null == sessiontype || sessiontype.length == 0) {
                return dynchttp.sendMissParams(req, res, "sessiontype");
            }
            if (null == sessionnumber || sessionnumber.length == 0) {
                return dynchttp.sendMissParams(req, res, "sessionnumber");
            }

            db.insertSessionMeetingInfo([meetingid, sessionid, sessionstatus, sessiontype, sessionnumber], function (err, response) {
                if (!err) {
                    if (response.affectedRows == 1) {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'insert session meeting info success'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: 'insert session meeting info failed'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            });
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
})

router.post("/updateSessionMeetingStatus", function (req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var sessionid = req.body.sessionid;
            var sessionstatus = req.body.sessionstatus;


            if (null == sessionid || sessionid.length == 0) {
                return dynchttp.sendMissParams(req, res, "sessionid");
            }
            if (null == sessionstatus || sessionstatus.length == 0) {
                return dynchttp.sendMissParams(req, res, "sessionstatus");
            }

            db.updateSessionMeetingStatus([sessionstatus, sessionid], function (err, response) {
                if (!err) {
                    if (response.affectedRows == 1) {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'update session status success'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: 'update session status failed'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            });
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
})

router.post("/updateSessionMeetingEndtime", function (req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var sessionid = req.body.sessionid;

            if (null == sessionid || sessionid.length == 0) {
                return dynchttp.sendMissParams(req, res, "sessionid");
            }

            db.updateSessionMeetingEndtime([sessionid], function (err, response) {
                if (!err) {
                    if (response.affectedRows == 1) {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'update session endtime success'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: 'update session endtime failed'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            });
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
})

router.post("/updateSessionMeetingNumber", function (req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid) {
        if (userid) {
            var sessionid = req.body.sessionid;
            var sessionnumber = req.body.sessionnumber;


            if (null == sessionid || sessionid.length == 0) {
                return dynchttp.sendMissParams(req, res, "sessionid");
            }
            if (null == sessionnumber || sessionnumber.length == 0) {
                return dynchttp.sendMissParams(req, res, "sessionnumber");
            }

            db.updateSessionMeetingNumber([sessionnumber, sessionid], function (err, response) {
                if (!err) {
                    if (response.affectedRows == 1) {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'update session number success'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: 'update session number failed'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    }
                } else {
                    dynchttp.sendDbError(req, res);
                }
            });
        } else {
            dynchttp.sendAuthorizationFailed(req, res);
        }
    });
})

module.exports = router;