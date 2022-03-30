var mysql = require('promise-mysql')

//connects to sql server
var pool =
mysql.createPool({
    connectionLimit : 3,
    host : 'localhost',
    user : 'root',
    password : '',
    database : 'fitnessdb' //database for the project
    })
    .then(data => {
    pool = data
    console.log("database connected")
    })
    .catch(e => {
    console.log("pool error:" + e)
    
    })

    //logins to user account
    function getUser(User, Password) {
        return new Promise((resolve, reject)=>{ 
            var MyQuery = {
                sql: `select * from users where username = '${User}' and password = AES_ENCRYPT('${Password}', 'KEY')`,
            }
            pool.query(MyQuery)
            .then((data)=> {
                resolve(data)
            })
            .catch((error)=> {
               reject(error)
            })
        });
    }
    //registers new user
    function addUser(User, Password){
        return new Promise((resolve, reject)=>{
            var MyQuery = {
                sql: (`INSERT INTO Users (username, password) VALUES  ( '${User}', AES_ENCRYPT('${Password}' , 'KEY'))`)
            }
            pool.query(MyQuery)
            .then((data)=> {
                resolve(data)
            })
            .catch((error)=> {
                reject(error)
            })
        })
    }

    //adds diet to user diet plan
    function addDiet(food, IDno) {
        return new Promise((resolve, reject)=>{
            var MyQuery = {
            //copies and paste from diet to dietplan
            sql: (`INSERT INTO DietPlan (Myfood_type, Myfood, bodyType) select food_type, food, bodyType from Diet where food = '${food}';`),
            //sets ID number to User ID because the copied data has a null ID number
            sql: (`update DietPlan set IDno = '${IDno}' where IDno is null;`)
            }
            pool.query(MyQuery)
            .then((data)=> {
               resolve(data)
            })
            .catch((error)=> {
               reject(error)
            })
        });
    }
       //gets all available diets  
       function showAllDiet() {
        return new Promise((resolve, reject)=>{
            var MyQuery = {
            sql: (`select * from Diet`),
            }
            pool.query(MyQuery)
            .then((data)=> {
               resolve(data)
            })
            .catch((error)=> {
               reject(error)
            })
        });
    }
    //deletes diet from user diet plan
    function deleteDiet(Myfood, IDno) {
        return new Promise((resolve, reject)=>{
            var MyQuery = {
            sql: (`Delete from DietPlan where Myfood = '${Myfood}' and IDno = ${IDno};`),
            }
            pool.query(MyQuery)
            .then((data)=> {
               resolve(data)
            })
            .catch((error)=> {
               reject(error)
            })
        });
    }
    
    //view the training plan of the user 
    function ViewPlan(IDno) {
        return new Promise((resolve, reject)=>{
            var MyQuery = {
            sql: ("select * from TrainingPlan where IDno = ?"),
            values: [IDno]
            }
            pool.query(MyQuery)
            .then((data)=> {
               resolve(data)
            })
            .catch((error)=> {
               reject(error)
            })
        });
    }
    //view the days worked out this week and last week  
    function ViewDays(IDno) {
        return new Promise((resolve, reject)=>{
            var MyQuery = {
            //uses inner join function to join days and PrevDay table based on user ID
            sql: (" select * from days e inner join Prevdays f on e.IDno = f.IDno where e.IDno = ?;"),
            values: [IDno]
            }
            pool.query(MyQuery)
            .then((data)=> {
               resolve(data)
            })
            .catch((error)=> {
               reject(error)
            })
        });
    }
    //view the diet plan of the user 
    function ViewDiet(IDno) {
            return new Promise((resolve, reject)=>{
                var MyQuery = {
                sql: ("select * from DietPlan where IDno = ?"),
                values: [IDno]
                }
                pool.query(MyQuery)
                .then((data)=> {
                   resolve(data)
                })
                .catch((error)=> {
                   reject(error)
                })
            });
    }
    //resets the days for a new week and puts this weeks data to last weeks
    function ResetDay(IDno){
        return new Promise((resolve, reject)=>{
            var MyQuery = {
                //delete the data from last weeks table
                sql: (`delete from PrevDays where IDno = ${IDno};`),
                //copies and pastes the data from this weeks data to last weeks
                sql:(`insert into PrevDays select * from Days where IDno = ${IDno};`),
                //sets this week day to none so the user can start a new week and keep track of the days worked out
                sql:(`update days set Monday = 'none', Tuesday = 'none', Wednesday = 'none', Thursday = 'none', Friday = 'none', Saturday = 'none', Sunday = 'none' where IDno = ${IDno};`)
            }   
            pool.query(MyQuery)
            .then((data)=> {
                resolve(data)
            })
            .catch((error)=> {               
                reject(error)
            })
        })
    }    
    //searches exercise based on body type, body part and gender
    function SearchExercise(bodyType, BodyPart, gender){
        return new Promise((resolve, reject)=>{
            var MyQuery = {
                sql: (`select * from Exercise where bodyType = '${bodyType}' and  BodyPart = '${BodyPart}' and gender_preference = '${gender}'`)
            }
            pool.query(MyQuery)
            .then((data)=> {
                console.log("found")
                resolve(data)
            })
            .catch((error)=> {  
                console.log('not found')             
                reject(error)
            })
        })
    } 
    //adds exercise to training plan
    function addExercise(exercise, IDno){
        return new Promise((resolve, reject)=>{
            var MyQuery = {
                //copies and pastes from Exercise table to TrainingPlan table
                sql: (`insert into TrainingPlan (My_bodyType, My_BodyPart, My_exercise, My_reps, My_sets, My_equipment) select bodyType, BodyPart, exercise, reps, _sets, equipment from Exercise where exercise = '${exercise}';`),
                //adds user ID to new training plan
                sql: (`update TrainingPlan set IDno = '${IDno}' where IDno is null;`)
            }
            pool.query(MyQuery)
            .then((data)=> {
                resolve(data)
            })
            .catch((error)=> {               
                reject(error)
            })
        })
    } 
    module.exports = {getUser, addDiet, showAllDiet, deleteDiet, ViewPlan, addUser, ViewDays, ViewDiet, ResetDay, SearchExercise, addExercise}
