const Test = require('../models/Tests');

const getquestion = async(req, res) =>{
    try{
        const {testId} = req.params;

        const test = await Test.findById(testId).populate('questionIds');

        if (!test) {
            return res.status(404).json({ message: 'Test not found' });
        }

        res.status(200).json(test);
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {getquestion};