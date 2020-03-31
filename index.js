let Joi = require('@hapi/joi');
let db = require('./db');
let db_custom = require('./db_custom');
let express = require('express');
let cors = require('cors');
let app = express();

let isEmpty=(obj)=>{
    for(var key in obj){
        if(obj.hasOwnProperty(key))
        return false;
    }
        return true;
}
app.use(cors());
app.use(express.json()); //รูปแบบ json ว่ามีไหม ถ้ามีไปใส่ body
app.use(express.urlencoded({ extended: true })); //จัดฟอร์มใช้ได้ง่าย web form ไปใส่ body

app.use((req,res,next)=>{  //middleware next เสร็จแล้วไปต่อ
console.log(new Date());
//res.status(402);
next();
})


app.get('/',(request,respond)=>{
   // respond.send('สวัสดี');
   // respond.send('สวัสดี'+ request.query.name);
   let text = "path table user \n /users  \n /users/username/:User_Name  \n/users/add  \n/users/update \nEX.http://180.180.241.92:3000/users/username/winai (:User_Name=ชื่อ) \n\n path table profile \n/profiles \n/profiles/username/:User_Name  \n/profiles/update/ \n/profiles/add \n\npath table address \n/addresses \n/addresses/username/:User_Name  \n/addresses/add  \n/addresses/update \n\n path table activity \n/activities \n/activities/username/:User_Name   \n/activities/add "
  
    respond.send(text);
});

app.get('/login',(request,respond)=>{

    respond.send('หน้า login');
});
 


app.get('/employees',async(req, res) => {
    let sql ="SELECT * FROM Employee "; //เลือกหมดเลยใน database
    let pool =await db;
    let item  = await pool.query(sql);
    console.log(item);
    pool.query(sql);
    // let result =[{first_name:'Wett',last_name:'kaew'},{first_name:'watt',last_name:'tr'},]
    // res.json(result);
    res.json(item);
});
app.get('/users',async(req, res) => { //อ่านข้อมูล database user
    let sql ="SELECT * FROM user"; //เลือกหมดเลยใน database
    let pool =await db_custom;
    //res.json('สวัสดี');
    let item  = await pool.query(sql);
     console.log(item);
    pool.query(sql);
    // let result =[{first_name:'Wett',last_name:'kaew'},{first_name:'watt',last_name:'tr'},]
    // res.json(result);
    res.json(item);
});
app.get('/users/username/:User_Name',async(req, res) => {
    let sql ='SELECT * FROM user Where User_Name = ?'; 
    let pool =await db_custom;
    let name = req.params.User_Name;
    let item  = await pool.query(sql,[name]);
    console.log(item)
   console.log(req.params)//check username
    res.json(item);
});
app.post('/users/add',async(req, res) => {  //url for regist login page
   
    let checker = Joi.object({
        User_Name :Joi.string().min(1).max(50).required(),//required คือ จำเป็น เช็คค่าที่ส่งไป server
        User_Password :Joi.string().min(1).max(100).required(),
        Name:Joi.string(),
        Surname:Joi.string(),
        IDNum:Joi.string(),
        Email : Joi.string().email().required(),
        Picture : Joi.string(),
        Gender:Joi.string(),
        Team:Joi.string(),
        Tel:Joi.number()
        
    });

    let checkresult=checker.validate(req.body);
    console.log(checkresult)
    if(checkresult.error){
        res.status(400).send('bad request');
    }

 if(isEmpty(req.body)){
res.status(400).send('no value in request');
   }

   let newUser =req.body; // user ใหม่
   console.log(newUser);
   let newUsername=req.body.User_Name;
   console.log(newUsername);
   
   let sqlUsername = 'SELECT * FROM user Where User_Name =? ';
   let pool = await db_custom;
   let UserDb = await pool.query(sqlUsername,[newUsername]); //from database
   console.log(UserDb) //check username
      
   if (UserDb.length > 0) {  //length for select, affectedRows for update ,delete
        console.log('Username not available');
    res.json('Username not available');  
   } 
   else {
    let sql ='INSERT INTO user (User_Name,User_Password,Name,Surname,IDNum,Email,Picture,Gender,Team,Tel ) values (?,?,?,?,?,?,?,?,?,?) ';
    let result =await pool.query(sql,[newUser.User_Name,newUser.User_Password,newUser.Name,newUser.Surname,newUser.IDNum,newUser.Email,newUser.Picture,newUser.Gender,newUser.Team,newUser.Tel]);
    
    console.log(result);
    //console.log(result.affectedRows);
    if(result.affectedRows > 0){
                 res.json({success:true})
             }
           else{
                res.json({success:false})
            }
}
});
app.post('/users/update',async(req, res) => {  
   
    let checker = Joi.object({
        User_Name :Joi.string().min(1).max(50).required(),//required คือ จำเป็น เช็คค่าที่ส่งไป server
        User_Password :Joi.string().min(1).max(100).required(),
        Name:Joi.string().min(1).max(50).required(),
        Surname:Joi.string().min(1).max(50).required(),
        IDNum:Joi.string(),
        Email : Joi.string().email().required(),
        Picture : Joi.string(),
        Gender:Joi.string(),
        Team:Joi.string(),
        Tel:Joi.number()
        
    });

    let checkresult=checker.validate(req.body);
    console.log(checkresult)
    if(checkresult.error){
        res.status(400).send('bad request');
    }

 if(isEmpty(req.body)){
res.status(400).send('no value in request');
   }

   let newUser =req.body; // user ใหม่
   console.log(newUser);
   let newUsername=req.body.User_Name;
   console.log(newUsername);
   
   let pool = await db_custom;
   
   let sql ='UPDATE  user SET User_Password=?,Name=?,Surname=?,IDNum=?,Email=?,Picture=?,Gender=?,Team=?,Tel=? WHERE User_Name =?';
   let result =await pool.query(sql,[newUser.User_Password,newUser.Name,newUser.Surname,newUser.IDNum,newUser.Email,newUser.Picture,newUser.Gender,newUser.Team,newUser.Tel,newUser.User_Name]);
    
    console.log(result);
    //console.log(result.affectedRows);
    if(result.changedRows > 0){
                 res.json('update success')
             }
           else{
                res.json('not update')
            }

});


