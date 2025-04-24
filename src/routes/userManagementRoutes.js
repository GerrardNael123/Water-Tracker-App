const express = require('express');
const router = express.Router();
const {userList, userForm, userSave, userDelete} = require('../controllers/userManagementControllers');
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware');

router.get('/users', isAuthenticated, isAdmin, userList);
router.get('/users/add', isAuthenticated, isAdmin, userForm);
router.get('/users/edit/:id', isAuthenticated, isAdmin, userForm);
router.post('/users/save', isAuthenticated, isAdmin, userSave);
router.post('/users/save/:id', isAuthenticated, isAdmin, userSave);
router.get('/users/delete/:id', isAuthenticated, isAdmin, userDelete);

module.exports = router;
