const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
require('dotenv').config();


const signup = async (username,password) => {
    try{
        const hashedPassword = await bcrypt.hash(password,8)
        const newUser = new User({
            username,
            password: hashedPassword
        })
        await newUser.save()
    }
    catch(e)
    {
        throw e
    }
}
const login = async (username,password) => {
    try{
        const user = await User.findOne({username})
        if(!user){
            throw new Error('user not found')
        }
        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch)
        {
            throw new Error('Invalid password')
        }
        const token = jwt.sign({userId: user._id},process.env.SECRET_JSON_KEY)
        console.log('successful login')
        return token
    }
    catch(e)
    {
        console.log(e)
    }
}
const getUsername = async (userId)=>{
    try{
        const user = User.findById(userId)
        if(!user)
        {
            throw new Error('user not found')
        }
        return  user
    }catch(e){
        console.log(e)
    }
}
module.exports = {
    signup,
    login,
    getUsername
}