app.get('/profiles',async(req, res) => { //อ่านข้อมูล database profile
    let sql ="SELECT * FROM profile "; //เลือกหมดเลยใน database
    let pool =await db_custom;
   
    let item  = await pool.query(sql);
     console.log(item);
    pool.query(sql);
    // let result =[{first_name:'Wett',last_name:'kaew'},{first_name:'watt',last_name:'tr'},]
    // res.json(result);
    res.json(item);
});
app.get('/profiles/username/:User_Name',async(req, res) => {
    let sql ='SELECT * FROM user as a LEFT JOIN profile as b ON a.User_Name = b.User_Name WHERE a.User_Name = ?'; 
    let pool =await db_custom;
    let name = req.params.User_Name;
    let item  = await pool.query(sql,[name]);
    console.log(item)
   console.log(req.params)//check username
    res.json(item);
});
app.post('/profiles/add',async(req, res) => {  //url for add address
   
    let checker = Joi.object({
        User_Name :Joi.string().min(1).max(50).required(),//required คือ จำเป็น เช็คค่าที่ส่งไป server
        Pro_Height:Joi.number(),
        Pro_Weight:Joi.number(),
        Pro_KM_Run:Joi.number(),
        Pro_KM_Cycle:Joi.number(),
        Pro_km_RunTeam : Joi.number(),
        Pro_km_CycleTeam : Joi.number(),
        
    });

    let checkresult=checker.validate(req.body);
    console.log(checkresult)
    if(checkresult.error){
        res.status(400).send('bad request');
    }

 if(isEmpty(req.body)){
res.status(400).send('no value in request');
   }

    let newPro =req.body; // user ใหม่
    console.log(newPro);
//    let newUsername=req.body.User_Name;
//    console.log(newUsername);
   
   let pool = await db_custom;
   
    let sql ='INSERT INTO profile (User_Name,Pro_Height,Pro_Weight,Pro_KM_Run,Pro_KM_Cycle,Pro_km_RunTeam,Pro_km_CycleTeam ) values (?,?,?,?,?,?,?)';
    let result =await pool.query(sql,[newPro.User_Name,newPro.Pro_Height,newPro.Pro_Weight,newPro.Pro_KM_Run,newPro.Pro_km_Cycle,newPro.Pro_km_RunTeam,newPro.Pro_km_CycleTeam]);
    console.log(result);
    //console.log(result.affectedRows);
    if(result.affectedRows > 0){
                 res.json({success:true})
             }
           else{
                res.json({success:false})
            }

      
});
app.post('/profiles/update',async(req, res) => {  
   
    let checker = Joi.object({
        User_Name :Joi.string().min(1).max(50).required(),//required คือ จำเป็น เช็คค่าที่ส่งไป server
        Pro_Height :Joi.number(),
        Pro_Weight:Joi.number(),
        Pro_KM_Run:Joi.number(),
        Pro_KM_Cycle:Joi.number(),
        Pro_km_RunTeam : Joi.number(),
        Pro_km_CycleTeam: Joi.number(),
                
    });

    let checkresult=checker.validate(req.body);
    console.log(checkresult)
    if(checkresult.error){
        res.status(400).send('bad request');
    }

 if(isEmpty(req.body)){
res.status(400).send('no value in request');
   }

   let newPro =req.body; // user ใหม่
   console.log(newPro);
   let newUsername=req.body.User_Name;
   console.log(newUsername);
   
   let pool = await db_custom;
   
   let sql ='UPDATE  profile SET Pro_Height=?,Pro_Weight=?,Pro_KM_Run=?,Pro_KM_Cycle=?,Pro_km_RunTeam=?,Pro_km_CycleTeam=? WHERE User_Name =?';
   let result =await pool.query(sql,[newPro.Pro_Height,newPro.Pro_Weight,newPro.Pro_KM_Run,newPro.Pro_KM_Cycle,newPro.Pro_km_RunTeam,newPro.Pro_km_CycleTeam,newPro.User_Name]);
    
    console.log(result);
    //console.log(result.affectedRows);
    if(result.changedRows > 0){
                 res.json('update success')
             }
           else{
                res.json('not update')
            }

});




