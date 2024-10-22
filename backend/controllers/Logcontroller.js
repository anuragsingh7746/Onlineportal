const Log = require('../models/Logs');

const logs = async(req, res) =>{
    const { username, logs, centerId, deviceId, testLocation  } = req.body;
    const { testId } = req.params;

    if (!username || !logs || !centerId || !deviceId || !testLocation) {
        return res.status(400).json({ message: 'Username and logs are required' });
    }
    try{
        const newLog = new Log({
        username,
        testId,
        centerId, 
        deviceId, 
        testLocation,
        logs,
        });
    
        await newLog.save();
        res.status(201).json({ message: 'Logs saved successfully' });
    }catch(error){
        res.status(500).json({ message: 'Error saving logs' });
    }
};

module.exports= {logs};