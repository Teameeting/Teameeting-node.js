// Database related

var mysql   = require('mysql')
var pool = mysql.createPool(config.mysql);

/**
 * check the userid is exist in database or not
 * @param data
 * @param callback
 */
exports.getUserId = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'select userid from user_info where userid = ' + conn.escape(data) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * check the email is exist in database or not
 * @param data
 * @param callback
 */
exports.getUserEmail = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'select email from user_info where email = ' + conn.escape(data) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * check the cellphone is exist in database or not
 * @param data
 * @param callback
 */
exports.getUserCellphone = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }

        var sql = 'select telphone from user_info where telphone = ' + conn.escape(data) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * insert user's information into database when user sign up
 * @param data
 * @param callback
 */
exports.insertUserInfo = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }

        var sqlquery = 'select userid from user_info where userid = ' + conn.escape(data[0]) +'';
        conn.query(sqlquery, function(err, response){
            if(!err) {
                if(response.length > 0) {
                    var sqlupdate = 'update user_info set ulogindev ='+ conn.escape(data[3]) + ', ustatus ='+ conn.escape(data[4]) +
                        ', upushtoken ='+ conn.escape(data[6]) +' where userid='+ conn.escape(data[0]) +'';
                    conn.query(sqlupdate, callback);
                    conn.release();
                } else {
                    var sql = 'insert into user_info (userid, uactype, uregtype, ulogindev, ustatus, uname, upushtoken, uregtime)' +
                        ' values ('+ conn.escape(data[0]) +', '+ conn.escape(data[1]) +', ' + conn.escape(data[2]) +', ' +
                        conn.escape(data[3]) +', '+ conn.escape(data[4]) +', ' + conn.escape(data[5]) +', ' + conn.escape(data[6]) +
                        ', ' + (new Date()).valueOf() +')';
                    conn.query(sql, callback);
                    conn.release();
                }
            } else {
                conn.query(sqlquery, callback);
                conn.release();
            }
        });
    });
}

/**
 * get the user's salt by email
 * @param data
 * @param callback
 */
exports.getUserSalts = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'select * from user_info where email = ' + conn.escape(data) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * get user's information by userid
 * @param data
 * @param callback
 */
exports.getUserInfoById = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'select userid, uname, ustatus, uregtype, ulogindev, uactype, uregtime, upushtoken from user_info' +
            ' where userid = ' + conn.escape(data) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * update the user's pushtoken when it changes.
 * @param data
 * @param callback
 */
exports.updatePushToken = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'update user_info set upushtoken ='+ conn.escape(data[0]) +' where userid='+ conn.escape(data[1]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * insert meeting room information into database when apply a new meeting room
 * @param data
 * @param callback
 */
exports.insertMeeting = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }

        var sql = 'insert into meeting_info (userid, meetingid, meetname, meetdesc, meetusable, meettype1,' +
            ' meettype2, crttime) values ('+ conn.escape(data[0]) + ', ' + conn.escape(data[1]) + ', '
            + conn.escape(data[2]) + ', ' + conn.escape(data[3]) + ', ' + conn.escape(data[4]) +', '
            + conn.escape(data[6]) + ', ' + conn.escape(data[7]) + ', ' + conn.escape(data[8]) +')';
        var sql1 = 'insert into user_meeting_info (userid, meetingid, owner, pushable, jointime) values ('+ conn.escape(data[0]) + ', ' +
            conn.escape(data[1]) + ', '+ 1 +', ' + conn.escape(data[5]) +', '+ conn.escape(data[8]) +')';
        conn.query(sql1);
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * query the count of meeting
 * @param callback
 */
exports.queryMeetingCount = function(callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'select count(*) as meetingNum, max(meetingid) as maxMeetingid from meeting_info';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * insert meeting information into user_meeting_info
 * @param data
 * @param callback
 */
exports.insertUserMeeting = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }

        var sql = 'insert into user_meeting_info (userid, meetingid, owner, pushable, jointime) values ('+ conn.escape(data[0]) + ', ' +
            conn.escape(data[1]) + ', ' + conn.escape(data[2]) + ', ' + conn.escape(data[3]) + ', '+ conn.escape(data[4]) +')';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * update the meeting room is enable or not
 * @param data
 * @param callback
 */
