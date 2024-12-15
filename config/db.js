const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("MONGO_URI is not defined in the .env file");
    process.exit(1);
}

console.log("mongoDB: ", uri);

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;

