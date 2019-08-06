module.exports = {
    mysql: {
        host: 'mysqlDatabaseIP',
        port:'3306',
        user: 'root',
        password: 'password',
        database:'mysqlDatabase',
        // 最大连接数，默认为10
        connectionLimit: 10
    }
};