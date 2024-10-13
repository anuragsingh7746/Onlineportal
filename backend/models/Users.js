const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userschema = new mongoose.Schema({
    username: {
        type: String, 
        required : true,
        unique : true, 
    },

    password: {
        type: String, 
        required : true, 
    },

    name : {
        type: String, 
        required: true, 
    },
});


userschema.pre('save', async function (next) {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const Users = mongoose.model("Users", userschema);
module.exports = Users;