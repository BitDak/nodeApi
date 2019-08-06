var express = require('express');

var router = express.Router();

var userDAO = require('../dao/userDAO');
var result = require('../model/result');

//服务器控制台反馈：Api to use about requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

//服务器控制台反馈：GET home page
router.get('/', function(req, res, next) {
    res.json({ message: 'Hello! welcome to our api!' });
});


// 接口方法get listUsers
router.get('/listUsers', function(req, res,next) {
    console.log('listUsers called');
    userDAO.list(function (users) {
        res.json(result.createResult(true, users));
    });
});
 
// 接口方法get listUserInfo
router.get('/listUserInfo:id', function(req, res) {
    var id = req.params.id;
    console.log('listUserInfo called, id: ' + id);
    userDAO.getById(id, function (user) {
        res.json(result.createResult(true, user));
    });
});

// 接口方法delete deleteUser
router.delete('/deleteuser:id', function (req, res) {
    var id = req.params.id;
    console.log('deleteUser called, id=' + id);
    userDAO.deleteById(id, function (success) {
        res.json(result.createResult(success, null));
    });
});

// 接口方法post addUser
router.post('/addUser', function (req, res) {
    console.log('addUser called');
    var user = req.body;
    console.log(user);
    userDAO.add(user, function (success) {
        var r =  result.createResult(success, null);
        res.json(r);
    });
});

// 接口方法put updateUser 
router.put('/updateUser:id', function (req, res) {
    console.log('updateUser called');
    var user = req.body;
    user.id = req.params.id;
    console.log(user);
    userDAO.update(user, function (success) {
        var r =  result.createResult(success, null);
        res.json(r);
    });
});

// 接口方法patch user
router.patch('/patchUser:id', function (req, res) {
    console.log('patchUser called');
    userDAO.getById(req.params.id, function (user) {
        var username = req.body.username;
        if(username) {
            user.username = username;
        }
        var password = req.body.password;
        if(password) {
            user.password = password;
        }
        console.log(user);
        userDAO.update(user, function (success) {
            var r =  result.createResult(success, null);
            res.json(r);
        });
    });
}); 

module.exports = router;