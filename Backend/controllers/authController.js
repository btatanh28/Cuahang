const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Đăng ký người dùng
exports.register = async (req, res) => {
    const { IDUser, TenNguoiDung, MatKhau, Email, SoDienThoai, DiaChi, VaiTro } = req.body;

    if (!TenNguoiDung || !MatKhau || !Email || !SoDienThoai) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    try {
        const [existingUser] = await db.query('SELECT IDUser FROM User WHERE IDUser = ?', [IDUser]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'IDUser đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(MatKhau, 10);
        await db.query('INSERT INTO User (IDUser, TenNguoiDung, MatKhau, Email, SoDienThoai, DiaChi, VaiTro) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [IDUser, TenNguoiDung, hashedPassword, Email, SoDienThoai, DiaChi || null, VaiTro || 'Nhân Viên']);

        res.status(201).json({ message: 'Đăng ký thành công', email: Email });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

//Đăng ký khách hàng
exports.registerClient = async (req, res) => {
    const { IDKhachHang, TenKhachHang, MatKhau, Email, SoDienThoai, DiaChi, VaiTro } = req.body;

    if (!TenKhachHang || !MatKhau || !Email || !SoDienThoai) {
        return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    try {
        const [existingUser] = await db.query('SELECT IDKhachHang FROM KhachHang WHERE IDKhachHang = ?', [IDKhachHang]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'IDUser đã tồn tại' });
        }

        const hashedPassword = await bcrypt.hash(MatKhau, 10);
        await db.query('INSERT INTO KhachHang (IDKhachHang, TenKhachHang, MatKhau, Email, SoDienThoai, DiaChi, VaiTro) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [IDKhachHang, TenKhachHang, hashedPassword, Email, SoDienThoai, DiaChi || null, VaiTro || 'Khách Hàng']);

        res.status(201).json({ message: 'Đăng ký thành công', email: Email });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};

// Đăng nhập người dùng
exports.login = async (req, res) => {
    const { Email, MatKhau } = req.body;

    if (!Email || !MatKhau) {
        return res.status(400).json({ message: 'Thiếu email hoặc mật khẩu' });
    }

    try {
        // Kiểm tra trong bảng User trước
        let user = null;
        let userType = null;
        let [userResult] = await db.query('SELECT * FROM User WHERE Email = ?', [Email]);
        
        if (userResult.length > 0) {
            user = userResult[0];
            userType = 'User';
        } else {
            // Nếu không tìm thấy trong User, kiểm tra trong KhachHang
            const [khachHangResult] = await db.query('SELECT * FROM KhachHang WHERE Email = ?', [Email]);
            if (khachHangResult.length > 0) {
                user = khachHangResult[0];
                userType = 'KhachHang';
            }
        }

        if (!user) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const validPassword = await bcrypt.compare(MatKhau, user.MatKhau);
        if (!validPassword) {
            return res.status(400).json({ message: 'Email hoặc mật khẩu không đúng' });
        }

        const tokenPayload = {
            id: userType === 'User' ? user.IDUser : user.IDKhachHang,
            email: user.Email,
            userType: userType,
            role: userType === 'User' ? user.VaiTro : 'Khách Hàng'
        };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: 'Đăng nhập thành công', 
            token,
            userType: userType,
            role: userType === 'User' ? user.VaiTro : 'Khách Hàng'
        });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
};
