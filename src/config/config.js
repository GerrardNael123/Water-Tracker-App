const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database succesfully connected.");
    }catch(error){
        console.log("Database cannot be connected", error);
        process.exit(1);
    }
};

module.exports = connectDB;