app.get('/addresses',async(req, res) => { //อ่านข้อมูล database address
    let sql ="SELECT * FROM address "; //เลือกหมดเลยใน database
    let pool =await db_custom;
   
    let item  = await pool.query(sql);
     console.log(item);
    pool.query(sql);
    // let result =[{first_name:'Wett',last_name:'kaew'},{first_name:'watt',last_name:'tr'},]
    // res.json(result);
    res.json(item);
});
app.get('/addresses/username/:User_Name',async(req, res) => {
    let sql ='SELECT * FROM address Where User_Name = ?'; 
    let pool =await db_custom;
    let name = req.params.User_Name;
    let item  = await pool.query(sql,[name]);
    console.log(item)
   console.log(req.params)//check username
    res.json(item);
});
app.post('/addresses/add',async(req, res) => {  //url for add address
   
    let checker = Joi.object({
        User_Name :Joi.string().min(1).max(50).required(),//required คือ จำเป็น เช็คค่าที่ส่งไป server
        Add_HomeNum :Joi.string().min(1).max(100),
        Add_Village:Joi.string(),
        Add_Moo:Joi.number(),
        Add_SubDis:Joi.string(),
        Add_District : Joi.string(),
        Add_Province : Joi.string(),
        Add_Post:Joi.number(),
        Add_Floor:Joi.string(),
        Add_Room:Joi.string(),
        Add_Building:Joi.string()
        
    });

    let checkresult=checker.validate(req.body);
    console.log(checkresult)
    if(checkresult.error){
        res.status(400).send('bad request');
    }

 if(isEmpty(req.body)){
res.status(400).send('no value in request');
   }

    let newAdd =req.body; // user ใหม่
    console.log(newAdd);
//    let newUsername=req.body.User_Name;
//    console.log(newUsername);
   
//    let sqlUsername = 'SELECT * FROM address Where User_Name =? ';
   let pool = await db_custom;
//    let UserDb = await pool.query(sqlUsername,[newUsername]); //from database
//    console.log(UserDb) //check username
   
    let sql ='INSERT INTO address (User_Name,Add_HomeNum,Add_Village,Add_Moo,Add_SubDis,Add_District,Add_Province,Add_Post,Add_Floor,Add_Room,Add_Building ) values (?,?,?,?,?,?,?,?,?,?,?)';
    let result =await pool.query(sql,[newAdd.User_Name,newAdd.Add_HomeNum,newAdd.Add_Village,newAdd.Add_Moo,newAdd.Add_SubDis,newAdd.Add_District,newAdd.Add_Province,newAdd.Add_Post,newAdd.Add_Floor,newAdd.Add_Room,newAdd.Add_Building]);
    console.log(result);
    //console.log(result.affectedRows);
    if(result.affectedRows > 0){
                 res.json({success:true})
             }
           else{
                res.json({success:false})
            }

      
});
app.post('/addresses/update',async(req, res) => {  
   
    let checker = Joi.object({
        User_Name :Joi.string().min(1).max(50).required(),//required คือ จำเป็น เช็คค่าที่ส่งไป server
        Add_HomeNum :Joi.string().min(1).max(100),
        Add_Village:Joi.string(),
        Add_Moo:Joi.number(),
        Add_SubDis:Joi.string(),
        Add_District : Joi.string(),
        Add_Province : Joi.string(),
        Add_Post:Joi.number(),
        Add_Floor:Joi.string(),
        Add_Room:Joi.string(),
        Add_Building:Joi.string()
                
    });

    let checkresult=checker.validate(req.body);
    console.log(checkresult)
    if(checkresult.error){
        res.status(400).send('bad request');
    }

 if(isEmpty(req.body)){
res.status(400).send('no value in request');
   }

   let newAdd =req.body; // user ใหม่
   console.log(newAdd);
   let newUsername=req.body.User_Name;
   console.log(newUsername);
   
   let pool = await db_custom;
   
   let sql ='UPDATE  profile SET Add_HomeNum =?,Add_Village=?,Add_Moo=?,Add_SubDis=?,Add_District =?,Add_Province=?,Add_Post=?,Add_Floor=?,Add_Room=?,Add_Building=? WHERE User_Name =?';
   let result =await pool.query(sql,[newAdd.Add_HomeNum,newAdd.Add_Village,newAdd.Add_Moo,newAdd.Add_SubDis,newAdd.Add_District,newAdd.Add_Province,newAdd.Add_Post,newAdd.Add_Floor,newAdd.Add_Room,newAdd.Add_Building,newAdd.User_Name]);
    
    console.log(result);
    //console.log(result.affectedRows);
    if(result.changedRows > 0){
                 res.json('update success')
             }
           else{
                res.json('not update')
            }

});



