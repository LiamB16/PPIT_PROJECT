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

//gets user login page
app.get('/UserMenu', (req, res)=>{
  MySqlDAO.UpdatePlanTables()
  MySqlDAO.Currentlogin2()
  .then((data) => {
      console.log(data)
      res.render("UserMenu", {Users:data} )
      
  })
  .catch((error) => {
    console.log("not ok")
   res.send(error)
  })
})

//logins to current account
app.post('/Login', (req, res) => {
    //resets the current user logged in
    MySqlDAO.logout()
    //gets login of user
    MySqlDAO.getUser(req.body.User, req.body.Password)
    //makes a log for who is currently logged in and tracks data changes
    MySqlDAO.currentlogin(req.body.User)
        .then((data) => {
            console.log(data)
            res.redirect("/UserMenu")
          
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
  app.post('/CreateUser', (req, res) => {
    MySqlDAO.addUser(req.body.User, req.body.Password)
    .then(() => {
        res.redirect('/')
    })
    .catch((error) => {
        res.send(error)
        console.log(error)
    })
  
  })
    //views workout plan based on ID number
    app.get('/ViewPlan/:IDno', (req, res)=>{
      MySqlDAO.Currentlogin2()
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
      MySqlDAO.Currentlogin2()
      MySqlDAO.ViewDays(req.params.IDno)
     
      .then((result) => {
          console.log(result)
          
           //loads last weeks and this weeks days worked out
           res.render("ViewDays", {day:result})
      })
      .catch((error) => {
          res.send(error)
      })
    })
     //adds diet to users account based on id number and food name
     app.get('/newDays', (req, res)=>{
      MySqlDAO.newDays()
      MySqlDAO.newDays2()
      .then((result) => {
          console.log(result)
          MySqlDAO.UpdatePlanTables()
          res.redirect("/UserMenu")
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })
    //brings user to register page
     app.get('/SetCurrentDays', (req, res)=>{
      MySqlDAO.Currentlogin2()
  .then((data) => {
      console.log(data)
      res.render("SetCurrentDays", {Users:data} )
    })
  .catch((error) => {
      res.send(error)
  })
})

     //sets the days user worked out this week
     app.post('/SetCurrentDays/:IDno', (req, res)=>{
      MySqlDAO.SetCurDay(req.body.Monday, req.body.Tuesday, req.body.Wednesday, req.body.Thursday, req.body.Friday, req.body.Saturday, req.body.Sunday)
      MySqlDAO.SetCurDay2()
      MySqlDAO.SetCurDay3()
      .then((result) => {
          console.log(result)
            //once days are set, returns to days page
            MySqlDAO.UpdatePlanTables()
          res.redirect("/UserMenu")
      })
      .catch((error) => {
          res.send(error)
      })
    })

    //resets current week days
    app.get('/ResetDay/:IDno', (req, res)=>{
      MySqlDAO.ResetDay(req.params.IDno)
      MySqlDAO.ResetDay2(req.params.IDno)
      MySqlDAO.ResetDay3(req.params.IDno)
      .then(() => {
        //once days are reset, returns to main menu page
         res.redirect("/UserMenu")
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
    app.get('/ViewAllDiets/:food', (req, res)=>{
      MySqlDAO.addDiet(req.params.food)
      .then((result) => {
          console.log(result)
          MySqlDAO.UpdatePlanTables()
          res.redirect("/UserMenu")
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })
    //loads page for creating the workout plan
    app.get('/CreatePlan', (req, res)=>{
      MySqlDAO.AllExercise()
      .then((result) => {
          console.log(result)
          MySqlDAO.UpdatePlanTables()
           res.render("CreatePlan", {workout: result})
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })

    //searches workout programmes based on gender, body type and body parts
    app.post('/CreatePlan', (req, res)=>{
      MySqlDAO.SearchExercise(req.body.bodyType, req.body.BodyPart, req.body.gender)
      .then((result) => {
          console.log(result)
          MySqlDAO.UpdatePlanTables()
           res.render("CreatePlan2", {workout: result})
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })
    
     //adds exercise to workout plan based on 
     app.get('/addExercise/:exercise', (req, res)=>{
      MySqlDAO.addExercise(req.params.exercise)
      MySqlDAO.addExercise2()
      .then((result) => {
          console.log(result)
          MySqlDAO.UpdatePlanTables()
          res.redirect("/UserMenu")
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })

     //deletes a diet from user diet plan based on food name and id number
     app.get('/deleteDiet/:Myfood', (req, res)=>{
      MySqlDAO.deleteDiet(req.params.Myfood)
      .then((result) => {
          console.log(result)
          res.redirect("/UserMenu")
      })
      .catch((error) => {
          res.send(error)
          console.log(error)
      })
    })

      //deletes a diet from user diet plan based on food name and id number
      app.get('/deletePlan/:My_exercise/:IDno', (req, res)=>{
        MySqlDAO.deletePlan(req.params.My_exercise, req.params.IDno)
        .then((result) => {
            console.log(result)
            res.redirect("/userMenu")
        })
        .catch((error) => {
            res.send(error)
            console.log(error)
        })
      })
       //deletes a diet from user diet plan based on food name and id number
       app.get('/logout', (req, res)=>{
        MySqlDAO.logout()
        .then((result) => {
            console.log(result)
            res.redirect("/login")
        })
        .catch((error) => {
            res.send(error)
            console.log(error)
        })
      })
  app.listen(3004, () => {
    console.log("Listening on port 3004...")
})