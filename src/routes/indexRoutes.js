const express = require("express");
const { isAuthenticated } = require("../middleware/authMiddleware");
const User = require("../models/User"); 
const {home,addWater,editWater,deleteWater,toggleMode,resetAll} = require('../controllers/indexControllers');

const router = express.Router();

router.get('/notif', isAuthenticated, (req, res) =>{
    if(req.session.user.hasSeenIntro){
        return res.redirect("/");
    }
    res.render("notif");
});

router.post("/notif", async(req, res) =>{
    const userId = req.session.user._id;

    await User.findByIdAndUpdate(userId, {hasSeenIntro: true});
    req.session.user.hasSeenIntro = true;

    res.redirect("/");
});

// router.get('/', isAuthenticated, (req, res) => {
//     res.render('mainpage');
// });
router.get('/', isAuthenticated, home);
router.post('/add', isAuthenticated, addWater);
router.post('/edit/:id', isAuthenticated,  editWater);
router.post('/delete/:id', isAuthenticated, deleteWater);
router.post('/toggleMode', isAuthenticated, toggleMode);
router.post('/reset', isAuthenticated, resetAll);



module.exports = router;