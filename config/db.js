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
        await mongoose.connect(uri, {
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        w: "majority",
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB Connected...');
        console.log("---------------------------------");
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = connectDB;