app.get('/activities',async(req, res) => { //อ่านข้อมูล database address
    let sql ="SELECT * FROM activity "; //เลือกหมดเลยใน database
    let pool =await db_custom;
   
    let item  = await pool.query(sql);
     console.log(item);
    pool.query(sql);
    // let result =[{first_name:'Wett',last_name:'kaew'},{first_name:'watt',last_name:'tr'},]
    // res.json(result);
    res.json(item);
});
app.get('/activities/username/:User_Name',async(req, res) => {
    let sql ='SELECT * FROM activity Where User_Name = ?'; 
    let pool =await db_custom;
    let name = req.params.User_Name;
    let item  = await pool.query(sql,[name]);
    console.log(item)
   console.log(req.params)//check username
    res.json(item);
});
app.post('/activities/add',async(req, res) => {
    // app.disable('etag');
    let checker = Joi.object({
        User_Name :Joi.string().min(1).max(50).required(),//required คือ จำเป็น เช็คค่าที่ส่งไป server
        Act_WalkRun:Joi.number(),
        Act_Cycling:Joi.number(),
        Act_Start:Joi.any(),
        Act_Stop: Joi.any(),
        Act_Distance: Joi.number(),
        Act_Time_Total:Joi.number()
        
        
    });
   
    let checkresult=checker.validate(req.body);
    console.log(checkresult)
    console.log(checkresult.error)
    if(checkresult.error){
      res.status(400).send('bad request');
    }

    if(isEmpty(req.body)){
    res.status(400).send('no value in request');
   }
   let newUser =req.body; // user ใหม่
   console.log(newUser);
   let pool = await db_custom;
   let sql ='INSERT INTO activity (User_Name,Act_WalkRun,Act_Cycling,Act_Start,Act_Stop,Act_Distance,Act_Time_Total	) values (?,?,?,?,?,?,?)';
   let result =await pool.query(sql,[newUser.User_Name,newUser.Act_WalkRun,newUser.Act_Cycling,newUser.Act_Start,newUser.Act_Stop,newUser.Act_Distance,newUser.Act_Time_Total]);
   
   console.log(result);
   //console.log(result.affectedRows);
   if(result.affectedRows > 0){
               res.json({success:true})
            }
          else{
               res.json({success:false})
           }


});


