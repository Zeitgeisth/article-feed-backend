const express = require('express');
const Article = require('../models/article');
const Writes = require('../models/writes');
const User = require('../models/user');
const {check, validationResult} = require('express-validator');
const router = express.Router();
const auth = require('../middlewares/auth');
const fileUpload = require('express-fileupload')
const {Sequelize, DataTypes} = require('sequelize');
const Op = Sequelize.Op;

//Create Article
//Authentication
//Article/createArticle

router.post("/createArticle",
    [
        check("headlines", "Headline is Required").not().isEmpty(),
        check("text", "text is Required").not().isEmpty(),
        check("category", "Category is Required").not().isEmpty(),
    ], auth, async(req, res)=>{
        console.log(req.body);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            console.log(errors.array());
            return res.status(400).json({errors: errors.array()});
        }
        console.log(req.user.id);
        const file = req.files.file;

        file.mv(`${__dirname}/client/public/uploads/${file.name}`, err=>{
            if(err) console.log(err);
        })

        let {headlines, text, category} = req.body;
        
        try {

            const newArticle = await Article.create({
                headlines,
                images:`${file.name}`,
                text,
                category
            });
            

            const newWrites = await Writes.create({
                userId: req.user.id,
                articleId: newArticle.id
            });

            if(!newWrites) console.log(newWrites);

            await res.status(200).json(`Article created `);

        } catch (error) {
            console.log(error.message);
            await res.status(500).send("Error Creating Article");
        }

    });


    //Edit Article
//Authentication
//Article/editArticle

router.post("/editArticle",
[
    check("headlines", "Headline is Required").not().isEmpty(),
    check("text", "text is Required").not().isEmpty(),
    check("category", "Category is Required").not().isEmpty(),
], auth, async(req, res)=>{
    console.log(req.body);
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors.array());
        return res.status(400).json({errors: errors.array()});
    }

    try {
        const file = req.files.file;

        file.mv(`${__dirname}/client/public/uploads/${file.name}`, err=>{
            if(err) console.log(err);
        })
    
    } catch (error) {
        console.log(error);
    }
    
    

    let {id, headlines, text, category, fileName} = req.body;
    console.log(id)
    const existArticle = await Article.findOne({
        where: {
            id: id,
        },
    });
    
    try {

        const newArticle = await existArticle.update({
            headlines,
            images:`${fileName}`,
            text,
            category
        });
    

        await res.status(200).json(`Article Updated `);

    } catch (error) {
        console.log(error.message);
        await res.status(500).send("Error Updating Article");
    }

});



//Get Article
//Authentication
//Article/getAllArticle
router.get("/getAllArticle", auth, async(req, res)=>{
    try {
            const existUser = await User.findOne({
                where: {
                    id: req.user.id,
                },
            });

            console.log(existUser);

        const articles = await Article.findAll({
            where:{
                category: {
                    [Op.or]: existUser.preferences
                }
            }
        });
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
    
});


//Get User Article
//Authentication
//Article/getUserArticle

router.get("/getUserArticle", auth, async(req, res)=>{
    try {
            const writesV = await Writes.findAll({
                attributes: ['articleId'],
                where: {
                    userId: req.user.id,
                },
            });

            const array = [];
            writesV.forEach((v)=>{
                array.push(v.dataValues.articleId);
            })

            console.log(array);

            const articles = await Article.findAll({
                where:{
                    id: array
                }
            });
            {/*const array = [];
            const a = [];

            writesV.forEach((v)=>{
                array.push(v.dataValues);
            })

            array.forEach((e)=>{
                a.push(articleId);
            })

            console.log(a);

        const articles = await Article.findAll({
            where:{
                id: writesV
            }
        });*/}
        
        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json(error);
        console.log(error);
    }
    
});


//Delete User Article
//Authentication
//Article/deleteArticle

    router.delete('/deleteArticle', async(req, res)=>{
        console.log(req.body);
        const {bid} = req.body;
        try {
            const article = await Article.destroy({
                where:{
                    id:  bid
                }
            })   

            res.status(200).json('Deleted');

            const writes = await Writes.destroy({
                where:{
                    articleId: bid
                }
            })
            
        } catch (error) {
            res.status(500).json('Error');
            console.log(error);
        }
    })


    module.exports = router;