const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '192.168.37.128', // 数据库主机
  port: 3306, // 数据库端口
  user: 'admin', // 数据库用户名
  password: 'abc123', // 数据库密码
  database: 'iot_db', // 数据库名称
  multipleStatements: true, // 允许执行多条SQL语句
  pool: 100, // 连接池大小
});

connection.connect((err) => {
  if (err) {
    console.error('连接失败:', err);
    return;
  }
  console.log('成功连接到数据库');
});

module.exports = connection;
