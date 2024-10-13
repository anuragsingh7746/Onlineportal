const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const validate = async(req, res) =>{
    const {username, password} = req.body;

    try{
        const user = await Users.findOne({username});
        
        if(!user){
            return res.status(400).json({ message : 'Invalid Username'});
        }

        const ismatch = await bcrypt.compare(password, user.password);

        if(!ismatch){
            return res.status(400).json({ message : 'Invalid Password'});
        }

        return res.status(200).json({ message: 'Login successful', user: user.username });

    }catch(error){
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { validate };
