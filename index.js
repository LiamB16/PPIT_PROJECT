var express = require('express')
var MySqlDAO = require("./MySqlDao") //access SQL functions 
var app = express()
var ejs = require('ejs')
var bodyParser = require('body-parser')
const cors = require('cors') //allows cross platform communication between client and server

var app = express()

app.use(bodyParser.urlencoded({extended:false}))
app.use(cors())

app.set('view engine', 'ejs')

//renders login and register page on load
app.get('/', (req, res)=> {
  res.render('MainMenu')
})
//gets user login page
app.get('/Login', (req, res)=>{
  res.render("Login")
})
  //logins to current account
app.get('/Login/:User/:Password', (req, res) => {
    MySqlDAO.getUser(req.params.User, req.params.Password)
        .then((data) => {
         if(data)
          {
            console.log("logged in")
            res.render("UserMenu")
          } 
        })
        .catch((error) => {
          console.log("not ok")
         res.send(error)
        })
  })
  //brings user to register page
app.get('/CreateUser', (req, res)=>{
    res.render("CreateUser")
  })
  //adds new user
  app.get('/CreateUser/:User/:Password', (req, res) => {
    MySqlDAO.addUser(req.params.User, req.params.Password)
    .then(() => {
        res.redirect('/')
        console.log("add")
    })
    .catch((error) => {
        res.send(error)
        console.log(error)
    })
  
  })
//brings user to register page
app.get('/UserMenu', (req, res)=>{
  res.render("UserMenu")
})
    //views workout plan based on ID number
    app.get('/ViewPlan/:IDno', (req, res)=>{
      MySqlDAO.ViewPlan(req.params.IDno)
      .then((result) => {
          console.log("ok")
           res.render("ViewPlan", {workout:result})
      })
      .catch((error) => {
          res.send(error)
      })
    })

    //views user diet based on IDno
    app.get('/ViewDiet/:IDno', (req, res)=>{
      MySqlDAO.ViewDiet(req.params.IDno)
      .then((result) => {
          console.log("ok")
          //loads user diet
           res.render("ViewDiet", {diet:result})
      })
      .catch((error) => {
          res.send(error)
      })
    })

    //views days user worked out
    app.get('/ViewDays/:IDno', (req, res)=>{
      MySqlDAO.ViewDays(req.params.IDno)
      .then((result) => {
          console.log("ok")
           //loads last weeks and this weeks days worked out
           res.render("ViewDays", {day:result})
      })
      .catch((error) => {
          res.send(error)
      })
    })

    //resets current week days
    app.get('/ResetDay/:IDno', (req, res)=>{
      MySqlDAO.ResetDay(req.params.IDno)
      .then(() => {
        //once days are reset, returns to days page
         res.redirect("/ViewDays/:IDno")
      })
      .catch((error) => {
        console.log(error)
          res.send(error)
      })
    })
  //views all available diets for the user to chose from
    app.get('/ViewAllDiets', (req, res)=>{
      MySqlDAO.showAllDiet()
      .then((result) => {
          console.log("ok")
          //outputs all results from diet table
           res.render("ViewAllDiets", {Diet: result})
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })
    //adds diet to users account based on id number and food name
    app.get('/ViewAllDiets/:food/:IDno', (req, res)=>{
      MySqlDAO.addDiet(req.params.food, req.params.IDno)
      .then((result) => {
          console.log("ok")
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })
    //loads page for creating the workout plan
    app.get('/CreatePlan', (req, res)=>{
      res.render("CreatePlan")
    })

    //searches workout programmes based on gender, body type and body parts
    app.get('/CreatePlan/:bodyType/:BodyPart/:gender', (req, res)=>{
      MySqlDAO.SearchExercise(req.params.bodyType, req.params.BodyPart, req.params.gender)
      .then((result) => {
          console.log("ok")
           res.render("CreatePlan2", {workout: result})
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })
    
     //adds exercise to workout plan based on 
     app.get('/addExercise/:exercise/:IDno', (req, res)=>{
      MySqlDAO.addExercise(req.params.exercise, req.params.IDno)
      .then((result) => {
          console.log(result)
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })

     //deletes a diet from user diet plan based on food name and id number
     app.get('/deleteDiet/:Myfood/:IDno', (req, res)=>{
      MySqlDAO.deleteDiet(req.params.Myfood, req.params.IDno)
      .then((result) => {
          console.log(result)
          res.redirect("/ViewDiet/:IDno")
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })
  app.listen(3004, () => {
    console.log("Listening on port 3004...")
})