var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/init", function(req, res, next) {
  var userid = req.body.userid;
  var uactype = req.body.uactype;
  var uregtype = req.body.uregtype;
  var ulogindev = req.body.ulogindev;
  var ustatus = 1;
  var uname = dyncutils.randomStrNumber(8);
  var upushtoken = req.body.upushtoken;

  if (null == userid || userid.length == 0) {
    return dynchttp.sendMissParams(req, res, "userid");
  }
  if (null == uactype || uactype.length == 0) {
    return dynchttp.sendMissParams(req, res, "uactype");
  }
  if (null == uregtype || uregtype.length == 0) {
    return dynchttp.sendMissParams(req, res, "uregtype");
  }
  if (null == ulogindev || ulogindev.length == 0) {
    return dynchttp.sendMissParams(req, res, "ulogindev");
  }
  if (null == upushtoken || upushtoken.length == 0) {
    //return dynchttp.sendMissParams(req, res, "upushtoken");
      upushtoken = "";
  }

  db.insertUserInfo([userid, uactype, uregtype, ulogindev, ustatus, uname, upushtoken], function(err, response) {
      if (err) {
          dynchttp.sendDbError(req, res);
      } else {
          if(response.affectedRows == 1) {
              db.getUserInfoById([userid], function(err, userinfo) {
              if (err) {
                  dynchttp.sendDbError(req, res);
              } else {
                  redisClient.get(userid, function (err, reply) {
                      if(!err) {
                          var authorization = "";
                          if (null == reply) {
                              var token = userid + ":" + dyncutils.randomString();
                              authorization = dyncutils.aesCrypto(token);
                              redisClient.set(userid, authorization);
                              //redisClient.expire(userid, 60 * 60);
                          } else {
                              authorization = reply;
                          }
                          var responseJson = {
                              requestid: req._startTime.valueOf(),
                              code: 200,
                              authorization: authorization,
                              information: userinfo[0],
                              message: 'user init success'
                          };
                          dynchttp.sendSuccess(req, res, responseJson);
                      } else {
                          dynchttp.sendDbError(req, res);
                      }
                  });
              }
              })
          } else {
            var responseJson = {
              requestid: req._startTime.valueOf(),
              code: 400,
              message: 'user init failed'
            };
            dynchttp.sendSuccess(req, res, responseJson);
      }
      }
  })
});

router.post("/updatePushtoken", function(req, res, next) {
    dynchttp.validateUser(req, res, function(err, userid){
        if (userid) {
            var upushtoken = req.body.upushtoken;
            if (null == upushtoken || upushtoken.length == 0) {
              return dynchttp.sendMissParams(req, res, "upushtoken");
            }
            db.updatePushToken([upushtoken, userid], function (err, response) {
                if (!err) {
                    if(response.affectedRows == 1) {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 200,
                            message: 'update user pushtoken success'
                        };
                        dynchttp.sendSuccess(req, res, responseJson);
                    } else {
                        var responseJson = {
                            requestid: req._startTime.valueOf(),
                            code: 400,
                            message: 'update user pushtoken failed'
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

router.post("/signout", function(req, res, next) {
  dynchttp.validateUser(req, res, function(err, userid){
    if (userid) {
      redisClient.del(userid, function(err, replay) {
        if (err) {
          dynchttp.sendDbError(req, res);
        } else {
          var responseJson = {
            requestid: req._startTime.valueOf(),
            code: 200,
            message: 'sign out success'
          };
          console.log('success');
          dynchttp.sendSuccess(req, res, responseJson);
        }
      });
    } else {
      dynchttp.sendAuthorizationFailed(req, res);
    }
  });
});

module.exports = router;
