## Node.js实现restful API



### 简述

​	通过node.js实现后台数据库为mysql下的RestFul Api。



###编制api

| 序号 | URL               | Http方法 | 发送内容  | 方法实现的功能     |
| ---- | ----------------- | -------- | --------- | ------------------ |
| 1    | /api/listUsers    | GET      | （空）    | 显示所有用户记录   |
| 2    | /api/listUserInfo | GET      | id        | 显示一用户详细信息 |
| 3    | /api/addUser      | POST     | JSON      | 添加新用户         |
| 4    | /api/deleteUser   | DELETE   | id        | 删除用户记录       |
| 5    | /api/updateUser   | PUT      | id & JSON | 更新用户记录       |
| 6    | /api/patchUser    | PATCH    | id & JSON | 更新用户记录       |



###引用关系：

​	server.js—>route.js—>userDao.js & result.js（其中userDao.js—>userSqlMap.js & mysqlConf.js)



### 测试



#####GET方法实现listUsers

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



#####GET方法实现listUserInfo

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



#####POST方法实现addUser

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



#####DELETE方法实现deleteUser

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



#####PUT方法实现updateUser

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



#####PATCH方法实现patch

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

