const mongoose = require("mongoose");

const testschema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },

    subject : {
        type: String, 
        required: true,
    },

    status: {
        type: String, 
        required: true,
    },

    questionIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Question'
    }],

    time : [{
        type: Number, 
        required : true
    }]
});

const Tests = mongoose.model("Tests", testschema);
module.exports = Tests;