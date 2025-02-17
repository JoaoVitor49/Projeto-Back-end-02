const jwt = require("jsonwebtoken")

//autenticação de token
const auth = (req, res, next) => {
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) 
        return res.status(401).redirect('/users/login')
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).redirect('/users/login')
    }
}

const isAdmin = (req, res, next) =>{
    if(req.user.isAdmin){
        next()
    }else{
        res.status(403).send('Acesso Negado: Apenas admin')
    }
}

module.exports = {auth, isAdmin}