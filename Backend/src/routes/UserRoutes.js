const express = require('express');
const { getUsers, getUserById, registerUser, updateUser, deleteUser } = require('../controllers/UserController');

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
