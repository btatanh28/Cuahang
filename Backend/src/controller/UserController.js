const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Lấy danh sách người dùng
exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT IDUser, TenNguoiDung, Email, SoDienThoai, DiaChi, VaiTro FROM User');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Lấy thông tin người dùng theo ID
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const [user] = await db.query('SELECT IDUser, TenNguoiDung, Email, SoDienThoai, DiaChi, VaiTro FROM User WHERE IDUser = ?', [id]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }

        res.status(200).json(user[0]);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { TenNguoiDung, Email, SoDienThoai, DiaChi, VaiTro } = req.body;

    try {
        await db.query('UPDATE User SET TenNguoiDung = ?, Email = ?, SoDienThoai = ?, DiaChi = ?, VaiTro = ? WHERE IDUser = ?', 
            [TenNguoiDung, Email, SoDienThoai, DiaChi, VaiTro, id]);

        res.status(200).json({ message: 'Cập nhật thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM User WHERE IDUser = ?', [id]);
        res.status(200).json({ message: 'Xóa thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
