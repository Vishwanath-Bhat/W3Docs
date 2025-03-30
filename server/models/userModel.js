// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator')


const Schema = mongoose.Schema
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
});

userSchema.statics.signup = async function(username, email,password){
    //validation
    if(!email || !password){
        throw Error('All field must be filled')
    }
    if(!validator.isEmail(email)){
        throw Error('Email is not Valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }


    const existingEmail = await this.findOne({email})
    const existingUsername = await this.findOne({username})

    if(existingEmail){
        throw Error('Email already in use')
    }
    if(existingUsername){
        throw Error('Username already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({username, email , password: hash})
    
    return user
}

//static login method
userSchema.statics.login = async function (username, password) {
    if(!username || !password){
        throw Error('All field must be filled')
    }

    const user = await this.findOne({username})

    if(!user){
        throw Error('Incorrect Username')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error('Incorrect Password')
    }

    return user
}


module.exports = mongoose.model('User', userSchema);
