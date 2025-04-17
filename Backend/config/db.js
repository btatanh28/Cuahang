require('dotenv').config();  

const mysql = require('mysql2');

// Cấu hình pool kết nối
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,     
    connectionLimit: 10,            
    queueLimit: 0                
});

// Sử dụng pool kết nối
db.getConnection((err, connection) => {
    if (err) {
        console.error('Lỗi khi kết nối MySQL:', err);
        return;
    }
    console.log('Đã kết nối tới cơ sở dữ liệu MySQL');
    connection.release();  
});

module.exports = db;