const User = require('../models/User');
const argon2 = require('argon2');

const userList = async (req, res) => {
  // const users = await User.find();
  // res.render('userManagement', { users });
  const { search, role, hasSeenIntro, sort, order } = req.query;

  let query = {};

  if (role) {
    query.role = role;
  }

  if (hasSeenIntro !== undefined) {
    query.hasSeenIntro = hasSeenIntro === 'true';
  }

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  // Tentukan sorting
  let sortQuery = {};
  if (sort) {
    sortQuery[sort] = order === 'desc' ? -1 : 1; // Default: asc (1), desc (-1)
  } else {
    sortQuery.name = 1; // Sorting default: berdasarkan nama secara ascending
  }

  try {
    const users = await User.find(query).sort(sortQuery);
    res.render('userManagement', {
      users,
      searchFilter: search || '',
      roleFilter: role || '',
      hasSeenIntroFilter: hasSeenIntro || '',
      sortFilter: sort || 'name',
      orderFilter: order || 'asc',
      sessionUser: req.session.user
    });
  } catch (err) {
    console.error(err);
    res.render('userManagement', { error: 'Terjadi kesalahan saat memuat data.' });
  }
};


const userForm = async (req, res) => {
  const user = req.params.id ? await User.findById(req.params.id) : null;
  res.render('userForm', { user });
};

const userSave = async (req, res) => {
  const { name, password, role, hasSeenintro } = req.body;

  if (!name || !password) {
    return res.send("Semua field harus diisi.");
  }

  if (password.length < 8) {
    return res.send("Password minimal 8 karakter.");
  }

  if (!req.params.id) {
    const existingUser = await User.findOne({ name });
    if (existingUser) {
      return res.send("Nama pengguna sudah digunakan.");
    }

    // Gunakan new + save agar trigger pre('save')
    const newUser = new User({
      name,
      password, // plaintext, akan di-hash oleh pre('save')
      role,
      hasSeenIntro: hasSeenintro === 'true'
    });

    await newUser.save();

  } else {
    // Untuk edit, kita hash password secara manual karena pakai update
    const hash = await argon2.hash(password);
    await User.findByIdAndUpdate(req.params.id, {
      name,
      password: hash,
      role,
      hasSeenIntro: hasSeenintro === 'true'
    });
  }

  res.redirect('/admin/users');
};

const userDelete = async (req, res) => {
    const userToDelete = await User.findById(req.params.id);

    // Jika admin menghapus dirinya sendiri
    if (userToDelete._id.toString() === req.session.user._id) {
      await User.findByIdAndDelete(req.params.id);
      req.session.destroy(() => {
        res.redirect("/auth/login");
      });
    } else {
      await User.findByIdAndDelete(req.params.id);
      res.redirect("/admin/users");
    }
};

module.exports = {userList, userForm, userSave, userDelete};