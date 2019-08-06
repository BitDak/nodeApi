## Node.js实现restful API

### 简述

​	通过node.js实现后台数据库为mysql下的RestFul Api。

###1. 创建工程文件夹

``````
mkdir nodeApi
``````

###2. 环境

​	用到的module

​		Express	涉及该框架的方法功能。

​		mysql	用于连接mysql数据库。

​		body-parser  用于req.body。

``````
$ cd nodeApi
$ npm init
$ npm install --save express mysql body-parser
``````

package.json

``````json
{
  "name": "nodeapi",
  "version": "1.0.0",
  "description": "",
  "main": "server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "body-parser": "^1.19.0",
    "express": "^4.17.1",
    "mysql": "^2.17.1"
  }
}
``````

###3. 工具

Chrome 浏览器

​	Advanced REST Client浏览器插件。
###4. 编制api
| 序号 | URL               | Http方法 | 发送内容  | 方法实现的功能     |
| ---- | ----------------- | -------- | --------- | ------------------ |
| 1    | /api/listUsers    | GET      | （空）    | 显示所有用户记录   |
| 2    | /api/listUserInfo | GET      | id        | 显示一用户详细信息 |
| 3    | /api/addUser      | POST     | JSON      | 添加新用户         |
| 4    | /api/deleteUser   | DELETE   | id        | 删除用户记录       |
| 5    | /api/updateUser   | PUT      | id & JSON | 更新用户记录       |
| 6    | /api/patchUser    | PATCH    | id & JSON | 更新用户记录       |


###5. 实施步骤

#####1.  引用关系：


​	server.js—>route.js—>userDao.js & result.js（其中userDao.js—>userSqlMap.js & mysqlConf.js)

创建文件（树）

``````
$ mkdir conf
$ touch conf/mysqlConf.js
$ mkdir dao
$ touch dao/userDao.js
$ touch dao/userSqlMap.js
$ mkdir routes
$ touch routes/route.js
$ mkdir model
$ touch model/result.js
$ touch server.js
``````
#####2.  代码：
mysqlConf.js

``````javascript
module.exports = {
    mysql: {
        host: 'hostIP',
      	port:	'3306'，
        user: 'root',
        password: 'password',
        database:'mysqDatabase',
        // 最大连接数，默认为10
        connectionLimit: 10
    }
};
``````

​	connectionLimit 指的就是连接池可创建的最大连接数，没有最小连接数，connectionLimit 由应用程序开发者自己设置，肯定是要不超过 mysql 的最大连接数。

userSqlMap.js

``````javascript
var userSqlMap = {
    add: 'insert into user(username, password) values(?, ?)',
    deleteById: 'delete from user where id = ?',
    update: 'update user set username=?, password=? where id=?',
    list: 'select * from user',
    getById: 'select * from user where id = ?'
};

module.exports = userSqlMap;
``````

``````
touch server.js
``````

result.js

``````javascript
exports.createResult = function(success, data) {
    var result = {};
    result.success = success;
    result.data = data;
    return result;
};
``````

userDao.js

``````javascript
var mysql = require('mysql');

var mysqlConf = require('../conf/mysqlConf');
var userSqlMap = require('./userSqlMap');
var pool = mysql.createPool(mysqlConf.mysql);

module.exports = {  //将add，list，getByID等都暴露到被引用的module
    add: function (user, callback) {
        pool.query(userSqlMap.add, [user.username, user.password], function (error, result) {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    list: function (callback) {
        pool.query(userSqlMap.list, function (error, result) {
            if (error) throw error;
            callback(result);
        });
    },
    getById: function (id, callback) {
        pool.query(userSqlMap.getById, id, function (error, result) {
            if (error) throw error;
            console.log(result[0]);
            callback(result[0]);
        });
    },
    deleteById: function (id, callback) {
        pool.query(userSqlMap.deleteById, id, function (error, result) {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    },
    update: function (user, callback) {
        pool.query(userSqlMap.update, [user.username, user.password, user.id], function (error, result) {
            if (error) throw error;
            callback(result.affectedRows > 0);
        });
    }
};
``````

route.js

``````javascript
var express = require('express');

var router = express.Router();

var userDAO = require('../dao/userDAO');
var result = require('../model/result');

//服务器控制台反馈：Api to use for all requests
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
``````

server.js

``````javascript
var express = require('express');   //引入express模块
var bodyParser = require('body-parser');    //req.body要用到

var route = require('./routes/route');

var app = express();        //创建express的实例

app.use(bodyParser.json());

app.use('/api', route)

app.listen(3000,function () {    ////监听3000端口
    console.log('Restful API running at 3000 port');
});
``````
#####3.  运行

在工程根文件夹下：

``````
$ node server.js
``````


### 6. 接口测试


#####1.  GET方法实现listUsers

   URL	`http://localhost:3000/api/listusers/`

   说明：URL中listUsers的大写字符写成小写也可以。最后有没有‘/’都可以。


接口返回：

``````json
{"success":true,"data":[{"id":1,"username":"wangwu","password":"lisi"},{"id":2,"username":"zhangsan","password":"zhangsan"}]}
``````
控制台返回信息：

``````
Something is happening.
listUsers called
``````

#####2.  GET方法实现listUserInfo

   URL	`http://localhost:3000/api/listUserInfo1`

接口返回：

``````json
{"success":true,"data":{"id":1,"username":"wangwu","password":"lisi"}}
``````

控制台返回信息：

``````json
Something is happening.
listUserInfo called, id: 1
RowDataPacket { id: 1, username: 'wangwu', password: 'lisi' }
``````

#####3.  POST方法实现addUser

   URL	`http://localhost:3000/api/addUser/`

   Set "Content-Type" header to overwrite this value.-->application/json


Payload(Raw)


``````json
{ "username": "postTest", "password": "postTest" }
``````

接口返回：

``````json
{"success":true,"data":null}
``````

控制台返回信息：

``````json
Something is happening.
addUser called
{ username: 'postTest', password: 'postTest' }
``````

#####4.  DELETE方法实现deleteUser

​	URL	`http://localhost:3000/api/deleteUser1/`

接口返回：

``````json
{"success":true,"data":null}
``````

控制台返回信息：

``````
Something is happening.
deleteUser called, id=1
``````


#####5.  PUT方法实现updateUser

​	URL	`http://localhost:3000/api/updateUser3/`

Payload(Raw)

```json
{ "username": "updateUser", "password": "updatePassword" }
```

接口返回：

``````json
{"success":true,"data":null}
``````

控制台返回信息：

``````
Something is happening.
updateUser called
{ username: 'updateUser', password: 'updatePassword', id: '3' }
``````

​	**重要提示：数据库中没有id为1的数据记录，接口返回false，但控制台返回没有异常。**

#####6.  PATCH方法实现patch

​	URL	`http://localhost:3000/api/patchUser2/`

Payload(Raw)

```json
{ "username": "updateUser", "password": "updatePassword" }
```

接口返回：

``````json
{"success":true,"data":null}
``````

控制台返回信息：

``````json
Something is happening.
patchUser called
RowDataPacket { id: 2, username: 'zhangsan', password: 'zhangsan' }
RowDataPacket { id: 2, username: 'updateUser', password: 'updatePassword' }
``````

###7.  小结

​	未来还需要进一步探索：

- token 

- user --> token 机制

- 剥离id的实现get delete put

- node api 压力测试

- node api 集群实现负载均衡

  