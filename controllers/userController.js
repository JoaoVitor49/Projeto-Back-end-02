const { User } = require('../models/indexModel');
const jwt = require('jsonwebtoken');

exports.showLoginPage = (req, res) => {
    res.render('login')
};

exports.showRegisterPage = (req, res) => {
    res.render('register')
}

exports.loginUser = async (req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({where: {email}})
        if (user && user.password == password) {
            const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' })
            res.cookie('token', token, { httpOnly: true })
            res.redirect('/tickets')
        } else {
            res.status(401).send('Credencias Invalidas!')
        }
    } catch (error) {
        res.status(500).send({error})
    }
}

exports.registerUser = async (req, res) => {
    const {email, password} = req.body
    try {
        await User.create({email, password})
        res.redirect('/users/login')
    } catch (error) {
        res.status(400).send('Erro ao registrar usuario!')
    }
}

exports.logoutUser = (req, res) => {
    res.clearCookie('token')
    res.redirect('/users/login')
}

