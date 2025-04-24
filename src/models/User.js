const mongoose = require("mongoose");
const argon2 = require("argon2");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    hasSeenIntro: {
        type: Boolean,
        default: "false"
    }
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await argon2.hash(this.password);
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.comparePassword = async function (inputPassword) {
    return await argon2.verify(this.password, inputPassword);
};

const User = new mongoose.model("users", UserSchema);

module.exports = User;