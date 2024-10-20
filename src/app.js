const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const requestHandler = require('./middlewares/requestHandler');
const responseHandler = require('./middlewares/responseHandler');
const logRoutes = require('./routes/logRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const commonRoutes = require('./routes/commonRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 允许跨域的源
const allowedOrigins = [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:5173',
    // 'http://www.xxxx.com'
];

// CORS 配置
const corsOptions = {
    origin: (origin, callback) => {
        // 如果请求的源在允许的来源列表中，则允许
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('不允许的跨域请求'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的 HTTP 方法
    allowedHeaders: ['Content-Type', 'Authorization'], // 允许的请求头
}

app.use(express.json());
app.use(bodyParser.json()); // 解析 application/json
app.use(bodyParser.urlencoded({ extended: true })); // 解析 application/x-www-form-urlencoded
app.use(requestHandler); // 使用请求处理中间件
app.use(responseHandler); // 使用响应格式化中间件
app.use(cors(corsOptions)); // 使用 CORS 中间件

app.use('/api/logs', logRoutes);
app.use('/api/user', userRoutes);
app.use('/api/role', roleRoutes);
app.use('/api/common', commonRoutes);

// 404 处理程序
app.use((req, res) => {
    res.status(404).send('404 Not Found: The requested resource could not be found.');
});

app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