app.get('/employees/latest/:employeeCount',async(req, res) => {
    let sql ="SELECT * FROM Employee Limit " + req.params.employeeCount; 
    let pool =await db;
    let item  = await pool.query(sql);
   
    res.json(item);
});

//user/:userID/shopping-cart/:cartID
//cutomer/:customID/sales/:saleId




//employee/:employeeId/sick-leave
app.post('/login/getAuthen',async(req,res)=>{
    let pool = await db_custom;
    let Logincheck = req.body;
    console.log(Logincheck);
    let checker=Joi.object({
            User_Name:Joi.string().min(1).max(50).required(),
            User_Password:Joi.string().min(1).max(50).required()
          })
    let checkResult = checker.validate(req.body);
    if(checkResult.error){
            res.status(400).send('bad request data');
            return;
          }
     let sql = 'select User_Number,User_Name,Name,Surname,email FROM User where User.User_Name='+"'"+Logincheck.User_Name+"'"+' and User.User_Password='+"'"+Logincheck.User_Password+"'";
    let item= await pool.query(sql);



    res.json(item);

  console.log(item.User_Number)
    
})

app.post('/employees/create',async(req, res) => {
    let pool = await db;
    let checker = Joi.object({
        first_name :Joi.string().min(1).max(50).required(),//required คือ จำเป็น
        last_name :Joi.string().min(1).max(100).required(),
        email : Joi.string().email().required(),
        
    });
    let checkresult=checker.validate(req.body);
    if(checkresult.error){
        res.status(400).send('bad request?');
    }

//  if(isEmpty(req.body)){
// res.status(400).send('no value in request');
// return

//    }

    let newEmployee =req.body; //เอามาใส่body
    console.log(newEmployee);
    let sql ='INSERT INTO Employee (first_name,last_name,email) values (?,?,?)';
    let result =await pool.query(sql,[newEmployee.first_name,newEmployee.last_name,newEmployee.email]);
    console.log(result);
        if(result.affectedRows > 0){
        res.json({success:true})
    }
    else{
        res.json({success:false})
    }
    
  //  res.json({});
});





app.listen(3000,()=>{
 console.log('server is running at port 3000');

});