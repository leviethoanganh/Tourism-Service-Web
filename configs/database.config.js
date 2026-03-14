const mongoose = require('mongoose');
require("dotenv").config();

connect = async () => {
    try {
    await mongoose.connect(process.env.DATABASE);
    } catch (error) {
    handleError(error);
    }    
}

module.exports = connect;

