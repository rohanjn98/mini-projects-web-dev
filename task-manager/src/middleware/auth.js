const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        //Look for the header provided by the user
        const token = req.header('Authorization').replace('Bearer ', '')

        //Validate the header
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        //Find the associated user. Check whether the user with that token exists and current token is still present in tokens array
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token})

        if (!user) {
            throw new Error()
        }

        //Since we found the user from the DB assign it to req to use resources efficiently.
        req.token = token //for logout purpose -> logout only from current session/device
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({error: 'Please authenticate.'})
    }
}

module.exports = auth