exports.updateMeetusable = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'update meeting_info set meetusable ='+ conn.escape(data[0]) +' where meetingid= '+
            conn.escape(data[1]) +' and userid=' + conn.escape(data[2]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * update the meeting room accept push message or not
 * @param data
 * @param callback
 */
exports.updateMeetPushable = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'update user_meeting_info set pushable ='+ conn.escape(data[0]) +' where meetingid= '+
            conn.escape(data[1]) +' and userid=' + conn.escape(data[2]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * get the memnumber of meeting by meetingid
 * @param data
 * @param callback
 */
exports.getMeetMemNumber = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'select memnumber from meeting_info where meetingid = ' + conn.escape(data) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * update the memnumber of meeting with meetingid
 * @param data
 * @param callback
 */
exports.updateMeetMemNumber = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'update meeting_info set memnumber ='+ conn.escape(data[0]) +' where meetingid = '+
            conn.escape(data[1]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * update the meetname of meeting
 * @param data
 * @param callback
 */
exports.updateMeetRoomName = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'update meeting_info set meetname ='+ conn.escape(data[0]) +' where meetingid = '+
            conn.escape(data[1]) +' and userid = ' + conn.escape(data[2]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * update the jointime to table user_meeting_info
 * @param data
 * @param callback
 */
exports.updateMeetJoinTime = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'update user_meeting_info set jointime ='+ conn.escape(data[0]) +' where meetingid = '+
            conn.escape(data[1]) +' and userid = ' + conn.escape(data[2]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * query the meeting informaiton by meetingid
 * @param data
 * @param callback
 */
exports.queryMeetingInfoById = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'select table_meeting.meetingid, table_meeting.userid, meetname, meetdesc, meetusable, pushable,'
            + ' meettype1, memnumber, crttime from meeting_info as table_meeting, user_meeting_info as table_userMeeting '
            + ' where table_meeting.meetingid = ' + conn.escape(data[0]) +' and table_userMeeting.meetingid = '
            + conn.escape(data[0]) +' and table_userMeeting.userid = table_meeting.userid';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * query meeting owner or not by meetingid an userid
 * @param data
 * @param callback
 */
exports.queryMeetingOwner = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'select owner from user_meeting_info where meetingid= '+ conn.escape(data[0]) + ' and userid='
            + conn.escape(data[1]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * delete the information from table meeting_info
 * @param data
 * @param callback
 */
exports.deleteMeetingInfo = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }

        var sql = 'delete from meeting_info where meetingid= '+ conn.escape(data[0]) + ' and userid='
            + conn.escape(data[1]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * delete the information from table user_meeting_info
 * @param data
 * @param callback
 */
exports.deleteUserMeeting = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }

        var sql = 'delete from user_meeting_info where meetingid= '+ conn.escape(data[0]) + ' and userid='
            + conn.escape(data[1]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

//exports.getUserMeetingList = function (data, pageNum, pageSize, callback) {
//    pool.getConnection(function(err, conn) {
//        if(err) {
//            console.log("POOL =====>" + err);
//        }
//        var number = ((pageNum - 1) * pageSize);
//        var sql = 'select * from meeting_info where userid = ' + conn.escape(data[0]) + ' order by crttime desc limit '
//        + number +', ' + pageSize + '';
//        conn.query(sql, callback);
//        conn.release();
//    });
//}

/**
 * get user's meeting list from meeting_info and user_meeting_info
 * @param data
 * @param pageNum
 * @param pageSize
 * @param callback
 */
exports.getUserMeetingList = function (data, pageNum, pageSize, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var number = ((pageNum - 1) * pageSize);
        var sql = 'select table_meeting.userid as meetinguserid, table_user.meetingid as meetingid, table_meeting.meettype1 as meettype,' +
            ' meetname, meetdesc, meetusable, pushable, memnumber, owner, jointime from meeting_info as table_meeting, ' +
            ' user_meeting_info as table_user where table_user.userid = ' + conn.escape(data[0]) +
            ' and table_meeting.meetingid = table_user.meetingid order by jointime desc limit ' + number + ', ' + pageSize + '';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * get a list of receiving push participants
 * @param data
 * @param callback
 */
exports.getPushMeetingList = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'select userid from user_meeting_info where meetingid = ' + conn.escape(data[0]) +
            ' and pushable = 1 order by jointime desc';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * insert the meeting chat message into database
 * @param data
 * @param callback
 */
exports.insertRoomMessage = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }

        var sql = 'insert into message_info (messagetype, messageid, meetingid, sessionid, userid, message, sendtime) ' +
            'values ('+ conn.escape(data[0]) + ', ' + conn.escape(data[1]) + ', ' + conn.escape(data[2]) + ', '
            + conn.escape(data[3]) + ', ' + conn.escape(data[4]) + ', ' + conn.escape(data[5]) +', ' + (new Date()).valueOf() +')';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * get meeting room message list
 * @param data
 * @param pageNum
 * @param pageSize
 * @param callback
 */
exports.getRoomMessageList = function (data, pageNum, pageSize, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var number = ((pageNum - 1) * pageSize);
        var sql = 'select * from message_info where meetingid = ' + conn.escape(data[0]) + ' order by crttime desc limit '
            + number +', ' + pageSize + '';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * insert meeting session information into database when the meetingid id called.
 * @param data
 * @param callback
 */
exports.insertSessionMeetingInfo = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }

        var sql = 'insert into meeting_session_info (meetingid, sessionid, sessionstatus, sessiontype, sessionnumber, begtime) ' +
            'values ('+ conn.escape(data[0]) + ', ' + conn.escape(data[1]) + ', ' + conn.escape(data[2]) + ', '
            + conn.escape(data[3]) + ', ' + conn.escape(data[4]) + ', ' + (new Date()).valueOf() +')';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * update the meeting session status when the meeting status is changed.
 * @param data
 * @param callback
 */
exports.updateSessionMeetingStatus = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'update meeting_session_info set sessionstatus ='+ conn.escape(data[0]) +' where sessionid = '+
            conn.escape(data[1]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * update the meeting room end time
 * @param data
 * @param callback
 */
exports.updateSessionMeetingEndtime = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'update meeting_session_info set endtime ='+ (new Date()).valueOf() +' where sessionid = '+
            conn.escape(data[0]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}

/**
 * update the meeting session number when the meeting room is callled.
 * @param data
 * @param callback
 */
exports.updateSessionMeetingNumber = function (data, callback) {
    pool.getConnection(function(err, conn) {
        if(err) {
            console.log("POOL =====>" + err);
        }
        var sql = 'update meeting_session_info set sessionnumber ='+ conn.escape(data[0]) +' where sessionid = '+
            conn.escape(data[1]) +'';
        conn.query(sql, callback);
        conn.release();
    });
}