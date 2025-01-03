const Tests = require('../models/Tests');

const gettests = async(req, res) => {
    try{
        const tests= await Tests.find();
        res.json(tests);
    }catch(err){
        res.status(500).json({ message: err.message});
    }
};

module.exports = {gettests};
