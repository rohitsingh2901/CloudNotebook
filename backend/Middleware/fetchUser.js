const jwt = require('jsonwebtoken');
const JWT_SecretToken = "Rohiht@dh&%*$9@jdhin";

const fetchUser = (req,res,next)=>{
    const token = req.header("auth-token")
    if(!token) {
        res.status(401).send({error : "Invalid authentication credentials"})
    }
    try {
        const verifyToken = jwt.verify(token,JWT_SecretToken);
        req.user = verifyToken.user
        next()

    } catch (error) {
        res.status(401).send({error : "Invalid authentication credentials"})
    }
}


module.exports = fetchUser
