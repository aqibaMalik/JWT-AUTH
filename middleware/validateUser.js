const jwt = require('jsonwebtoken')

const validateUser = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1]
        jwt.verify(token, process.env.SECRET_TOKEN, (err, user) => {
            if(err) res.status(401).send('Unauthorized')
            req.userId = user._userId
            next()
    })
    }catch{
        res.status(401).json("You are not allowed")
    }
}
module.exports = validateUser