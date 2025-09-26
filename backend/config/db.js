// config/db.js
const mongoose = require("mongoose");

// Set strictQuery explicitly to suppress the warning
//mongoose.set('strictQuery', true);

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);  // Remove deprecated options
        console.log("MongoDB connection successful.");
    } catch (error) {
        console.error("MongoDB connection failed. Error: ", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;