require('dotenv').config();
const mysql = require('mysql2');

// Cấu hình pool kết nối MySQL
const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, // thêm dòng này!
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,  
    port: 3306,  
    waitForConnections: true,     
    connectionLimit: 10,            
    queueLimit: 0                
});

// Kiểm tra kết nối
db.getConnection((err, connection) => {
    if (err) {
        console.error('Lỗi khi kết nối MySQL:', err);
        return;
    }
    console.log('Đã kết nối tới cơ sở dữ liệu MySQL');
    connection.release();  // Giải phóng kết nối sau khi sử dụng
});

module.exports = db;
