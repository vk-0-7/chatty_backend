
// const User = require('../models/userModel');
const User = require("../models/userModel.js");

const generateToken = require('../utils/token')

// import generateToken from '../utils/token';

const Register = async (req, res) => {
    const { name, email, password, pic } = req.body;
    console.log(req.file);

    if (!name || !email || !password) {
        res.status(400);
        return res.status(400).send({ message: "Enter all the Fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).send({ message: "user already exist" })

    }

    const user = new User({
        name,
        email,
        password,
        pic,
    })
    const createdUser = await user.save()
    if (createdUser) {
        return res.status(201).send({
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            pic: createdUser.pic,
            token: generateToken(createdUser._id)
        })
    }
    else {
        return res.status(500).send({ message: "Error creating user" })

    }

};


const Login = async (req, res) => {
    const { email, password } = req.body;

    const isUser = await User.findOne({ email });

    if (isUser && (await isUser.matchPassword(password))) {
        res.status(200).send({
            _id: isUser._id,
            name: isUser.name,
            email: isUser.email,
            pic: isUser.pic,
            token: generateToken(isUser._id)

        })
    }
    else {
        res.status(500).send({ message: "Failed to Login" });
    }


}

const getallUser = async (req, res) => {
    try {

        const users =await User.find({});
         res.status(200).send(users)

    } catch (error) {
        res.status(404).send({Error:"cannot fetch all users"})

    }
}

module.exports = { Register, Login, getallUser };