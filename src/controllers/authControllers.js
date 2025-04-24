const User = require("../models/User");
const argon2 = require("argon2");

const register = async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    
    if (!username || !password || !confirmPassword){
    // if(!username){
      return res.render("register", { error: "All fields are required." }
    )};
  
    if (password !== confirmPassword) {
        return res.render('register', { error: "Passwords do not match" });
    }

    if (password.length < 8){
      return res.render("register", { error: "Password must be at least 8 characters." }
    )};
  
    try {
      const existingUser = await User.findOne({ name: username });
      if (existingUser) {
        return res.render("register", { error: "Username already taken." });
    }
  
    const newUser = new User({ name: username, password });
    await newUser.save();
   
    return res.redirect("/auth/login");
    }catch (err) {
    return res.render("register", { error: "Register failed. Try again." });
    }
};

const login = async (req, res) =>{
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ name: username });
      if (!user || !(await user.comparePassword(password))) {
        return res.render("login", { error: "Wrong username or password" });
      }
  
    req.session.user = {
      _id: user._id,
      name: user.name,
      role: user.role,
      hasSeenIntro: user.hasSeenIntro,
    };
    
    if(user.role === "admin"){
      return res.redirect('/admin/users');
    }
    
    if(!user.hasSeenIntro){
      return res.redirect("/notif")
    } 

    res.redirect("/")

    }catch (err) {
      return res.render("login", { error: "Login error. Try again." });
    }
};


module.exports = {register, login};