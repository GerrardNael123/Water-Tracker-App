const express = require("express");
const { register, login } = require("../controllers/authControllers");
// const { isAuthenticated } = require("../middleware/authMiddleware"); 

const router = express.Router();

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/logout", async(req, res) => {
    req.session.destroy((err) => {
       
    res.redirect("/auth/login"); 
    });
});

router.post("/register", register);
router.post("/login", login);

module.exports = router;
