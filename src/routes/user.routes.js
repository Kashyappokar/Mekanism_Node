const express = require('express')
const {createUser,loginUser, getUserProfile, logOut} = require('../controllers/user.controller')
const loggedIn = require('../middleware/auth.middleware')

const router = express.Router()
router.post('/register',createUser)
router.post('/login',loginUser)
router.get('/logout',loggedIn,logOut)
router.get('/profile',loggedIn, getUserProfile)

module.exports = router;