"use strict";
const db = require("../models/index"),
    Register = db.registerTBL,
    Page = db.pageTBL,
    User = db.userTBL;

function getRegisterParams(body) {
    return {
        pageUrl: body.url,
        key1: body.key1,
        key2: body.key2,
        key3: body.key3,
        notifyLogic: body.condition,
        siteName: body.siteName,
        dueDate: body.deadline, // temporary로 두셨던 부분
        userId: "minjin11"  // temporary
    };
};

module.exports = {
    manage: async (req, res, next) => {
        try{
            let registrations = await Register.findAll();
            res.locals.registrations = registrations;
            next();
        }catch(error){
            console.log(`Error fetching register: ${error.message}`);
            next(error);
        };
    },
    manageView: async(req, res) => { 
        if(req.session.is_logined){
            res.render("registerManagement");
        }
        else{
            res.render("logIn_main");
        }
    },
    new: (req, res) => {  // 
        if(req.session.is_logined){
            res.render("registerNew");
        }
        else{
            res.render("logIn_main");
        }
    },

    create: async(req, res, next) =>{
        let registerParams = getRegisterParams(req.body);
        try{
            let page = await Page.create({url: registerParams["pageUrl"]});
            let register = await Register.create(registerParams);
            res.locals.redirect = "/registerManagement";
            res.locals.page = page; 
            res.locals.register = register;
            next();
        }catch(error){
            console.log(`Error fetching register: ${error.message}`);
            next(error);
        };
    },

    redirectView: (reg, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath !== undefined){
            res.redirect(redirectPath);
        }
        else {
            next();
        }
    },
    
    show: async(req, res, next) => {
        try{
            if(req.session.is_logined){
                let userId = req.session.userId;
                Register.findAll({
                where: {userId : userId}
            }).then((registrations) => {
                    res.render("registerManagement",{registrations});
                })
            // Register.findOne(userid).then((registrations) => {
            //     res.render("registerManagement",{registrations});
            // })
            }
            else{
                res.render("logIn_main");
            }

        } catch(error){
            console.log(`Error fetching register: ${error.message}`);
            next(error);
        };
    },
    showView: async(req,res) =>{
        // let registerId = req.params.id;
        // let register = await Register.findByPk(registerId)
        // res.render("registerNew", {register: register});
        res.render("registerManagement");
    },
    edit: async (req, res, next) =>{
        try{
            let registerId = req.params.registerId;
            let register = await Register.findByPk(registerId);
            res.render("registerEdit",{
                register: register
            });
        } catch(error){
            console.log(`Error fetching register: ${error.message}`);
            next(error);
        };
    },
    update: async(req, res, next) => {
        let registerId = req.params.id,
        registerParams = getRegisterParams(req.body);
        console.log(registerParams);
        try{
            let register = await Register.findByPkAndUpdate(registerId, registerParams);
            // res.locals.redirect = `/registerEdit/${registerId}`;
            res.locals.register = register;
            res.locals.redirect = "/registerManagement";
            next();
        }catch(error){
            console.log(`Error updating register by ID: ${error.message}`);
            next(error);
        };
    },
    delete: async(req, res, next) => {
        let registerId = req.params.registerId;
        try{
            let register = await Register.findByPkAndRemove(registerId);
            res.locals.redirect = "/registerManagement"; // 확인
            res.locals.register = register;
            next();
        }catch(error){
            console.log(`Error deleting register by ID: ${error.message}`);
            next(error);
        };
    }
};