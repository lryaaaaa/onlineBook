const mysql = require('mysql');

// 创建数据库连接对象
var connection = mysql.createPool({
  host: 'localhost',
  user: 'root',// 账号
  password: '******',// 密码
  database: 'base1',// 数据库名
  useConnectionPooling: true,
})

// 连接数据库
connection.getConnection(() => {
  console.log('数据库连接成功！');
});

module.exports = connection;