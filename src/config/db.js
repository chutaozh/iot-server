const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost', // 数据库主机
  port: 3306, // 数据库端口
  user: 'root', // 数据库用户名
  password: 'abc123', // 数据库密码
  database: 'iot_db', // 数据库名称
  multipleStatements: true // 允许执行多条SQL语句
});

connection.connect((err) => {
  if (err) {
    console.error('连接失败:', err);
    return;
  }
  console.log('成功连接到数据库');
});

module.exports = connection;
