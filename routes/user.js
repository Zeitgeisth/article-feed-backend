const express = require('express');
const User = require("../models/user");
const {check, validationResult} = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

//Create User
//No Authentication
//Users/createUser

router.post("/createUser",
    [
        check("firstName", "firstName is Required").not().isEmpty(),
        check("lastName", "lastName is Required").not().isEmpty(),
        check("phone", "Phone number is Required and should be 10 digits").isLength({min:10}),
        check("email", "Email is Required").isEmail(),
        check("dob", "Date of Birth is Required").not().isEmpty(),
        check("password", "Password should be 6 or more characters").isLength({min: 6}),
    ], async(req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array()[0].msg);
            return res.json(errors.array()[0].msg);
        }

        let {firstName, lastName, phone, email, dob, password, preferences} = req.body;

        const existUser = await User.findOne({
            where: {
                email,
            },
        });
        

        console.log("user Exists");
        if(existUser) return res.json("User Exists");
        try {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            const newUser = await User.create({
                firstName,
                lastName,
                phone,
                email,
                dob,
                password,
                preferences
            });
            await res.status(200).json(`User created of ${newUser.firstName}`);
        } catch (error) {
            console.log(error.message);
            await res.status(500).send("Error Creating User");
        }

    });

    //Login
    //No Authentication
    //Users/loginUser

    router.post("/loginUser",
    [
        check("email", "Email is Required").isEmail(),
        check("password", "Password should be 6 or more characters").isLength({min: 6}),
    ], async (req, res)=>{
        console.log(req.body);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array()[0].msg);
            return res.status(400).json(errors.array()[0].msg);
        }

        let { email, password} = req.body;

        const user = await User.findOne({
            where: {
                email,
            },
        });
        
        if(!user) return res.status(400).json({errors: [{msg: "Invalid Credentials"}]});

        console.log(user);
        
        try {
            const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch) { return res.status(400).json({errors: [{msg: "Invalid Credentials"}]})};

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get("jwtSecretKey"),
                {expiresIn: 36000},
                async (err, token) => {
                    if(err) throw err;
                    res.json({token: token, id:user.id, userD: user});
                }
            );
            
        } catch (error) {
            console.log(error.message);
            await res.status(500).send("Error Logging In");
        }

    });

//Edit User
// Authentication
//Users/editUser

router.put("/editUser",
    [
        check("firstName", "firstName is Required").not().isEmpty(),
        check("lastName", "lastName is Required").not().isEmpty(),
        check("phone", "Phone number is Required").isLength({min:10}),
        check("email", "Email is Required").isEmail(),
        check("dob", "Date of Birth is Required").not().isEmpty(),
    ],auth, async(req, res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array());
            return res.status(400).json({errors: errors.array()});
        }

        let {firstName, lastName, phone, email, dob, preferences} = req.body;

        const existUser = await User.findOne({
            where: {
                email: email,
            },
        });
        

        try {

            const newUser = await existUser.update({
                firstName,
                lastName,
                phone,
                email,
                dob,
                preferences
            });
            await res.status(200).json(`User Updated`);
        } catch (error) {
            console.log(error.message);
            await res.status(500).send("Error Updating User");
        }

    });

    //Create User
//Authentication
//Users/getUser

router.get("/getUser", auth, async(req, res)=>{
    try {
        const existUser = await User.findOne({
            where: {
                id: req.user.id,
            },
        });
        res.status(200).json(existUser);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
    
});



module.exports = router;