const Log = require('../models/Logs');

const logs = async(req, res) =>{
    const { username, logs } = req.body;
    const { testId } = req.params;

    if (!username || !logs) {
        return res.status(400).json({ message: 'Username and logs are required' });
    }
    try{
        const newLog = new Log({
        username,
        testId,
        logs,
        });
    
        await newLog.save();
        res.status(201).json({ message: 'Logs saved successfully' });
    }catch(error){
        res.status(500).json({ message: 'Error saving logs' });
    }
};

module.exports= {logs};