const User = require("../models/User");
const argon2 = require("argon2");

const profilePage = async (req, res) => {
    const user = await User.findById(req.session.user._id);
    res.render('profile', { user });
  };
  
const updateProfile = async (req, res) => {
    const { name } = req.body;
    await User.findByIdAndUpdate(req.session.user._id, { name });
    // req.session.user.name = name;
    res.redirect('/profile');
  };
  
const changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.session.user._id);

    const valid = await user.comparePassword(currentPassword);
    if (!valid) return res.send('Password lama salah');

    user.password = newPassword;
    // user.password = hashed;
    await user.save();
    // req.session.user.password = undefined;
    // console.log("Current Password:", currentPassword);
    // console.log("New Password:", newPassword);

    res.redirect('/auth/logout');
  };
  
const deleteAccount = async (req, res) => {
    await User.findByIdAndDelete(req.session.user._id);
    req.session.destroy(() => {
      res.redirect('/auth/signup');
    });
  };

module.exports = {profilePage, updateProfile, changePassword, deleteAccount};