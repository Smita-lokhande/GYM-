var ENVCALURL = "";
// var ENVCALURL = "https://dev.calendaree.com:55000"
const https = require('https');
var busboy = require('connect-busboy');
const http = require('http');
const mysql = require('mysql');
const express = require('express');//manage servers and routes
var bodyParser = require('body-parser');
const crypto = require ("crypto");
const session = require('express-session');
const { Console, info, error } = require('console');
const { query } = require('express');
const app=express();
// app.use(bodyParser.json());
var up = bodyParser.urlencoded({ extended: false });
const oneDay = 1000 * 60 * 60 * 24;
const {v4 : uuidv4, validate} = require('uuid');
const multer = require("multer");
const fs = require('fs');
const QRCode = require('qrcode');
const base64ToImage = require('base64-to-image');
const base64ToFile = require('base64-to-file');
const { func } = require('assert-plus');
const { resolve } = require('path');
const { execFileSync } = require('child_process');
const { bashCompletionSpecFromOptions } = require('dashdash');
app.use("/static", express.static("static"));
//app.use(fileUpload());
const port = 55000;
const host = 'localhost';
var stats = ""
app.set('views', './views');
app.set('view engine', 'pug');
const EventEmitter = require('events');
const eventEmitter = new EventEmitter();
const csvtojson = require('csvtojson');

// export const isAuthenticated = async (req, res, next) => {
//     res.set('isAuth', true);
//     next();
// }


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneDay}
  }))

  app.use(bodyParser.json({
    limit: '50mb'
}));

app.use(bodyParser.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true 
}));

//   secret - a random unique string key used to authenticate a session. It is stored in an environment variable and can’t be exposed to the public. The key is usually long and randomly generated in a production environment.

// resave - takes a Boolean value. It enables the session to be stored back to the session store, even if the session was never modified during the request. This can result in a race situation in case a client makes two parallel requests to the server. Thus modification made on the session of the first request may be overwritten when the second request ends. The default value is true. However, this may change at some point. false is a better alternative.

// saveUninitialized - this allows any uninitialized session to be sent to the store. When a session is created but not modified, it is referred to as uninitialized.

// cookie: { maxAge: oneDay } - this sets the cookie expiry time. The browser will delete the cookie after the set duration elapses. The cookie will not be attached to any of the requests in the future. In this case, we’ve set the maxAge to a single day as computed by the following arithmetic.

app.get("/1/login",function(req, res){
    req.session.destroy();
    res.render("login.pug")
})
const tempdocstorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./userdata/tempfiles");
    },
    onError : function(err, next) {
        console.log('error', err);
        next(err);
    },    
    filename: (req, file, cb) => {
        const fileExtension = file.originalname
        req.session.filename = fileExtension
        // console.log(req.session.sessionid+ ' file upload ' + req.session.userid)
        cb(null, req.session.userid+"."+fileExtension.split(".").pop());
    },
})
const uploadtemp = multer({
    storage: tempdocstorage,
    limits: { fileSize: 209715200000}
})

app.get('/getattendanceuser/:filename', (req, res) => {
    fname = "./userdata/download/"+ req.params.filename
    //console.log(fname +" Address")

    if (fs.existsSync(fname)){
       var readStream = fs.createReadStream(fname);
        // We replaced all the event handlers with a simpleh call to readStream.pipe()
        readStream.pipe(res); 
    }
 });
app.post("/1/fileoperations",uploadtemp.single('image'), async (req,res)=>{

//   app.post("/1/fileoperations",uploadtemp.single('video'), async (req,res)=>{
    if(!req.session.userid){
        res.send("sessionexpired")
    }else if(req.body.action == 'savefile'){
        console.log("save file -")
        res.send("ok")
    }else if(req.body.action == 'retriveimage'){
        console.log("retriv file -")
        retrivefile(req,res)
    }else if(req.body.action == 'replacefile'){
        console.log("replacefile file -")
        replacefile(req,res)
    }else if(req.body.action == 'deletefile'){
        console.log("delete file -")
        deletefile(req,res)
    }
    else{
        console.log("Wrong Choice")
    }
})

//image trtriv
function retrivefile(req,res,fileid1,path1,orgid,successfun){
    var fileid = fileid1
    console.log(path1 +" path1")
    var nameoftempfol = path1
    let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
    fcon.query(sql,function(err,result){
        console.log(sql + " retrive query 123")
        //console.log(result)
        if(err) console.log(err)
        else if(result.length>0){
            if (fs.existsSync("./userdata1/" + nameoftempfol)){
                
            }else{
                fs.mkdir("./userdata1/"+nameoftempfol,{ recursive: true }, function(err){
                    if (err) {
                        console.log(err)
                    } else {
                        console.log("New directory successfully created.")
                    }
                })
            }
            try {
                let path = "./userdata1/" + nameoftempfol+"/"
                console.log(path+" retrivefile path")
                let filename1 = result[0].filename
                console.log(filename1 +"122")
                let filename = filename1.split(".")
                //  console.log(filename[0])
                //  console.log(filename[1] )
                var optionalObj = {'fileName': filename[0], 'type': filename[1]};
                base64ToImage(result[0].file,path,optionalObj);
                successfun(filename1)
                console.log(filename1)     
            } catch (error){
                successfun("error")
            }
        }else{
            successfun("No Image")
        }
    })
}
//retrivefile1

function retrivefile1(req,res,fileid1,path1,orgid,successfun){
    var fileid = fileid1
    // console.log(path1 +" path1")
    var nameoftempfol = path1
    let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
    fcon.query(sql,function(err,result){
        if(err){
            console.log(err)
        }else if(result.length>0){
            var arr=[];
        arr.push(result[0].filename)
        arr.push(result[0].file)
        arr.push(result[0].file.length)
        successfun(arr);
        }else{
            console.log("file not found")
            successfun("File not Found")
        }
    })
}
// video retriv
// function retrivefile(req,res,fileid1,path1,orgid,successfun){
//     //console.log("123456")
//     var fileid = fileid1
//    // console.log(fileid +"  fileid")
//     var nameoftempfol = path1
//     //console.log(nameoftempfol +" nameoftempfol")
//     let sql = "select * from uploadfile where orgid like'"+orgid+"' and fileid like'"+fileid+"'"
//     fcon.query(sql,function(err,result){
//        // console.log(sql)
//         //console.log(result)
//         if(err) console.log(err)
//         else if(result.length>0){
//             if (fs.existsSync("./userdata/" + nameoftempfol)){
                
//             }else{
//                 fs.mkdir("./userdata/"+nameoftempfol,{ recursive: true }, function(err){
//                     if (err) {
//                         console.log(err)
//                     } else {
//                         console.log("New directory successfully created.")
//                     }
//                 })
//             }
//             try {
//                 let path = "./userdata/" + nameoftempfol+"/"
//                 // console.log(path+" retrivefile path")
//                 let filename1 = result[0].filename
//                 let filename = filename1.split(".")
//                 //console.log(filename[0] +"")
//                 //console.log(filename[1] +"3333")
//                 var optionalObj = {'fileName': filename[0], 'type': filename[1]};
//                 //console.log(optionalObj.fileName + " " + optionalObj.type +" optionalObj")
//                 // base64ToImage(result[0].file,path,optionalObj);
//                 let obj1 = result[0].file.replace(/^data:(.*?);base64,/, ""); // <--- make it any type
//                 obj1 = obj1.replace(/ /g, '+'); // <--- this is important
//                 fs.writeFile(path+filename1, obj1, 'base64', function(err) {
//                    // console.log(err);
//                 });
//                 //  base64ToFile(result[0].file, path, optionalObj);
//                 // base64ToVideo(result[0].file,path,optionalObj);
//                 successfun(filename1)
//                 //console.log(filename1 +"   *filename1")     
//             } catch (error){
//                 console.log(error)
//                 successfun("error")
//             }
//         }else{
//             successfun("No Image")
//         }
//     })
// }

//---------------------------Update Quote Savefiledb, replace file,deletefile,retrivefile---------------------------
function savefiledb(req,res,orgid,successfun){
    let fileid = uuidv4(); 
    console.log(fileid +" --fileid")
    let success = fileid
    // console.log( success +" succ....")
    // console.log(req.session.filename +"  ..filename")
    if(req.session.filename == undefined || req.session.filename == 'undefined')
    {
        return successfun("error while uploading");
    }
    let fileExtension = req.session.filename.split(".").pop()
   console.log( fileExtension +" ...fileExtension")
    const file = "./userdata/tempfiles/"+req.session.userid+"."+fileExtension
    // console.log(file + " - file ***")
    if (fs.existsSync(file)){
        var bitmap = fs.readFileSync(file);
        // console.log(" - bitmap ***")
        let png = "data:image/"+fileExtension+";base64,"
        // console.log(png + " - png ***")
        var fileurl = Buffer.from(bitmap).toString('base64');
        png = png + fileurl
    //    console.log(file +"file -" + png+ +"-png")
        if (!file){
            console.log(" - !file ***")
           return successfun("Please upload a file.");
        }
        var sql = "insert into uploadfile(orgid,fileid,filename,file,date)values('"+orgid+"','"+fileid+"','"+req.session.filename+"','"+png+"',now())"
        try{
            fcon.query(sql,function(err,result){
                // console.log(  "......"+sql +" .. fcon  1234567890")
                if(err) console.log(err)
                else if(result.affectedRows>0){
                  return successfun(success);
                }else{
                    return successfun("error while uploading");
                }
            }) 
        } catch (error) {
            return successfun("error while uploading");
        }       
    } 
    else{
       return successfun("error while uploading")
    }
}

function savefiledb1(filename,filecontent, orgid, successfun) {
    let fileid = uuidv4();
    console.log(fileid + " --fileid");
    
    let fileExtension = filename.split(".").pop();
    console.log(fileExtension + " ...fileExtension");

    // Convert file content to base64
    let fileBase64 = filecontent.toString('base64');
    let fileurl = "data:image/" + fileExtension + ";base64," + fileBase64;
    // let fileurl = "data:image/" + fileExtension + ";base64,"; 
    var sql = "insert into uploadfile(orgid,fileid,filename,file,date)values('"+orgid+"','"+fileid+"', '"+filename+"', '"+fileurl+"', now())";
    try {
      fcon.query(sql,function (err, result) {
        // console.log("......" + sql + " .. fcon");
        if (err) {
          console.log(err);
          return successfun("error while uploading");
        } else if (result.affectedRows > 0) {
          return successfun(fileid); 
        } else {
          return successfun("error while uploading");
        }
      });
    } catch (error) {
      return successfun("error while uploading");
    }
}


function replacefile(req,res,orgid,fileid,successfun){
    if(req.session.filename == undefined || req.session.filename == 'undefined')
    {
        return successfun("error");
    }    
    let fileExtension = req.session.filename.split(".").pop()
    const file = "./userdata/tempfiles/"+req.session.userid+"."+fileExtension
    if (fs.existsSync(file)){
        var bitmap = fs.readFileSync(file);
        let png = "data:image/"+fileExtension+";base64,"
        var fileurl = Buffer.from(bitmap).toString('base64');
        png = png + fileurl
        if (!file) {
           successfun("Please upload a file.");
        }
        var sql = "update uploadfile set filename='"+req.session.filename+"', file='"+png+"', date=now() where fileid like'"+fileid+"' and orgid like'"+orgid+"'";
        fcon.query(sql,function(err,result){
            //console.log(sql)
            //console.log(result)
            if(err) console.log(err)
            else if(result.affectedRows>0){
                successfun("Updated")
            }else{
                successfun("error")
            }
        })            
    } 
    else{
        successfun("error")
    }
}

function deletefile(req,res,fileid,orgid,successfun){
    if(fileid == null || fileid == undefined || fileid == '' || fileid === 'undefined' || fileid === 'null'){
        successfun("Please send fileid")
    }else{
        var sql ="delete from uploadfile where orgid like'"+orgid+"' and fileid like '"+fileid+"'";
        fcon.query(sql,function(err,result){
            console.log(sql +" file db delet function")
            if(err) {
                console.log(err)
                successfun("err")
            }else if(result.affectedRows>0){
                successfun("file Deleted")
            }else{
                successfun("File Not Existed")
            }
        })
    }
}

app.post("/1/login",up,(req,res)=>{
    if(req.body.action==="loginbutton"){ 
        // console.log("hello")
        var mobileno=req.body.mobileno;
        var password =req.body.password;
        var sql = "select * from usermaster_t.users where mobile like '"+mobileno+"' and password like '"+password+"'"
        //   console.log(sql)
        mcon.query(sql,function(error, results){
        // console.log(sql+"............")     
        st1 = [];
              if (error) {
                console.log(error)
            } else if (results.length > 0) {
                st1.push(results.name)
                //  console.log(st1)
                req.session.userid = results[0].userid;
                //  console.log(req.session.userid +" userid")
                req.session.username = results[0].name;
                req.session.mobileno = results[0].mobileno;
                req.session.password = results[0].password;
                req.session.email = results[0].email;
                req.session.save();
                res.send("yes")
                // console.log(req.session.userid)
                // console.log(req.session.mobileno +"  mobile n")
                // console.log("save")
            }  else {
                 res.send("Invalid username or password.")
             }
        })
    }else if(req.body.action==="saveregister"){
        var username=req.body.username;
        var mobileno=req.body.mobileno;
        var email=req.body.email;
        var password=req.body.password;
        // var compassword=req.body.compassword;
        var userid=uuidv4();
        var sql = "select * from usermaster_t.users where mobile = '"+mobileno+"'";
        var sql1 = "insert into usermaster_t.users(userid,name,password,mobile,email) values('"+userid+"','"+username+"','"+password+"','"+mobileno+"','"+email+"')"
        mcon.query(sql,function(err,result1){
            //   console.log(sql+"register")
            if(err)console.log(err)
            else if(result1.length>0){
                //console.log(res)
                res.send("User Already Exist")
            }
             else{
                mcon.query(sql1,function(err,result){
                    if(err)console.log(err)
                    else if(result.length>0){
                        //  console.log("not")
                        res.send("error")
                    }else{
                        res.send("save")
                         }
                })
            }
        }) 
    }
})
// app.get("/1/menu", (req, res) => {
//     // console.log("here menu page.....")
//     if(!req.session.userid){
//         // confirm.log("asmi")
//         res.redirect("/1/login")
//     }else if(req.session.userid) {
//         username = req.session.username
//         email = req.session.email
//         mobileno = req.session.mobileno
//         console.log(req.session.mobileno + " - req.session.mobileno")
//         // console.log("showing menu for "+username+" "+email+" "+mobileno+"")
//         //mcon.query("select * from modules where is visible like 'yes'")
//         console.log("menu.pug",{user: req.session.userid, username: username,mobileno:mobileno});
//         res.render("menu.pug",{user: req.session.userid, username: username,mobileno:mobileno});
//     }
// });
app.get("/1/menu", (req, res) => {
    if(!req.session.userid){
        res.redirect("/1/login")
    }
    if(req.session.userid) {
        username = req.session.username
        email = req.session.email
        mobile = req.session.mobile
        // console.log("showing menu for "+username+" "+email+" "+mobile)
        mcon.query("select * from modules where isvisible like 'yes'")
        res.render("menu.pug",{user: req.session.userid, username: username});
    }
});
app.get("/1/Calendareemainpage",function(req, res){
    req.session.destroy();
    res.render("Calendareemainpage.pug")
})
app.post("/1/Calendareemainpage",up,async (req,res)=>{
    // if(!req.session.userid){
    //     res.send("sessionexpired")
    //     //res.redirect("/1/login")
    // }
})

//--------------------------------My New Project------------------------------------

//task register
const ucon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Pranalimu$24',
    database: 'user',
    port: 3306
 });

 const fcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'filesdb_t',
    port: 45203
});


const nmcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'mlm_t',
    port: 45203
})
const gymcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'gymmanagement_t',
    port: 45203
})

const mcon = mysql.createConnection({
    host: '103.235.106.223',
    user: 'caltest',
    password: 'NjUDLN3edH',
    database: 'usermaster_t',
    port: 45203
});

app.get('/getgymprofilepic/:filename', (req, res) => {
    // filename="9841827e-f5c6-4343-bf4b-b1c024ae496206a8e5c4-802e-454e-8c0b-2f5a4ae3cd1a.pdf"
    fname = "./userdata/gymprofilepic/"+req.session.orgid+"/"+ req.params.filename
    //console.log(fname)
    if (fs.existsSync(fname)){
       var readStream = fs.createReadStream(fname);
        // We replaced all the event handlers with a simpleh call to readStream.pipe()
        readStream.pipe(res); 
    }
 });
 function gettotalsize2(subid,orgid,successfun){
    let sql ="SELECT orgid, sum(LENGTH(file)) / 1024 / 1024 as 'Size' FROM uploadfile where orgid = '"+orgid+"';"
    fcon.query(sql,function(err,result){
        // console.log(sql +"  gettotalsizee2")
        if(err) console.log(err)
        else{
            let filesize= parseFloat(result[0].Size).toFixed(2);
            // console.log(filesize +" filesize")
            var sql1 ="update subscriptions set usedquota="+filesize+" where subscriptionid like'"+subid+"'";
            mcon.query(sql1, function(err,result){
                console.log(sql1 +"   mcon update ")
                if(err) console.log(err)
                else if(result.affectedRows>0){
                    successfun("Successful")                  
                }else{
                    successfun("Failed")
                }
            })
        }
    })
}

//GYM Module

app.get('/getworkoutcard/:filename', (req, res) => {
    console.log(req.params.filename)
    gymcon.query("select subscriptionid,cardlink from membercard where memberid in(select memberid2 from gymmembers where mobileno like'"+req.params.filename+"') order by assigneddate desc",function(err,result){
        if(err) console.log(err)
        else if(result.length>0){
            fname = "./userdata/gymdata/"+result[0].subscriptionid+"/gymworkoutcard/"+result[0].cardlink+".png"
            console.log(fname + "here")
            if (fs.existsSync(fname)){
                console.log("exists") 
                var readStream = fs.createReadStream(fname);
                readStream.pipe(res);               
            } 
            else{
                res.send("first save this card")
            }
        }
    })
});
//pic upload gym
const storagegym = multer.diskStorage({
    destination: (req, file, cb) => {
        // const pathe="./userdata/gymdata/"+req.session.subsid;
        if (fs.existsSync("./userdata/gymdata/"+req.session.subsid)){
            console.log("exists") 
            // cb(null, pathe)               
       }
       else{
           fs.mkdir("./userdata/gymdata/"+req.session.subsid, function(err) {
               if (err) {
                 console.log(err)
                //  cb(err);
               } else {
                 console.log("New directory successfully created.")
                //  cb(null, pathe);
               }
           })
       }
        cb(null,"./userdata/gymdata/"+req.session.subsid);
    },
    filename: (req, file, cb) => {
        const fileExtension = req.session.memberid+".png";
        console.log( req.session.memberid + " - req.session.memberid")
        console.log(fileExtension+ ' file upload ' + req.session.userid)
        cb(null, fileExtension);
    },
})
const uploadprofilepic = multer({
    storage: storagegym,
    limits: { fileSize: 2097152 }
}).single('png');

app.post("/uploadprofilepic",(req,res)=>{
    uploadprofilepic(req, res, (err) => {
        if (err) {
            console.log(err)
            res.send('bigfile')
        } else {
            let showgymmenu = 'yes'
            res.render("gymmanagement.pug",{owner: showgymmenu})
        }
    });
})
app.get('/getprofilepicgym/:filename', (req, res) => {
    fname = "./userdata/gymdata/"+req.session.subsid+"/"+req.params.filename
    console.log(fname + "here")
    if (fs.existsSync(fname)){
        console.log("exists") 
        var readStream = fs.createReadStream(fname);
        // We replaced all the event handlers with a simpleh call to readStream.pipe()
        readStream.pipe(res);               
    } 
    else{
        console.log("no")
    }
});

//logo upload gym
const storagegymlogo = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Subsid:", req.session.subsid);
        // const fspath = "./userdata/gymdata/" + req.session.subsid + "/gympictures/";
        if (fs.existsSync("./userdata/gymdata/"+req.session.subsid)){
            console.log("exists")                
       }else{
            // console.log("hello")
           fs.mkdir("./userdata/gymdata/"+req.session.subsid, function(err) {
            // console.log("hello 1")
               if (err) {
                 console.log(err +" error on logo")
               } else {
                 console.log("New directory successfully created.")
               }
           })
       }
        cb(null,"./userdata/gymdata/"+req.session.subsid);
    },
    filename: (req, file, cb) => {
        const fileExtension = req.session.subsid+".png";
        console.log(fileExtension + " - fileExtension")
        console.log(req.session.fileExtension+ ' file upload  gym logo' + req.session.userid)
        cb(null, fileExtension);
    },
})
const uploadgymlogo = multer({
    storage: storagegymlogo,
    limits: { fileSize: 2097152 }
}).single('png');

app.post("/uploadgymlogo",(req,res)=>{
    uploadgymlogo(req, res, (err) => {
        if (err) {
            console.log(err)
            res.send('bigfile')
        } else {
            let showgymmenu = 'yes'
            console.log(showgymmenu +" - showgymmenu")
            res.render("gymmanagement.pug",{owner: showgymmenu})
        }
    });
})

// app.get('/getlogogym/:filename', (req, res) => {
//     fname = "./userdata/gymdata/"+req.session.subsid+"/"+req.session.subsid+".png"
//     console.log(fname + "here")
//     if (fs.existsSync(fname)){
//         console.log("exists") 
//         var readStream = fs.createReadStream(fname);
//         // We replaced all the event handlers with a simpleh call to readStream.pipe()
//         readStream.pipe(res);               
//     } 
//     else{
//         console.log("no")
//     }
// });
app.get('/getlogogym/:filename', (req, res) => {
    fname = "./userdata/gymdata/"+req.session.subsid+"/"+req.params.filename
    // console.log(fname + "here 123")
    if (fs.existsSync(fname)){
        console.log("exists") 
        var readStream = fs.createReadStream(fname);
        // We replaced all the event handlers with a simpleh call to readStream.pipe()
        readStream.pipe(res);               
    } 
    else{
        console.log("no")
    }
});
// upload file gym

const storagememberdetails = multer.diskStorage({
    destination: (req, file, cb) => {
        if (fs.existsSync("./userdata/gymdata/" + req.session.subsid +"/gymfiles")){
            console.log("exists")                
       }
       else{
           fs.mkdir("./userdata/gymdata/" + req.session.subsid, function(err) {
               if (err) {
                 console.log(err)
               } else {
                 console.log("New directory successfully created.")
               }
           })
           fs.mkdir("./userdata/gymdata/" +req.session.subsid+"/gymfiles", function(err) {
            if (err) {
              console.log(err)
            } else {
              console.log("New directory successfully created.")
            }
        })
        fs.mkdir("./userdata/gymdata/" +req.session.subsid+"/gympictures", function(err) {
            if (err) {
            console.log(err)
            } else {
            console.log("New directory successfully created.")
            }
        })
       }
       console.log("########################")
        cb(null, "./userdata/gymdata/"+req.session.subsid+"/gymfiles");
    },
    filename: (req, file, cb) => {
        const fileExtension = req.session.userid+".csv";
        console.log(fileExtension+ ' file upload ' + req.session.userid)
        cb(null, fileExtension);
    },
})

const uploadmemberdetails = multer({
    storage: storagememberdetails,
    limits: { fileSize: 2097152 }
}).single('csv');


app.post("/uploadmemberdetails",(req, res)=>{
    uploadmemberdetails(req, res, (err) => {
        if (err) {
            console.log(err)
            res.send('bigfile')
        } else {
            showgymmenu = "yes"
            res.render("gymmanagement.pug",{user: showgymmenu})
        }
    });
})

app.get("/1/gymmanagement", (req,res) => {
    if(!req.session.userid){
        res.redirect("/1/login")
    }else{
        let admin2nd = 0;
        let gymmenber = 0;
        let showgymmenu = '';
        var started=0;
        var orgcolor="";
        var substatus=0;
        var sql ="select * from subscriptions where userid like '"+req.session.userid+"' and moduleid=8 and isprimary like 'yes'";
        mcon.query(sql, function(err,result) {
            console.log(sql + " gym sql")
        if(err) {
            console.log(err)
        } else if(result.length > 0) {
                showgymmenu = "yes"
                req.session.subsid = result[0].subscriptionid
            } else{
                showgymmenu = "no"
            }
            gymcon.query("select * from gymadmins where userid like '"+req.session.userid+"'", function(err,results2){
            if(err) console.log(err)
            else if(results2.length>0){
               admin2nd = 1;
                req.session.subsid = results2[0].subscriptionid;
            }else{
                admin2nd = 0;
            }
            var sql1 = "select * from gymmanagement_t.gymmembers where memberid='"+req.session.userid+"'";
            gymcon.query(sql1,function(err, results){
                console.log(sql1 + " -gymmenber")
                if(err) console.log(err)
                else if(results.length>0){
                    gymmenber = 1
                }else{
                    gymmenber = 0
                }
                var sql="select * from gymmanagement_t.orgdetails where subscriptionid='"+req.session.subsid+"' ";
                   // console.log("sql......."+sql)
                    gymcon.query(sql, (err, result)=>{
                    if(err) console.log(err)
                    else if (result.length>0) {
                        console.log("one")
                        started = 1;                     
                        req.session.orgid = result[0].orgid;
                        console.log(req.session.orgid  )
                    } else {
                        started = 0;
                       console.log("two")
                    }
                    var sql="select * from gymmanagement_t.orgdetails where subscriptionid='"+req.session.subsid+"'";
                        console.log("sql......."+sql)
                        gymcon.query(sql, (err, result)=>{
                            if(err) console.log(err)
                            else if (result.length>0) {
                                //console.log("one")
                                req.session.orgcolor = result[0].csscolor;                   
                                orgcolor=req.session.orgcolor;
                                if(orgcolor == 'undefined' || orgcolor == null || orgcolor == 'null' || orgcolor == undefined || orgcolor == 'NaN-aN-aN'){
                                    orgcolor='style'
                                }
                                //console.log(req.session.orgid +"orgid")
                            } else {
                                orgcolor = 0;
                                //console.log("two")
                            }   
                            var sqlsubstatus = "select enddate,subscriptionid from usermaster_t.subscriptions where subscriptionid in (select orgdetails.subscriptionid  from gymmanagement_t.orgdetails where orgid like '"+req.session.orgid+"')";
                            mcon.query(sqlsubstatus,function(err,result){
                                console.log(sqlsubstatus + " - sqlsubstatus")
                                if(err)console.log(err)
                                else if(result.length>0){
                                    var enddate = result[0].enddate
                                    let date1 = new Date()
                                    const diffTime = enddate.getTime() - date1.getTime();
                                    const diffDays = diffTime / (1000 * 60 * 60 * 24);
                                    if(diffDays>0){
                                            substatus = 1;
                                    }else{
                                            substatus = 0;    
                                    } 
                                }     
                                res.render("gymmanagement.pug",{owner: showgymmenu, admin2nd: admin2nd,gymmenber:gymmenber, user: req.session.userid, username: req.session.username,subsid:req.session.subsid,started:started,orgcolor:orgcolor,substatus:substatus})
                                console.log("gymmanagement.pug",{owner: showgymmenu, admin2nd: admin2nd,gymmenber:gymmenber, user: req.session.userid, username: req.session.username,subsid:req.session.subsid,started:req.session.orgid,orgcolor:orgcolor,substatus:substatus})
                            })
                        })            
                    })
                })
            })
        })
    }
})


app.post("/1/gymmanagement",up,async (req,res)=> {
    if(!req.session.userid){
        res.send("sessionexpired")
    }
    else if(req.body.action === "subscribegymmanagement") {
        console.log("hello")
            var date_ob = new Date();
            var currentdate = date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2) +" "+date_ob.getHours()+':'+date_ob.getMinutes()+':'+date_ob.getSeconds();
            var days = 3;
            let newDate = new Date(Date.now()+days*24*60*60*1000);
            let ndate = ("0" + newDate.getDate()).slice(-2);
            let nmonth = ("0" + (newDate.getMonth() + 1)).slice(-2);
            let hours = newDate.getHours();
            let minutes = newDate.getMinutes();
            let seconds = newDate.getSeconds();           
            let nyear = newDate.getFullYear();    
            let nextdate = nyear+'-'+nmonth+'-'+ndate +" "+hours+':'+minutes+':'+seconds  
            var subid = uuidv4();
            // var dt = dateTime.create();
            // var subdt = dt.format('Y-m-d H:M:S');
            var query = "insert into subscriptions(subscriptionid, userid,startdate,enddate,moduleid,isprimary) values('"+subid+"','"+req.session.userid+"','"+currentdate+"', '"+nextdate+"',8,'yes')"
            mcon.query(query)
            mcon.query("commit")
            // var query = "insert into subscriptions(subscriptionid, userid,startdate,enddate,moduleid,isprimary) values('"+subid+"','"+req.session.userid+"','"+currentdate+"', '"+nextdate+"',9,'no')"
            // mcon.query(query)
            // mcon.query("commit")  
            // gymcon.query("insert into orgdetails(subscriptionid) values('"+subid+"')", function(err, result) {
                // if(err) console.log(err)
            // })
            res.send("subscribed");  
    }
    else if (req.body.action === "saveorginfo") {
        var orgid=uuidv4();
        orgname =  req.body.orgname
        orgaddress =  req.body.orgaddress
        orgcity =  req.body.orgcity
        orgstate =  req.body.orgstate
        orgcontact =  req.body.orgcontact
        orgemailid =  req.body.orgemailid
        var sql=" "
        // gymcon.query("update orgdetails set orgname='"+orgname+"', orgaddress='"+orgaddress+"', orgcity='"+orgcity+"', orgstate='"+orgstate+"', orgpin='"+orgpin+"', orgcontact='"+orgcontact+"', orgemailid='"+orgemailid+"', orggst='"+orggst+"', orgpan='"+orgpan+"', orgbankname='"+orgbankname+"', orgbankaccountname='"+orgbankaccountname+"', orgbankaccountnumber='"+orgbankaccountnumber+"', orgifsccode='"+orgifsccode+"' where subscriptionid like '"+req.session.subsid+"'")
        gymcon.query("insert into orgdetails (subscriptionid,orgname, orgaddress,orgcity,orgstate,orgcontact,orgemailid,orgid)values('"+req.session.subsid+"','"+orgname+"', '"+orgaddress+"','"+orgcity+"','"+orgstate+"','"+orgcontact+"','"+orgemailid+"','"+orgid+"') ")
        // gymcon.query(sql,function(err,result1){
        gymcon.query("commit")
        res.send("Saved")
    }  
    else if (req.body.action === "saveorgprofile") {
            var orgid=uuidv4();
            orgname =  req.body.orgname
            orgaddress =  req.body.orgaddress
            orgcity =  req.body.orgcity
            orgstate =  req.body.orgstate
            orgpin =  req.body.orgpin
            orgcontact =  req.body.orgcontact
            orgemailid =  req.body.orgemailid
            orggst =  req.body.orggst
            orgpan =  req.body.orgpan
            orgbankname =  req.body.orgbankname
            orgbankaccountname =  req.body.orgbankaccountname
            orgbankaccountnumber =  req.body.orgbankaccountnumber
            orgifsccode =  req.body.orgifsccode
            var sql=" "
            gymcon.query("update orgdetails set orgname='"+orgname+"', orgaddress='"+orgaddress+"', orgcity='"+orgcity+"', orgstate='"+orgstate+"', orgpin='"+orgpin+"', orgcontact='"+orgcontact+"', orgemailid='"+orgemailid+"', orggst='"+orggst+"', orgpan='"+orgpan+"', orgbankname='"+orgbankname+"', orgbankaccountname='"+orgbankaccountname+"', orgbankaccountnumber='"+orgbankaccountnumber+"', orgifsccode='"+orgifsccode+"' where subscriptionid like '"+req.session.subsid+"'")
            gymcon.query("commit")
            res.send("Saved")
        } 
        //gymlogo
        // else if(req.body.action==='uploadgymlogo'){
        //     return new Promise((resolve, reject) => {
        //         savefiledb(req,res,req.session.orgid,(successfun) => {
        //             resolve(successfun);
        //         });
        //     }).then((data)=>{
        //         gymcon.query("UPDATE orgdetails SET logoid ='"+data+"' where orgid='"+req.session.orgid+"'" , function(err,result){
        //             if(err) console.log(err);
        //             else if(result.affectedRows>0){
        //                 res.send('successful')
        //             }else{
        //                 console.log("something went wrong please try after sometime.....")
        //             }
        //         })
        //     })   
        // }
        // else if(req.body.action === 'getgymlogo'){
        //     let path ="gymlogo/"+req.session.orgid
        //     gymcon.query("select logoid from orgdetails where orgid='"+req.session.orgid+"'",function(err,result){
        //         if(err) console.log(err)
        //         else if(result.length>0){
        //             let fileid = result[0].logoid;
        //             return new Promise((resolve, reject) => {
        //                 retrivefile(req,res,fileid,path,req.session.orgid,(successfun) => {
        //                     resolve(successfun);
        //                 });
        //             }).then((data)=>{
        //                 res.send(data)
        //             })
    
        //         }else{
        //             res.send("no file")
        //         }
        //     })    
        // }
        else if (req.body.action === "getorgprofile") {
        console.log(req.session.subsid+ " org info")
        gymcon.query("select * from orgdetails where subscriptionid like '"+req.session.subsid+"'", function(err,result) {
            if(result.length<1) {
                res.send("notfound")
            } else {
                orgname =  result[0].orgname
                orgaddress =  result[0].orgaddress
                orgcity =  result[0].orgcity
                orgstate =  result[0].orgstate
                orgpin =  result[0].orgpin
                orgcontact =  result[0].orgcontact
                orgemailid =  result[0].orgemailid
                orggst =  result[0].orggst
                orgpan =  result[0].orgpan
                orgbankname =  result[0].orgbankname
                orgbankaccountname =  result[0].orgbankaccountname
                orgbankaccountnumber =  result[0].orgbankaccountnumber
                orgifsccode =  result[0].orgifsccode
                arr = '["orginfo","'+result[0].orgname+'","'+result[0].orgaddress+'","'+result[0].orgcity+'","'+result[0].orgstate+'","'+result[0].orgpin+'","'+result[0].orgcontact+'","'+result[0].orgemailid+'","'+result[0].orggst+'","'+result[0].orgpan+'","'+result[0].orgbankname+'","'+result[0].orgbankaccountname+'","'+result[0].orgbankaccountnumber+'","'+result[0].orgifsccode+'"]'
                res.send(arr)
            }
        })
    } else if(req.body.action === "searchuser") {
            mcon.query("select * from users where mobile like '"+req.body.mobilenumber+"'", function(err,result) {
                if(err) {
                    console.log(err)
                } else {
                    if(result.length>0) {
                        res.send(result[0].name)
                    } else {
                        res.send("notfound")
                    }
                }
            })
    }
    //  else if (req.body.action === "addgymadmin") {
    //     mcon.query("select * from usermaster_t.users where mobile like '"+req.body.mobilenumber+"'", function(err,result) {
    //         if(err) {
    //             console.log(err)
    //         } else {
    //             if(result.length>0) {
    //                 gymcon.query("insert into gymadmins values('"+req.session.subsid+"','"+result[0].userid+"')")
    //                 gymcon.query("commit")
    //                 res.send("added")
    //             } else {
    //                 res.send("notfound")
    //             }
    //         }
    //     })
    // } 
    else if (req.body.action === "addgymadmin") {
        mcon.query("SELECT * FROM usermaster_t.users WHERE mobile='"+req.body.mobilenumber+"'", function(err, result) {
            if(err) {
                console.log(err);
            } else {
                if(result.length > 0) {
                    var userId = result[0].userid;
                    var sql ="select *from gymmanagement_t.orgdetails where orgcontact='"+req.body.mobilenumber+"'";
                    gymcon.query(sql,function(err,result){
                    if(err){
                        console.log(err)
                    }else 
                    if(result.length>0){
                        res.send("User Already Subscribe on this Module")
                    }else{
                        var sql1="select * FROM gymmanagement_t.gymadmins WHERE userid='"+userId+"' AND subscriptionid <>'"+req.session.subsid+"'";
                        gymcon.query(sql1,function(err,result){
                            console.log(sql1 + " check")
                            if(err){
                                console.log(err)
                            }else {
                                if(result.length > 0) {
                                    // Combination already exists
                                    res.send("User already exists in another organization");
                                } else {
                                    gymcon.query("SELECT * FROM gymadmins WHERE subscriptionid = ? AND userid = ?", [req.session.subsid, userId], function(err, existingResult) {
                                        if(err) {
                                            console.log(err);
                                        } else {
                                            if(existingResult.length > 0) {
                                                // Combination already exists
                                                res.send("alreadyExists");
                                            } else {
                                                // Combination doesn't exist, proceed with insertion
                                                gymcon.query("INSERT INTO gymadmins VALUES (?, ?)", [req.session.subsid, userId], function(err) {
                                                    if(err) {
                                                        console.log(err);
                                                        res.send("error");
                                                    } else {
                                                        gymcon.query("COMMIT");
                                                        res.send("Gym Admin Added Successfully");
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                            })
                       
                    }
                })
                    
                    // Check if the combination exists in gymadmins table
                    
                } else {
                    res.send("notfound");
                }
            }
        });
    }
    
    else if (req.body.action === "getgymadmin") {
        gymcon.query("select * from gymmanagement_t.gymadmins a, usermaster_t.users b where a.userid=b.userid and a.subscriptionid='"+req.session.subsid+"'", function(err,result) {
            if(err) {
                console.log(err)
            } else {
                if(result.length>0) {
                    var rs = "<table id='report'><tr><th>Name</th><th>Mobile</th><th>Action</th></tr>"
                    for(i=0;i<result.length;i++)
                    {
                        rs = rs + "<tr><td>"+result[i].name+"</td><td>"+result[i].mobile+"</td><td><button onclick=removeadmin('"+result[i].userid+"')>Remove Admin</button></td></tr>"
                    }
                    rs = rs + "</table>"
                } else {
                    rs = "No admin assgined."
                }
                res.send(rs)
            }
        })
    }else if(req.body.action==='membermenu'){
        req.session.subsid = req.body.name;
        res.send("Okay")

    }else if(req.body.action==='getallsubscriptions'){
        var sql1 = "select subscriptionid as id, orgname as name from orgdetails where subscriptionid in(select subscriptionid from gymmembers where memberid like'"+req.session.userid+"')";
        gymcon.query(sql1,function(error, results){
            console.log(sql1 + " &&&&&&&&&&&&&&&&")
            if(error) console.log(error)
            else if(results.length>0){
                var rs = []
                for(i=0;i<results.length;i++)
                {
                    rs.push(results[i])
                }
                res.send(rs)
            }else{
                res.send("No Data")
            }
        })
    }else if(req.body.action==='removeplans'){
        gymcon.query("Delete from gymplans where planname like'"+req.body.planname+"' and subscriptionid like'"+req.session.subsid+"'",function(err, results){
            if(err) console.log(err)
            else{
                res.send("Plan Is Removed")
            }
        })
    }else if(req.body.action === 'getmemberprofile'){
        gymcon.query("select gymmembers.name,gymmembers.mobileno,gymmembers.Address1,gymmembers.city,gymmembers.pin,gymmembers.email,gymmembers.memberid2,gymmembers.anniversarydate,gymmembers.birthdate from gymmembers where gymmembers.subscriptionid like'"+req.session.subsid+"' and gymmembers.memberid like'"+req.session.userid+"'",function(err,result){
            console.log(result)
            if(err) console.log(err)
            else if(result.length>0){
                let info = []
                if(result[0].name == null || result[0].name == undefined || result[0].name==''){
                    info.push(" ")
                }else{
                    info.push(result[0].name)
                }
                if(result[0].mobileno == null || result[0].mobileno == undefined || result[0].mobileno==''){
                    info.push(" ")
                }else{
                    info.push(result[0].mobileno)
                }
                if(result[0].email == null || result[0].email == undefined || result[0].email==''){
                    info.push(" ")
                }else{
                    info.push(result[0].email)
                }
                if(result[0].Address1 == null || result[0].Address1 == undefined || result[0].Address1==''){
                    info.push(" ")
                }else{
                    info.push(result[0].Address1)
                }
                if(result[0].city == null || result[0].city == undefined || result[0].city==''){
                    info.push(" ")
                }else{
                    info.push(result[0].city)
                }
                
                if(result[0].pin == null || result[0].pin == undefined || result[0].pin==''){
                    info.push(" ")
                }else{
                    info.push(result[0].pin)
                }
                if(result[0].memberid2 == null || result[0].memberid2 == undefined || result[0].memberid2==''){
                    info.push(" ")
                }else{
                    info.push(result[0].memberid2)
                }
                if(result[0].anniversarydate == null || result[0].anniversarydate == undefined || result[0].anniversarydate==''){
                    info.push(" ")
                }else{
                    info.push(result[0].anniversarydate)
                }
                if(result[0].birthdate == null || result[0].birthdate == undefined || result[0].birthdate==''){
                    info.push(" ")
                }else{
                    info.push(result[0].birthdate)
                }
                res.send(info)
            }else{
                res.send("No Details")
            }
        })
    }
    else if(req.body.action==='removeadmin'){
        gymcon.query("delete from gymadmins where userid like'"+req.body.gymadmin+"'", function(err, result){
            if(err) console.log(err)
            else{
                res.send("Admin Removed Successfully")
            }
        })
    }else if(req.body.action == "getmobile"){
        var memberid = req.body.memberid
        gymcon.query("select mobileno from gymmembers where subscriptionid like'"+req.session.subsid+"' and memberid2 like'"+memberid+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let number = []
                number.push(result[0].mobileno)
                res.send(number)
            }else{
                res.send("no data")
            }
        })
    } 
    else if (req.body.action === "getgymplans") {
        gymcon.query("select * from gymplans where subscriptionid like '"+req.session.subsid+"'", function(err,result) {
            if(err) {
                console.log(err)
            } else {
                if(result.length>0) {
                    var rs = []
                    for(i=0;i<result.length;i++)
                    {
                        rs.push(result[i].planname)
                    }
                    res.send(rs)
                }
            }
        })
    } else if (req.body.action === "savegymplan") {
        gymcon.query("select * from gymplans where subscriptionid like '"+req.session.subsid+"' and planname like '"+req.body.planname+"'", function(err,result) {
            if(err) {
                console.log(err)
            } else {
                if(result.length>0) {
                    query = "update gymplans set duration="+req.body.duration+", fee="+req.body.fee+" where subscriptionid like '"+req.session.subsid+"' and planname like '"+req.body.planname+"'"
                    res.send("Updated")
                } else {
                    var planid = uuidv4()
                    gymcon.query("insert into gymplans values('"+req.session.subsid+"','"+planid+"','"+req.body.planname+"',"+req.body.duration+","+req.body.fee+")")
                    res.send("Saved")
                }
            }
        })
    }else if(req.body.action === "mamberreport"){
        var startdate = req.body.startdate;
        var enddate = req.body.enddate;
        var onname = req.body.onname;
        var numberofrows =req.body.numberofrows;
        var pagenumber=req.body.pagenumber;
        var reporttype = req.body.reporttype
        var startrow = 0
        if(pagenumber <= 0 || pagenumber === 1|| pagenumber === null || pagenumber === '' || pagenumber === undefined || pagenumber === NaN || pagenumber=='NaN'){
            pagenumber=0;
            startrow = 0
        }
        else{
            startrow=(pagenumber*numberofrows)-numberofrows;
        }
       
        if(onname === null || onname === undefined){
            onname='';
        }
        var onnumber = req.body.onnumber;
        if(onnumber=== null || onnumber === undefined){
            onnumber='';
        }
        if(reporttype == 'Anniversary'){
            var sql ="select  gymmembers.name,gymmembers.mobileno,gymmembers.Address1,gymmembers.Address2,gymmembers.city,gymmembers.pin,gymmembers.email,gymmembers.memberid2,memberplans.startdate,memberplans.enddate,memberplans.fee,memberplans.discount,memberplans.amount,memberplans.status,gymplans.planname,gymplans.planname,gymplans.duration,gymmembers.birthdate,gymmembers.anniversarydate from gymmembers join memberplans on gymmembers.memberid=memberplans.memberid join gymplans on memberplans.planid = gymplans.planid where memberplans.status='Active' AND gymmembers.subscriptionid = gymplans.subscriptionid and gymmembers.subscriptionid like'"+req.session.subsid+"' and  gymmembers.name like '%"+onname+"%' and gymmembers.mobileno like '%"+onnumber+"%' AND gymmembers.anniversarydate between '"+startdate+"' AND '"+enddate+"' order by memberplans.startdate desc";
        }else if(reporttype=='Birth Date'){
            var sql ="select gymmembers.name,gymmembers.mobileno,gymmembers.Address1,gymmembers.Address2,gymmembers.city,gymmembers.pin,gymmembers.email,gymmembers.memberid2,memberplans.startdate,memberplans.enddate,memberplans.fee,memberplans.discount,memberplans.amount,memberplans.status,gymplans.planname,gymplans.planname,gymplans.duration,gymmembers.birthdate,gymmembers.anniversarydate from gymmembers join memberplans on gymmembers.memberid=memberplans.memberid join gymplans on memberplans.planid = gymplans.planid where memberplans.status='Active' AND gymmembers.subscriptionid = gymplans.subscriptionid and gymmembers.subscriptionid like'"+req.session.subsid+"' and  gymmembers.name like '%"+onname+"%' and gymmembers.mobileno like '%"+onnumber+"%' AND gymmembers.birthdate between '"+startdate+"' AND '"+enddate+"' order by memberplans.startdate desc";
        }else{
            var sql ="select gymmembers.name,gymmembers.mobileno,gymmembers.Address1,gymmembers.Address2,gymmembers.city,gymmembers.pin,gymmembers.email,gymmembers.memberid2,memberplans.startdate,memberplans.enddate,memberplans.fee,memberplans.discount,memberplans.amount,memberplans.status,gymplans.planname,gymplans.planname,gymplans.duration,gymmembers.birthdate,gymmembers.anniversarydate from gymmembers join memberplans on gymmembers.memberid=memberplans.memberid join gymplans on memberplans.planid = gymplans.planid where memberplans.status='Active' AND gymmembers.subscriptionid = gymplans.subscriptionid and gymmembers.subscriptionid='"+req.session.subsid+"' and  gymmembers.name like '%"+onname+"%' and gymmembers.mobileno like '%"+onnumber+"%' order by memberplans.startdate desc";
        }
        gymcon.query(sql,function(err,result){
            console.log(sql + " --------memeber report")
            if(err)console.log(err)
            else if(result.length>0){
                out = "<table id='report'><tr><th>Member ID</th><th>Name</th><th>mobileno</th><th>Address1</th><th>city</th><th>Email</th><th>Plan Name</th><th>Duration</th><th>Start Date</th><th>End Date</th><th>Total Fees</th><th>Status</th><th>Birth Date</th><th>Anniversary Date</th><th>Action</th></tr>"
                for(i=0;i<result.length;i++)
                {
                    var birthdate
                    var anniversarydate
                    let sdate = new Date(result[i].startdate);
                    sdate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2)
                    if(sdate === null || sdate === undefined){   
                        sdate = ''
                    }
                    let edate = new Date(result[i].enddate);
                    edate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2)
                    if(edate === null || edate === undefined){
                        edate = ''
                    }
                    if(result[i].birthdate == null || result[i].birthdate == undefined || result[i].birthdate == ""){
                        birthdate = ''
                    }else{
                        birthdate = new Date(result[i].birthdate);
                        birthdate = birthdate.getFullYear() + '-' + ('0' + (birthdate.getMonth() + 1)).slice(-2) + '-' + ('0' + birthdate.getDate()).slice(-2)
                        if(birthdate === null || birthdate === undefined){
                            birthdate = ''
                        }
                    }
                    if(result[i].anniversarydate == '' || result[i].anniversarydate == null || result[i].anniversarydate == undefined){
                        anniversarydate = ''
                    }else{
                        anniversarydate = new Date(result[i].anniversarydate);
                        anniversarydate = anniversarydate.getFullYear() + '-' + ('0' + (anniversarydate.getMonth() + 1)).slice(-2) + '-' + ('0' + anniversarydate.getDate()).slice(-2)
                        if(anniversarydate === null || anniversarydate === undefined){
                            anniversarydate = ''
                        }
                    }
                    out = out + "<tr><td>" +result[i].memberid2+ "</td><td>" + result[i].name+ "</td><td>"+ result[i].mobileno+ "</td><td>"+result[i].Address1 + "</td><td>" + result[i].city + "</td><td>"+result[i].email + "</td><td>" + result[i].planname + "</td><td>" + result[i].duration+ "</td><td>" + sdate + "</td><td>" + edate + "</td><td>" + result[i].amount + "</td><td>"+result[i].status+"</td><td>"+birthdate+"</td><td>"+anniversarydate+"</td><td><button onclick=sendesssage('"+result[i].mobileno+"')><i class='fa fa-whatsapp' style='font-size:24px;'></button></td></tr>"
                }
                out = out + "</table>"
                res.send(out)    
            }else{
                res.send("No Records")
            }
        })
    }else if(req.body.action === 'seepaymentmem'){
        var sdate1 = req.body.sdate
        var edate = req.body.edate
        sdate1=sdate1+" 00:00:00"
        edate = edate+" 23:59:59"
        var sql ="SELECT gymmembers.name,gymmembers.mobileno,gymmembers.memberid2,memberpayments.paymentdate,memberpayments.paymentid,memberpayments.amount,memberpayments.balance,memberpayments.balancedate from gymmembers join memberpayments on gymmembers.memberid=memberpayments.memberid and gymmembers.subscriptionid = memberpayments.subscriptionid where gymmembers.subscriptionid like'"+req.session.subsid+"' and gymmembers.memberid like'"+req.session.userid+"' and memberpayments.paymentdate between '"+sdate1+"' and '"+edate+"' order by memberpayments.paymentdate desc";
        gymcon.query(sql, function(err, results){
            if(err) console.log(err)
            else if(results.length>0){
                let balance;
                let tbalance = 0,tpaymentl = 0;
                out = "<table id='report'><tr><th>Member ID</th><th>Name</th><th>Contact No.</th><th>Payment Date</th><th>Paid Fees</th><th>Due Date</th><th>Balance</th></tr>"
                    for(let i=0;i<results.length;i++){
                        balance = results[i].balance
                        if(balance == ''|| balance==null || balance == undefined || balance=='NaN-aN-aN'){
                            balance=''
                        }else{
                            tbalance += balance
                        }
                        tpaymentl += results[i].amount
                        var sdate= new Date(results[i].paymentdate)
                        var edate = new Date(results[i].balancedate)
                        sdate = sdate.getFullYear()+'-'+("0" + (sdate.getMonth() + 1)).slice(-2)+'-'+("0" + sdate.getDate()).slice(-2)
                        if(sdate == ''|| sdate==null || sdate == 'NaN-aN-aN'){
                            sdate = ''
                        }
                        edate = edate.getFullYear()+'-'+("0" + (edate.getMonth() + 1)).slice(-2)+'-'+("0" + edate.getDate()).slice(-2)
                        if(edate == ''|| edate==null || edate == 'NaN-aN-aN'){
                            edate = ''
                        }                  
                        out = out + "<tr><td onclick=popmemberreport2('"+results[i].mobileno+"')>" + results[i].memberid2 + "</td><td>" + results[i].name+ "</td><td>" + results[i].mobileno + "</td><td>" + sdate + "</td><td>" + results[i].amount + "</td><td>" + edate + "</td><td>" + balance + "</td></tr>"  
                    }
                    out = out + "<tr><td>Total</td><td></td><td></td><td>Total Fees Paid</td><td>"+tpaymentl+"</td><td></td><td></td><td></td></tr></table>"
                    res.send(out)
            }
            else
                res.send("No Data")
           
        })
    }
    else if(req.body.action==='seepaymentreport'){
        var sdate1 = req.body.sdate
        var edate = req.body.edate
        var onname = req.body.onname;
        var numberofrows =req.body.numberofrows;
        var pagenumber=req.body.pagenumber;
        sdate1=sdate1+" 00:00:00"
        edate = edate+" 23:59:59"
        if(onname === null || onname === undefined){
            onname='';
        }
         var onnumber = req.body.onnumber;
        if(onnumber=== null || onnumber === undefined){
           onnumber='';
        }
        var sql ="SELECT gymmembers.name,gymmembers.mobileno,gymmembers.memberid2,memberpayments.paymentdate,memberpayments.paymentid,memberpayments.amount,memberpayments.balance,memberpayments.balancedate from gymmembers join memberpayments on gymmembers.memberid=memberpayments.memberid and gymmembers.subscriptionid = memberpayments.subscriptionid where gymmembers.subscriptionid like'"+req.session.subsid+"' and gymmembers.name like'%"+onname+"%' and gymmembers.mobileno like'%"+onnumber+"%' and memberpayments.paymentdate between '"+sdate1+"' and '"+edate+"' order by memberpayments.paymentdate desc";
        gymcon.query(sql, function(err, results){
            if(err) console.log(err)
            else if(results.length>0){
                let balance;
                let tbalance = 0,tpaymentl = 0;
                out = "<table id='report'><tr><th>Member ID</th><th>Name</th><th>Contact No.</th><th>Payment Date</th><th>Paid Fees</th><th>Due Date</th><th>Balance</th><th>Action</th></tr>"
                    for(let i=0;i<results.length;i++){
                        balance = results[i].balance
                        if(balance == ''|| balance==null || balance == undefined || balance=='NaN-aN-aN'){
                            balance=''
                        }else{
                            tbalance += balance
                        }
                        tpaymentl += results[i].amount
                        var sdate= new Date(results[i].paymentdate)
                        var edate = new Date(results[i].balancedate)
                        sdate = sdate.getFullYear()+'-'+("0" + (sdate.getMonth() + 1)).slice(-2)+'-'+("0" + sdate.getDate()).slice(-2)
                        if(sdate == ''|| sdate==null || sdate == 'NaN-aN-aN'){
                            sdate = ''
                        }
                        edate = edate.getFullYear()+'-'+("0" + (edate.getMonth() + 1)).slice(-2)+'-'+("0" + edate.getDate()).slice(-2)
                        if(edate == ''|| edate==null || edate == 'NaN-aN-aN'){
                            edate = ''
                        }                  
                        out = out + "<tr><td onclick=popmemberreport2('"+results[i].mobileno+"')>" + results[i].memberid2 + "</td><td>" + results[i].name+ "</td><td>" + results[i].mobileno + "</td><td>" + sdate + "</td><td>" + results[i].amount + "</td><td>" + edate + "</td><td>" + balance + "</td><td><button onclick=sendesssage2('"+results[i].paymentid+"')><i class='fa fa-whatsapp' style='font-size:24px;'></button></td></tr>"  
                    }
                    out = out + "<tr><td>Total</td><td></td><td></td><td>Total Fees Paid</td><td>"+tpaymentl+"</td><td>Total Balance</td><td>"+tbalance+"</td><td></td></tr></table>"
                    res.send(out)
            }
            else
                res.send("No Data")
           
        })
    }else if(req.body.action == 'receipt'){
        var rtext
        gymcon.query("select * from orgdetails where subscriptionid like'"+req.session.subsid+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                rtext=""+"*"+result[0].orgname+"* %0a"
            }
        })
        gymcon.query("select memberpayments.paymentdate,memberpayments.amount,memberpayments.balance,memberpayments.balancedate,memberpayments.memberid,gymmembers.memberid2,gymmembers.name,gymmembers.mobileno from memberpayments join gymmembers on memberpayments.memberid = gymmembers.memberid and gymmembers.subscriptionid = memberpayments.subscriptionid where memberpayments.paymentid like'"+req.body.pid+"'",function(err,results){
            if(err) console.log(err)
            else if(results.length>0){
                var sdate= new Date(results[0].paymentdate)
                var edate = new Date(results[0].balancedate)
                sdate = sdate.getFullYear()+'-'+("0" + (sdate.getMonth() + 1)).slice(-2)+'-'+("0" + sdate.getDate()).slice(-2)
                if(sdate == ''|| sdate==null || sdate == 'NaN-aN-aN'){
                    sdate = ''
                }
                edate = edate.getFullYear()+'-'+("0" + (edate.getMonth() + 1)).slice(-2)+'-'+("0" + edate.getDate()).slice(-2)
                if(edate == ''|| edate==null || edate == 'NaN-aN-aN'){
                    edate = ''
                } 
                rtext = rtext+"Dear, "+results[0].name+"%0a"
                rtext = rtext+"Your payment is done successfully for your gym subscription on "+sdate+"%0a"
                rtext = rtext+"Payment Details are as follows %0a"
                rtext = rtext+ "*Member* *ID* *:* "+ results[0].memberid2+"%0a"
                rtext = rtext+"*Payment* *Amount* *:* "+results[0].amount+"%0a"
                rtext = rtext+"*Remaining* *Amount* *:* "+results[0].balance+"%0a"
                rtext = rtext+"*Next* *Due* : "+edate+"%0a"
                rtext = rtext+""
                rtext = "https://wa.me/91" + results[0].mobileno +"?text="+rtext
            }
            res.send(rtext)
        })

    }
    else if(req.body.action==='maxrecords'){
        var onname = req.body.onname;
        var numberofrows =req.body.numberofrows;
        var pagenumber=req.body.pagenumber;
        var startdate = req.body.startdate;
        var enddate = req.body.enddate;
        var reporttype = req.body.reporttype
        if(onname === null || onname === undefined){
            onname='';
        }
         var onnumber = req.body.onnumber;
        if(onnumber=== null || onnumber === undefined){
           onnumber='';
        }
        if(reporttype == 'Anniversary'){
            var sql ="select count(*) as maxrows from gymmembers join memberplans on gymmembers.memberid=memberplans.memberid join gymplans on memberplans.planid = gymplans.planid where memberplans.status='Active' and gymmembers.subscriptionid like'"+req.session.subsid+"' and  gymmembers.name like '%"+onname+"%' and gymmembers.mobileno like '%"+onnumber+"%' AND gymmembers.anniversarydate between '"+startdate+"' AND '"+enddate+"' order by memberplans.startdate desc";
        }else if(reporttype=='Birth Date'){
            var sql ="select count(*) as maxrows from gymmembers join memberplans on gymmembers.memberid=memberplans.memberid join gymplans on memberplans.planid = gymplans.planid where memberplans.status='Active' and gymmembers.subscriptionid like'"+req.session.subsid+"' and  gymmembers.name like '%"+onname+"%' and gymmembers.mobileno like '%"+onnumber+"%' AND gymmembers.birthdate between '"+startdate+"' AND '"+enddate+"' order by memberplans.startdate desc";
        }else{
            var sql ="select count(*) as maxrows from gymmembers join memberplans on gymmembers.memberid=memberplans.memberid join gymplans on memberplans.planid = gymplans.planid where memberplans.status='Active' and gymmembers.subscriptionid like'"+req.session.subsid+"' and  gymmembers.name like '%"+onname+"%' and gymmembers.mobileno like '%"+onnumber+"%' order by memberplans.startdate desc";
        }
         gymcon.query(sql, function(err, results){
            console.log(sql + " member report ")
            if(err) console.log(err)
            else if(results.length>0){
                var maxrows = results[0].maxrows; 
                res.send("r"+maxrows)
            }
            else
                res.send("No Data")
           
        })
    }else if(req.body.action === 'getnames'){
        var sql ="SELECT name FROM gymmembers WHERE subscriptionid like'"+req.session.subsid+"' order by name desc";
        gymcon.query(sql, function(err, results){
           if(err) console.log(err)
           else if(results.length>0){
               var rs = []
               for(i=0;i<results.length;i++)
               {
                   rs.push(results[i].name)
               }
               res.send(rs)
           }
           else{
                res.send("No Data") 
           }
       })  
    }else if(req.body.action === "addcards"){
        let cardname = req.body.cardname
        let newid = uuidv4()
        gymcon.query("select cardname from gymcards where subscriptionid like'"+req.session.subsid+"' and cardname like '"+cardname+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                res.send("dublicate")
            }else{
                gymcon.query("insert into gymcards(subscriptionid,cardid,cardname)values('"+req.session.subsid+"','"+newid+"', '"+cardname+"')", function(err,result){
                    if(err)console.log(err)
                    else if(result.affectedRows>0){
                        res.send("successful")
                    }else{
                        res.send("unsuccessful")
                    }
                })
            }
        })
    }else if(req.body.action==='getcardnames'){
        gymcon.query("select cardname from gymcards where subscriptionid like'"+req.session.subsid+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let rsp = []
               for(i=0;i<result.length;i++)
               {
                
                   rsp.push(result[i].cardname)
               }
               res.send(rsp)
            }else{
                res.send("no")
            }
        })
    }
    else if(req.body.action === 'getexercise'){
        gymcon.query("select exercisesname from gymexercises ORDER BY exercisesname ASC ",function(error,result){
            if(error) console.log(error)
            else if(result.length>0){
                let info = []
                for(i=0;i<result.length;i++)
                {
                    info.push(result[i].exercisesname)
                }
                res.send(info)
            }else{
                res.send("no data")
            }
        })
    }else if(req.body.action === 'addexercise'){
        var sql ="insert into gymcarddetails(cardid,sequence,excerciseid,repetition,weight,times,day)values((select cardid from gymcards where subscriptionid like'"+req.session.subsid+"' and cardname like'"+req.body.cardname+"'), '"+req.body.seq+"',(select exerciseid from gymexercises where exercisesname like'"+req.body.exercisename+"'),'"+req.body.rep+"','"+req.body.weight+"','"+req.body.times+"','"+req.body.exerday+"')";
        gymcon.query(sql,function(err, results){
            console.log(sql + "  - gymcarddetails")
            if(err) console.log(err)
            else if(results.affectedRows>0){
                res.send("successful")
            }else{
                res.send("Unsuccessful")
            }
        })
    }else if(req.body.action == "workoutmember"){
        var tbltext=""
       gymcon.query("select orgname from orgdetails where subscriptionid like'"+req.session.subsid+"'", function(err,results){
           if(err) console.log(err);
           else{
                orgname = results[0].orgname
           }
            gymcon.query("Select gymmembers.name,gymbmireport.bmr,gymmembers.mobileno,gymbmireport.age,gymbmireport.fat,gymbmireport.weight,gymbmireport.height,gymbmireport.bmi,membercard.programmer,membercard.assigneddate,membercard.cardid from gymmembers join gymbmireport on gymmembers.subscriptionid=gymbmireport.subscriptionid and gymmembers.memberid2=gymbmireport.memberid2 join membercard on gymmembers.subscriptionid=membercard.subscriptionid and gymmembers.memberid2=membercard.memberid where gymmembers.subscriptionid like'"+req.session.subsid+"' and gymmembers.memberid like'"+req.session.userid+"' and membercard.assigneddate in(select max(membercard.assigneddate) from membercard where membercard.subscriptionid like '"+req.session.subsid+"' and membercard.memberid in(select memberid2 from gymmembers where subscriptionid like'"+req.session.subsid+"' and memberid like'"+req.session.userid+"')) order by gymbmireport.date desc",function(err,result){
                if(err) console.log(err)
                else if(result.length>0){
                    console.log(result[0].assigneddate)
                    let dassign = new Date(result[0].assigneddate)
                    dassign = dassign.getFullYear() + '-' + ('0' + (dassign.getMonth() + 1)).slice(-2) + '-' + ('0' + dassign.getDate()).slice(-2);
                    tbltext = "<table id='gymcard23' style='border:1px solid black; border-collapse: collapse;' cellspacing='0' cellpadding='0' align='center'><tr><td></td></tr>"    
                    tbltext = tbltext + "<tr height='100px'><td style='text-align:left;'><img src='/getlogogym/"+req.session.subsid+".png' style='height:80px; width:80px;' onerror=this.style.display=none></td><td colspan='5'align='center' style='text-align:center; padding-right:50px'><h2 style='color:black; font-size:20px;'>"+orgname+"</h2></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' cellspacing='0' cellpadding='0'></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Name:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>"+result[0].name+"</b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>BMI Report</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Contact:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>"+result[0].mobileno+"</b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>AGE:</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].age+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Issue Date:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>"+dassign+"</b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>HEIGHT:</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].height+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Programmer:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>"+result[0].programmer+"</b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Weight:</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].weight+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>FAT:</b></td></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].fat+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black;; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>BMR:</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].bmr+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black;; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>BMI</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].bmi+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' cellspacing='0' cellpadding='0'></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse; text-align:center;'><td align='center' style='text-align:center; font-size:15px;'><b>EXERCISE Day 1</b></td></tr>"
                    tbltext = tbltext + "<tr  style='border:1px solid black; border-collapse: collapse;'><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Categories</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>exercisesname</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Sequence</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Repetition</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>times</b></td></tr>"                
                    let sql2="select gymcards.cardname,gymcarddetails.sequence,gymcarddetails.excerciseid,gymcarddetails.repetition,gymcarddetails.weight,gymcarddetails.times,gymcarddetails.day,gymexercises.exercisesname,gymexercises.exercisesdescription,gymexercises.categories from gymcards join gymcarddetails on gymcards.cardid = gymcarddetails.cardid join gymexercises on gymcarddetails.excerciseid=gymexercises.exerciseid where gymcards.subscriptionid like'"+req.session.subsid+"' and gymcards.cardname='"+result[0].cardid+"' order by gymcarddetails.day,gymcarddetails.sequence"
                    gymcon.query(sql2,function(err,results){
                        console.log(sql2)
                        if(err) console.log(err)
                        else{
                            if(results.length>0){
                                //out = "<table id='report'> <caption style='text-align:center; font-weight: bold; font-size:15px;'>"+results[0].cardname+"</caption><tr><th>Day</th><th>categories</th><th>Exercise Name</th><th>Sequence</th><th>Repetition</th><th>Times</th></tr>"
                                var day = "Day 1"
                                for(i=0;i<results.length;i++)
                                {             
                                    if(results[i].day == day){
                                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;'><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].categories+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].exercisesname+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].sequence+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].repetition+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].times+"</td></tr>"
                                    }else{
                                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse; text-align:center;'><td align='center' style='text-align:center; font-size:15px;'><b>EXERCISE "+results[i].day+"</b></td></tr>"
                                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;'><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].categories+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].exercisesname+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].sequence+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].repetition+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].times+"</td></tr>"
                                        day = results[i].day
                                    }
                                }
                                tbltext=tbltext+"</table>"
                                res.send(tbltext)
                            }else{
                                res.send("No Data")
                            }
                        }
                    })
                }else{
                    res.send("Member ID Not Found")
                }
                
            })
       })
    }else if(req.body.action == "preassignedcard"){
       let programmer = req.body.programmer    
       let memberid = req.body.memberid
       let cardname = req.body.cardname
       var today = new Date();
       var orgname = ''
       today = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
       var tbltext=""
       gymcon.query("select orgname,logoid from orgdetails where subscriptionid like'"+req.session.subsid+"'", function(err,results){
           if(err) console.log(err);
           else{
                orgname = results[0].orgname
           }
           var sql ="Select gymmembers.name,gymbmireport.bmr,gymmembers.mobileno,gymbmireport.age,gymbmireport.fat,gymbmireport.weight,gymbmireport.height,gymbmireport.bmi from gymmembers join gymbmireport on gymmembers.subscriptionid=gymbmireport.subscriptionid and gymmembers.memberid2=gymbmireport.memberid2 where gymmembers.subscriptionid like'"+req.session.subsid+"' and gymmembers.memberid2 like'"+memberid+"' order by gymbmireport.date desc";
            gymcon.query(sql,function(err,result){
                console.log(sql + " - preassignedcard")
                if(err) console.log(err)
                else if(result.length>0){
                    tbltext = "<table id='gymcard23' style='border:1px solid black; border-collapse: collapse;' cellspacing='0' cellpadding='0' align='center'><tr><td></td></tr>"    
                    tbltext = tbltext + "<tr height='100px'><td style='text-align:left;'><img src='/getlogogym/"+req.session.subsid+".png' style='height:80px; width:80px;' onerror=this.style.display=none></td><td colspan='5'align='center' style='text-align:center; padding-right:50px'><h2 style='color:black; font-size:20px;'>"+orgname+"</h2></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' cellspacing='0' cellpadding='0'></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Name:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>"+result[0].name+"</b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>BMI Report</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Contact:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>"+result[0].mobileno+"</b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>AGE:</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].age+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Issue Date:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>"+today+"</b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>HEIGHT:</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].height+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Programmer:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>"+programmer+"</b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Weight:</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].weight+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>FAT:</b></td></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].fat+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black;; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>BMR:</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].bmr+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black;; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>BMI</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b>"+result[0].bmi+"</b></td></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' cellspacing='0' cellpadding='0'></tr>"
                    tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse; text-align:center;'><td align='center' style='text-align:center; font-size:15px;'><b>EXERCISE Day 1</b></td></tr>"
                    tbltext = tbltext + "<tr  style='border:1px solid black; border-collapse: collapse;'><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Categories</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>exercisesname</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Sequence</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Repetition</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>times</b></td></tr>"                
                    gymcon.query("select gymcards.cardname,gymcarddetails.sequence,gymcarddetails.excerciseid,gymcarddetails.repetition,gymcarddetails.weight,gymcarddetails.times,gymcarddetails.day,gymexercises.exercisesname,gymexercises.exercisesdescription,gymexercises.categories from gymcards join gymcarddetails on gymcards.cardid = gymcarddetails.cardid join gymexercises on gymcarddetails.excerciseid=gymexercises.exerciseid where subscriptionid like'"+req.session.subsid+"' and cardname='"+cardname+"' order by gymcarddetails.day,gymcarddetails.sequence",function(err,results){
                        if(err) console.log(err)
                        else{
                            if(results.length>0){
                                //out = "<table id='report'> <caption style='text-align:center; font-weight: bold; font-size:15px;'>"+results[0].cardname+"</caption><tr><th>Day</th><th>categories</th><th>Exercise Name</th><th>Sequence</th><th>Repetition</th><th>Times</th></tr>"
                                var day = "Day 1"
                                for(i=0;i<results.length;i++)
                                {             
                                    if(results[i].day == day){
                                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;'><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].categories+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].exercisesname+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].sequence+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].repetition+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].times+"</td></tr>"
                                    }else{
                                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse; text-align:center;'><td align='center' style='text-align:center; font-size:15px;'><b>EXERCISE "+results[i].day+"</b></td></tr>"
                                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;'><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].categories+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].exercisesname+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].sequence+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].repetition+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].times+"</td></tr>"
                                        day = results[i].day
                                    }
                                }
                                tbltext=tbltext+"</table>"
                                res.send(tbltext)
                            }else{
                                res.send("No Data");
                            }
                        }
                    })
                }else{
                    res.send("FIrst Add This Member BMI");
                }
                
            })
       })
    }
    else if(req.body.action === 'previewcard'){
        gymcon.query("select gymcards.cardid,gymcards.cardname,gymcarddetails.sequence,gymcarddetails.excerciseid,gymcarddetails.repetition,gymcarddetails.weight,gymcarddetails.times,gymcarddetails.day,gymexercises.exercisesname,gymexercises.exercisesdescription,gymexercises.categories from gymcards join gymcarddetails on gymcards.cardid = gymcarddetails.cardid join gymexercises on gymcarddetails.excerciseid=gymexercises.exerciseid where subscriptionid like'"+req.session.subsid+"' and cardname='"+req.body.cardname+"' order by gymcarddetails.day,gymcarddetails.sequence",function(err,results){
            if(err) console.log(err)
            else{
                if(results.length>0){
                    tbltext=""
                    tbltext = "<table id='gymcard23' style='border:1px solid black; border-collapse: collapse;' cellspacing='0' cellpadding='0' align='center'><tr><td></td></tr>"    
                        tbltext = tbltext + "<tr height='100px'><td style='text-align:left;'><img src='/getlogogym/"+req.session.subsid+".png' style='height:80px; width:80px;' onerror=this.style.display=none></td><td colspan='5'align='center' style='text-align:center; padding-right:50px'><h2 style='color:black; font-size:20px;'>GOLD'S GYM</h2></td></tr>"
                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' cellspacing='0' cellpadding='0'></tr>"
                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Name:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b></b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>BMI Report</b></td></tr>"
                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Contact:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b></b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>AGE:</b></td></tr>"
                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Issue Date:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b></b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>HEIGHT:</b></td></tr>"
                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Programmer:</b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b></b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Weight:</b></td></tr>"
                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>FAT:</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td></tr>"
                        tbltext = tbltext + "<tr style='border:1px solid black;; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td align='right' style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>BMR:</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td></tr>"
                        tbltext = tbltext + "<tr style='border:1px solid black;; border-collapse: collapse;' ><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td colspan='2' align='right' style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>BMI</b></td><td style='text-align:left; font-size:15px; border:none; border-collapse: collapse;'><b></b></td></tr>"
                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;' cellspacing='0' cellpadding='0'></tr>"
                        tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse; text-align:center;'><td align='center' style='text-align:center; font-size:15px;'><b>EXERCISE Day 1</b></td></tr>"
                        tbltext = tbltext + "<tr  style='border:1px solid black; border-collapse: collapse;'><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Action</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Categories</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>exercisesname</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Sequence</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>Repetition</b></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><b>times</b></td></tr>"              
                    //out = "<table id='report'> <caption style='text-align:center; font-weight: bold; font-size:15px;'>"+results[0].cardname+"</caption><tr><th>Day</th><th>categories</th><th>Exercise Name</th><th>Sequence</th><th>Repetition</th><th>Times</th></tr>"
                    var day = "Day 1"
                    for(i=0;i<results.length;i++)
                    {             
                        if(results[i].day == day){
                            var days2 = results[i].day
                            days2 = days2.replace(/\s/g, '')
                            tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;'><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><button onclick=removeexercises('"+results[i].excerciseid+"','"+results[i].cardid+"','"+days2+"')>X</button></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].categories+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].exercisesname+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].sequence+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].repetition+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].times+"</td></tr>"
                        }else{
                            var days2 = results[i].day
                            days = days2.replace(/\s/g, '')
                            tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse; text-align:center;'><td align='center' style='text-align:center; font-size:15px;'><b>EXERCISE "+results[i].day+"</b></td></tr>"
            
                            tbltext = tbltext + "<tr style='border:1px solid black; border-collapse: collapse;'><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'><button onclick=removeexercises('"+results[i].excerciseid+"','"+results[i].cardid+"','"+days+"')>X</button></td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].categories+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].exercisesname+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].sequence+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].repetition+"</td><td style='text-align:left; font-size:15px; border:1px solid black; border-collapse: collapse;'>"+results[i].times+"</td></tr>"
                            day = results[i].day
                        }
                    }
                    tbltext=tbltext+"</table>"
                    res.send(tbltext)
                }else{
                    res.send("No Data")
                }
            }
        })
    }else if(req.body.action==="removeexercises"){
        var txt1=req.body.day
        var txt2 = txt1.slice(0, 3) + " " + txt1.slice(3);
        console.log(txt2)
            gymcon.query("delete from gymcarddetails where cardid like'"+req.body.cardid+"' and excerciseid like'"+req.body.execiesseid+"' and day like'"+txt2+"'",function(error,result){
            if(error) console.log(error)
            else if(result.affectedRows>0){
                res.send("Exercise Removed Successfully")
            }else{
                res.send("Error Happend")
            }
        })
    }else if(req.body.action == "assignworkoutcard"){
        var newid = uuidv4()
        let path = "./userdata/gymdata/"+req.session.subsid+"/gymworkoutcard/" 
        let cardname = req.body.cardname
        let memberid = req.body.memberid
        let programmer = req.body.programmer
        let pdate2 = new Date()
        let pdate = pdate2.getFullYear()+'-'+("0" + (pdate2.getMonth() + 1)).slice(-2)+'-'+("0" + pdate2.getDate()).slice(-2) +" "+pdate2.getHours()+':'+pdate2.getMinutes()+':'+pdate2.getSeconds();
        let image = req.body.image
        gymcon.query("select memberid2 from gymmembers where subscriptionid like'"+req.session.subsid+"' and memberid2 like'"+memberid+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                if(image === ''|| image == null || image == undefined){
                    res.send("Please Create Card First")
                }else{
                    if (fs.existsSync("./userdata/gymdata/" + req.session.subsid)){
                }
                else{
                    fs.mkdir("./userdata/gymdata/" + req.session.subsid, function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                        }
                    })
                    }
                    if (fs.existsSync("./userdata/gymdata/"+req.session.subsid+"/gymworkoutcard")){
                    }
                    else{
                    fs.mkdir("./userdata/gymdata/"+req.session.subsid+"/gymworkoutcard", function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                        }
                    })
                    }
                    var optionalObj = {'fileName': newid, 'type':'png'};
                    base64ToImage(image,path,optionalObj);
                    gymcon.query("insert into membercard(subscriptionid,cardid,memberid,programmer,cardlink,assigneddate)values('"+req.session.subsid+"','"+cardname+"','"+memberid+"','"+programmer+"','"+newid+"','"+pdate+"')",function(err,result){
                        if(err) console.log(err)
                        else if(result.affectedRows>0){
                            res.send("Successful")
                        }else{
                            res.send("Unsucessful")
                        }    
                    })
                }
            }else{
                res.send("Please Enter Valid ID")
            }
        })
       
    }else if(req.body.action==='removeexercise'){
        gymcon.query("delete from gymcarddetails where excerciseid like'"+req.body.id+"' and cardid in(select cardid from gymcards where subscriptionid like'"+req.session.subsid+"' and cardname like'"+req.body.cardname+"')",function(err,result){
            if(err) console.log(err)
            else if(result.affectedRows>0){
                res.send("Successful")
            }else{
                res.send("Uncessful")
            }    
        })
    }
    else if(req.body.action === 'opengymaccount'){
        mcon.query("select * from subscriptions where subscriptionid='" + req.session.subsid + "' and moduleid=8", function(err, results){
            console.log(results)
            if(err) console.log(err)  
            else{
                if(results.length>0){
                    acc = [];
                    var date_ob = new Date();
                    let date = new Date(results[0].enddate)
                    var diff = date.getTime() - date_ob.getTime()  
                    var daydiff = diff / (1000 * 60 * 60 * 24)
                    console.log(daydiff)
                    if(daydiff>0){
                        acc.push("Active")
                        let days = Math.round(daydiff)
                        acc.push(days)
                    }
                    else{
                        acc.push("dective")
                        let days = 0
                        acc.push(days)
                    }
                    acc.push(results[0].startdate);
                    acc.push(results[0].enddate);
                    acc.push(results[0].usedquota);
                    acc.push(results[0].quota)
                    res.send(acc);
                }
                else{
                    res.send("error")
                }
            }       
        })
    }
    else if(req.body.action === "showmyplans"){
        gymcon.query("select memberplans.planid,memberplans.startdate,memberplans.enddate,memberplans.fee,memberplans.discount,memberplans.amount,memberplans.status,gymplans.planname,gymplans.duration from memberplans join gymplans on memberplans.planid = gymplans.planid where memberplans.subscriptionid like'"+req.session.subsid+"' and memberplans.memberid in(select memberid from gymmembers where mobileno like '"+req.body.membermobile+"' and subscriptionid like '"+req.session.subsid+"') order by startdate desc", function(err, results){
            if(err){
                console.log(err)
            }
            else if(results.length>0){
                var rs = []
                    for(i=0;i<results.length;i++)
                    {
                        rs.push(results[i])
                    }
                    res.send(rs)
            }
            else{
                res.send("No Data")
            }
        })
    }
    else if(req.body.action === 'saveimage'){
        let memberid = req.body.memberid
        //var km = req.body.mimage.replace(/^data:image\/png;base64,/, "");
        //res.sendFile(__dirname + "/userdata/gymdata/" + km +'.png')
        if(memberid != '' && memberid === undefined){
            res.send("Please search member first")
        }
        else{
            var path ='./userdata/gymdata/'+req.session.subsid+"/gympictures/";
            if (fs.existsSync("./userdata/gymdata/" + req.session.subsid)){
       }
       else{
           fs.mkdir("./userdata/gymdata/" + req.session.subsid, function(err) {
               if (err) {
                 console.log(err)
               } else {
               }
           })
           fs.mkdir("./userdata/gymdata/" +req.session.subsid+"/gymfiles", function(err) {
            if (err) {
              console.log(err)
            } else {
            }
        })
        fs.mkdir("./userdata/gymdata/" +req.session.subsid+"/gympictures", function(err) {
            if (err) {
              console.log(err)
            } else {
            }
        })
       }
            var optionalObj = {'fileName': memberid, 'type':'png'};
            base64ToImage(req.body.mimage,path,optionalObj);
            res.send("Profile photo saved")
        }
        
        /*
        fs.sendFile("./userdata/gymdata/out.png", base64Data, 'base64', function(err) {
            console.log(err);
        });*/
    }
    else if(req.body.action === "savebmi"){
        console.log("far away")
        var bmiid = uuidv4()
        var date_ob = new Date();
        var currentdate = date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2)
        gymcon.query("select memberid2 from gymmembers where subscriptionid like'"+req.session.subsid+"' and memberid2 like'"+req.body.mid2+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                gymcon.query("insert into gymbmireport(memberid2,subscriptionid,age,fat,weight,height,bmi,date,bmiid,bmr) values('"+req.body.mid2+"', '"+req.session.subsid+"', '"+req.body.mage+"', '"+req.body.mfat+"', '"+req.body.mheight+"', '"+req.body.mweight+"', '"+req.body.mbmi+"', '"+currentdate+"', '"+bmiid+"','"+req.body.mbmr+"')", function(err, result){
                    if(err){
                        console.log(err)
                        res.send("Error occured please check id")
                    } 
                    else{
                        res.send("BMI report is added")
                    }
                })
            }else{
                res.send("Please Check Member ID")
            }          
        }) 
    } 
    else if(req.body.action === "insertmemberdetails"){
        console.log("Here")
        var date_ob = new Date();
        var currentdate = date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2);
        console.log(currentdate)
        let foldadd = "./userdata/gymdata/"+req.session.subsid+"/gymfiles/"+req.session.userid+".csv"
        let filename = ''
        setTimeout(() => {
            let fn = foldadd+filename
            console.log(fn)
            let count = 0;
            let dcount = 0;
            csvtojson().fromFile(fn).then(source =>{
                for (var i = 0; i < source.length; i++){
                    let contactno = source[i].ContactNumber; 
                    let name = source[i].Name;
                    let email = source[i].Email || '' ;                  ;
                    let memberid2 = source[i].MemberID;
                    console.log(memberid2 + " %%%%%%")
                    let address1 = source[i].Address1 || '';
                    let address2 = source[i].Address2 || ''; 
                    let pin = source[i].Pin || ''; 
                    let city = source[i].City || ''; 
                   // var newId = uuidv4();
                    console.log(contactno + " "+name)   
                    if(contactno != "" && name != ""){                  
                        gymcon.query("select * from gymmembers where subscriptionid like'"+req.session.subsid+"' and memberid2 like'"+memberid2+"'", function(err, results){
                           if(err) {
                               console.log(err)
                           }else if(results.length > 0){
                            console.log("memberid already exit ")
                            dcount +=1;
                            // var sql2 ="update gymmembers set name='"+name+"', Address1='"+address1+"', Address2='"+address2+"', city='"+city+"', pin='"+pin+"', email='"+email+"' where subscriptionid like'"+req.session.subsid+"' and memberid2 like'"+memberid2+"'";
                            // console.log(sql2 + " update upload file ")    
                            // gymcon.query(sql2, function(err, results1){
                            //         if(err) console.log(err)
                            //         else{
                            //             dcount +=1;
                            //         }
                            //     })
                            }
                            else{
                                var sql = " select * from usermaster_t.users where mobile='"+contactno+"'";
                                mcon.query(sql,function(err,result){
                                    console.log(sql + " mcon check user ")
                                    if(err){
                                        console.log(err)
                                    }else if(result.length>0){
                                        let userid = result[0].userid;                                        
                                        // var newId = uuidv4();
                                        var sql3="INSERT INTO gymmembers(subscriptionid,memberid,name,mobileno,Address1,Address2,city,pin,email,memberid2)VALUES('"+req.session.subsid+"', '"+userid+"', '"+name+"', '"+contactno+"', '"+address1+"', '"+address2+"', '"+city+"', '"+pin+"', '"+email+"','"+memberid2+"')";
                                        gymcon.query(sql3, function(err, results2){
                                        console.log(sql3 + " - insert upload file")
                                        if(err) console.log(err)
                                        else
                                            count +=1;
                                    }) 
                                    }else{
                                        var userid3 = uuidv4();
                                        var sql6 = "Insert Into usermaster_t.users(userid,name,password,mobile,email) values('"+userid3+"','"+name+"','"+contactno+"','"+contactno+"','"+email+"') ";
                                        mcon.query(sql6,function(err,result1){
                                            console.log(sql6 + " sql6 0000000000000")
                                            if(err){
                                                console.log(err)
                                            }else{
                                                // var newId = uuidv4();
                                                var sql3="INSERT INTO gymmembers(subscriptionid,memberid,name,mobileno,Address1,Address2,city,pin,email,memberid2)VALUES('"+req.session.subsid+"', '"+userid3+"', '"+name+"', '"+contactno+"', '"+address1+"', '"+address2+"', '"+city+"', '"+pin+"', '"+email+"','"+memberid2+"')";
                                                gymcon.query(sql3, function(err, results2){
                                                console.log(sql3 + " - insert upload file")
                                                if(err) console.log(err)
                                                else
                                                    count +=1;
                                            }) 
                                            count +=1;
                                            }
                                        })
                                    }
                                })
                                
                            }
                        })
                    }                       
                }
                setTimeout(() => {
                    res.send("Total members are "+ count +" Existed Members are "+dcount) 
                }, 3000);
            }) 
        }, 4000);
    }
    else if(req.body.action === 'insertmemberdetails2'){
        let count = 0;
        let dcount = 0;
        let foldadd = "./userdata/gymdata/"+req.session.subsid+"/gymfiles/"+req.session.userid+".csv"
        let filename = '';
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        const myPromise = new Promise((resolve, reject) => {
            let fn = foldadd
            console.log(fn)
            csvtojson().fromFile(fn).then(source => {
                for (var i = 0; i < source.length; i++) {
                    var newId = uuidv4();
                    let MemberID = source[i].MemberID 
                    let PaymentDate = source[i].PaymentDate || '';
                    let Balancedate = source[i].NextDueDate || '';  
                    let paid = source[i].PaidAmount || '';
                    let balance = source[i].RemainingAmount || '';
                    let pdate2 = new Date(PaymentDate)
                    let pdate = pdate2.getFullYear()+'-'+("0" + (pdate2.getMonth() + 1)).slice(-2)+'-'+("0" + pdate2.getDate()).slice(-2);

                    console.log(pdate + " - sdata")
                        if(pdate.match(regex)){
                            pdate = pdate
                        }else{
                            res.send("Incorrect date formate, Date formate must be yyyy-mm-dd")
                            return;
                        }

                    let bdate2 = new Date(Balancedate);
                    let bdate = bdate2.getFullYear()+'-'+("0" + (bdate2.getMonth() + 1)).slice(-2)+'-'+("0" + bdate2.getDate()).slice(-2);
                    console.log(bdate + " - sdata")
                    if(bdate.match(regex)){
                        bdate = bdate
                    }else{
                        res.send("Incorrect date formate, Date formate must be yyyy-mm-dd")
                        return;
                    }

                    if((MemberID != null || MemberID != '' || MemberID != undefined || MemberID != 'undefined')  && (pdate !='null' || pdate !=null || pdate !='undefined' || pdate !=undefined || bdate !='null' || bdate !=null || bdate !='undefined' || bdate !=undefined))
                    {                    
                       
                        gymcon.query("select memberid2 from gymmembers where memberid2 like'"+MemberID+"' and subscriptionid like '"+req.session.subsid+"'",function(err, data){
                            if(err) console.log(err)
                            else if(data.length>0){
                        var sql ="insert into memberpayments(subscriptionid,memberid,paymentdate,amount,balance,balancedate,paymentid)values('"+req.session.subsid+"',(select memberid from gymmembers where memberid2 like '"+MemberID+"' and subscriptionid like'"+req.session.subsid+"'), '"+pdate+"', '"+paid+"', '"+balance+"', '"+bdate+"', '"+newId+"')";
                                gymcon.query(sql, function(err, result){
                                    console.log(sql +" balance $$$")
                                    if(err){
                                        console.log(err)
                                        dcount +=1;
                                    } 
                                    else{
                                        count +=1;
                                    } 
                                })
                            }else{
                                dcount +=1;
                            }
                        })
                    }else{
                        console.log(" file upload data , id error")
                        dcount +=1;
                    }
                }
            })
        }).then(()=>{
            res.send("Total payment records are "+ count +" Member not exists "+dcount) 
        })
    }
    else if(req.body.action === "insertmemberdetails3"){
        let num = 0;
        let count = 0;
        let dcount = 0;
        let pcount = 0;
        let foldadd = "./userdata/gymdata/"+req.session.subsid+"/gymfiles/"+req.session.userid+".csv"
        let filename = ''
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        const myPromise = new Promise(async function(resolve, reject) {
            let fn = foldadd
            console.log(fn + " -fn")
            try {
                await csvtojson().fromFile(fn).then(source => {
                    console.log(source.length+" ---")
                    for (var i = 0; i < source.length; i++) {
                        console.log(i +"  ****")
                        num +=1;
                        var newId = uuidv4();
                        let MemberID = source[i].MemberID;
                        let PlanName = source[i].PlanName;
                        let Fees = source[i].Fees || '';
                        let Discount = source[i].Discount || '';
                        let Amount = source[i].TotalAmount || '';
                        let Status = source[i].Status || '';
                        let pdate2 = new Date(source[i].StartDate) || '';
                        console.log(MemberID + " -MemberID -" + " " + PlanName + " planname" + " " + Fees + " Fees" + " " + Discount + " " + Amount + " " + Status + " " + pdate2)

                        let sdate = pdate2.getFullYear()+'-'+("0" + (pdate2.getMonth() + 1)).slice(-2)+'-'+("0" + pdate2.getDate()).slice(-2) ;
                        if (!isNaN(pdate2.getTime())) {
                            // Construct the valid date string for insertion into the database
                            sdate = pdate2.getFullYear() + '-' + ("0" + (pdate2.getMonth() + 1)).slice(-2) + '-' + ("0" + pdate2.getDate()).slice(-2) ;
                        }
                        if(sdate==''||sdate==null||sdate==undefined || sdate=='NaN-aN-aN'|| sdate=='NaN-aN-aN NaN:NaN:NaN'){
                            sdate = ''
                        }
                        console.log(sdate + " - sdata")
                        if(sdate.match(regex)){
                            sdate = sdate
                        }else{
                            res.send("Incorrect date formate, Date formate must be yyyy-mm-dd")
                            return;
                        }
                
                        let bdate2 = new Date(source[i].EndDate) || '';
                        let edate = bdate2.getFullYear()+'-'+("0" + (bdate2.getMonth() + 1)).slice(-2)+'-'+("0" + bdate2.getDate()).slice(-2) ;
                        if(edate==''||edate==null||edate==undefined || edate=='NaN-aN-aN'|| edate=='NaN-aN-aN NaN:NaN:NaN'){
                            edate = ''
                        }
                        console.log(edate + " - edata")
                        if(edate.match(regex)){
                            edate = edate
                        }else{
                            res.send("Incorrect date formate , Date formate must be yyyy-mm-dd")
                            return;
                        }
            

                        if((MemberID != null || MemberID != '' || MemberID != undefined || MemberID != 'undefined') && (sdate !='null' || sdate !=null || sdate !='undefined' || sdate !=undefined || edate !='null' || edate !=null || edate !='undefined' || edate !=undefined)){           
                            console.log(MemberID + " .... " + sdate + " " + edate)

                            gymcon.query("select memberid2 from gymmembers where memberid2 like'"+MemberID+"' and subscriptionid like '"+req.session.subsid+"'",function(err, data){
                                if(err) console.log(err)
                                else if(data.length>0){
                                    gymcon.query("(select planid from gymplans where planname like '"+PlanName+"' and subscriptionid like '"+req.session.subsid+"')",function(err,result12){
                                        if(err) console.log(err)
                                        else if(result12.length>0){
                                    console.log(MemberID + " member id in query--------")
                                    var sql56 = "select * from memberplans where memberid in(select memberid from gymmembers where memberid2 like '"+MemberID+"' and subscriptionid like '"+req.session.subsid+"') and planid in(select planid from gymplans where planname like '"+PlanName+"' and subscriptionid like '"+req.session.subsid+"')";
                                            gymcon.query(sql56, function(err, results){
                                                console.log(sql56 + " sql 56 select query ____________________________")
                                                if(err) console.log(err)
                                                else if(results.length > 0)
                                                {
                                                    // var sql="update memberplans set status='Deactivate' where memberid in(select memberid from gymmembers where memberid2 like '"+MemberID+"' and subscriptionid like '"+req.session.subsid+"') and status like 'Active' and subscriptionid like'"+req.session.subsid+"'";
                                                    // console.log(sql + " update query first part")
                                                    // gymcon.query(sql, function(err, results1){
                                                    //     if(err) console.log(err)
                                                    //     else{
                                                    //         var sql="update memberplans set startdate='"+sdate+"', enddate='"+edate+"', fee='"+Fees+"', discount='"+Discount+"', amount='"+Amount+"', status='Active' where  memberid in(select memberid from gymmembers where memberid2 like '"+MemberID+"' and subscriptionid like '"+req.session.subsid+"') and planid in(select planid from gymplans where planname like '"+PlanName+"' and subscriptionid like '"+req.session.subsid+"') and subscriptionid like'"+req.session.subsid+"'";
                                                    //         console.log(sql + " update query first part inside else")
                                                    //         gymcon.query(sql, function(err, results2){
                                                    //             if(err) console.log(err)
                                                    //             else{
                                                    //                 console.log(" already exit same member one plan");
                                                    //                 count += 1;
                                                    //                 // console.log(results2)
                                                    //                 // count += 1;
                                                    //             }
                                                    //         })
                                                    //     }
                                                    // })
                                                    console.log("already exist*************")
                                                    
                                                }
                                                else{
                                                    // var sql="update memberplans set status='Deactivate' where memberid in(select memberid from gymmembers where memberid2 like '"+MemberID+"' and subscriptionid like '"+req.session.subsid+"') and status like 'Active' and subscriptionid like'"+req.session.subsid+"'";
                                                    // console.log(sql +" update query in else part")

                                                    // gymcon.query(sql, function(err, results3){
                                                    //     if(err) console.log(err)
                                                    //     else{
                                                            // console.log(results3)
                                                            var sql ="insert into memberplans(subscriptionid,memberid,planid,startdate,enddate,fee,discount,amount,memberid2,status) values('"+req.session.subsid+"',(select memberid from gymmembers where memberid2 like '"+MemberID+"' and subscriptionid like '"+req.session.subsid+"'), (select planid from gymplans where planname like '"+PlanName+"' and subscriptionid like '"+req.session.subsid+"'), '"+sdate+"', '"+edate+"', '"+Fees+"', '"+Discount+"', '"+Amount+"','"+MemberID+"', '"+Status+"')";
                                                            gymcon.query(sql, function(err, result){
                                                                console.log(sql + " insert query in else part")
                                                                if(err) console.log(err)
                                                                else{
                                                                    count += 1;
                                                                }
                                                            })
                                                    //     }
                                                    // })
                                                }
                                            })                                 
                                        }else{
                                            pcount +=1
                                        }
                                    })
                                }else{
                                    console.log(" plan not exist...")
                                    dcount +=1;
                                }              
                            })         
                        }else{
                            console.log(" error on file upload $$$$$")
                            dcount +=1;
                        }
                    }
                    resolve();
                })
            } catch (error) {
                console.log(error)
            }
        })
        myPromise.then(()=>{
            res.send("Records Saved") 
        }).catch(function(err) {
            // Run this when promise was rejected via reject()
            console.log(err)
        })
    }
    else if (req.body.action === "searchgymplan") {
        gymcon.query("select * from gymplans where subscriptionid like '"+req.session.subsid+"' and planname like '"+req.body.planname+"'", function(err,result) {
            if(err) {
                console.log(err)
            } else {
                if(result.length>0) {
                    res.send("["+result[0].duration+","+result[0].fee+"]")
                }
            }
        })
    }else if(req.body.action === "renewplan"){
            let membermobilesearch = req.body.membermobile; 
            let planid = req.body.planid;
            var date_ob = new Date();
            var date = ("0" + date_ob.getDate()).slice(-2);
            var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
            var year = date_ob.getFullYear();  
            let hours = date_ob.getHours();
            let minutes = date_ob.getMinutes();
            let seconds = date_ob.getSeconds();
            var currentdate = year+'-'+month+'-'+date +" "+hours+':'+minutes+':'+seconds
            console.log(currentdate + " - currentdate")
            var nextdate = year+'-'+month+'-'+date;
            console.log(nextdate + " -  nextdate")
            var result = new Date(nextdate);
            console.log(result + " 2222result")
            let days = parseInt(req.body.duration)
            console.log(days + " - days ")
            result.setDate(result.getDate() + days);

            let enddate = result.getFullYear()+'-'+("0" + (result.getMonth() + 1)).slice(-2)+'-'+("0" + result.getDate()).slice(-2)+' 00:00:00';
            console.log(enddate + " - enddate")
            gymcon.query("select * from memberplans where memberid in(select memberid from gymmembers where mobileno like '"+membermobilesearch+"') and status like 'Active'",function(err,results){
                if(err) console.log(err)
                else if(results.length>0){
                    var date_ob = new Date();
                    let date = new Date(results[0].enddate)
                    var diff = date.getTime() - date_ob.getTime()  
                    var daydiff = diff / (1000 * 60 * 60 * 24)
                    if(daydiff>0){
                        let days2 = Math.round(daydiff)
                        days2 += days
                        var result2 = new Date(nextdate);
                        result2.setDate(result2.getDate() + days2);
                        let enddate2 = result2.getFullYear()+'-'+("0" + (result2.getMonth() + 1)).slice(-2)+'-'+("0" + result2.getDate()).slice(-2)+' 00:00:00';
                        console.log(enddate2 + " - enddate2")
                        var sql = "update memberplans set status='Deactivate' where memberid in(select memberid from gymmembers where mobileno like '"+membermobilesearch+"') and status like 'Active'";
                        gymcon.query(sql, function(err, results1){
                            console.log(sql + " update Active plan ")
                            if(err) console.log(err)
                            else{
                        var sql1 = "update memberplans set startdate='"+currentdate+"', enddate='"+enddate+"', status='Active' where memberid in(select memberid from gymmembers where mobileno like '"+membermobilesearch+"') and planid like '"+planid+"'";
                                gymcon.query(sql1, function(err, results2){
                                    console.log(sql1 + " - update Active 11111")
                                    if(err) console.log(err)
                                    else{
                                        res.send("Plan is renewed")
                                    }
                                })
                            }
                        })
            
                    }
                    else{
                        var sql3 = "update memberplans set status='Deactivate' where memberid in(select memberid from gymmembers where mobileno like '"+membermobilesearch+"') and status like 'Active'";
                        gymcon.query(sql3, function(err, results1){
                            console.log(sql3 + " **sql 3")
                            if(err) console.log(err)
                            else{
                                var sql4= "update memberplans set startdate='"+currentdate+"', enddate='"+enddate+"', status='Active' where memberid in(select memberid from gymmembers where mobileno like '"+membermobilesearch+"') and planid like '"+planid+"'";
                                gymcon.query(sql4, function(err, results2){
                                    console.log(sql4 + " **sql4")
                                    if(err) console.log(err)
                                    else{
                                        res.send("Plan is renewed")
                                    }
                                })
                            }
                        })
            
                    }
                }
            })
        }
        else if(req.body.action === "savepayments"){
            var date_ob = new Date();
            var newId = uuidv4();
            var currentdate = date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2) +" "+date_ob.getHours()+':'+date_ob.getMinutes()+':'+date_ob.getSeconds();
            let pdate2 = req.body.pdate;
            let paid = req.body.paid 
            let balance = req.body.balance; 
            let balancedate1 = req.body.balancedate;
            let bdate = new Date(balancedate1);
            let balancedate = bdate.getFullYear()+'-'+("0" + (bdate.getMonth() + 1)).slice(-2)+'-'+("0" + bdate.getDate()).slice(-2) +" "+date_ob.getHours()+':'+date_ob.getMinutes()+':'+date_ob.getSeconds();
            let mobileno = req.body.mobileno;
            let pdate3 = new Date(pdate2);
            let pdate = pdate3.getFullYear()+'-'+("0" + (pdate3.getMonth() + 1)).slice(-2)+'-'+("0" + pdate3.getDate()).slice(-2) +" "+date_ob.getHours()+':'+date_ob.getMinutes()+':'+date_ob.getSeconds();
            gymcon.query("insert into memberpayments(subscriptionid,memberid,paymentdate,amount,balance,balancedate,paymentid)values('"+req.session.subsid+"',(select memberid from gymmembers where mobileno like '"+mobileno+"' and subscriptionid like'"+req.session.subsid+"'), '"+pdate+"', '"+paid+"', '"+balance+"', '"+balancedate+"', '"+newId+"')", function(err, result){
                if(err){
                    console.log(err)
                    res.send("Something went wrong")
                } 
                else 
                    res.send("Payment Successful")
            })
        }
        else if (req.body.action === "showdetails") {
            gymcon.query("select * from gymplans where subscriptionid like '"+req.session.subsid+"' and planid like '"+req.body.planname+"'", function(err,result) {
                if(err) {
                    console.log(err)
                } else {
                    if(result.length>0) {
                        information = []
                        information.push(result[0])
                    res.send(information)
                    }
                }
            })
        }
        else if(req.body.action === "usergymplan"){
            console.log("search GYM")
            gymcon.query("select planid as id, planname as name from gymplans where subscriptionid like '"+req.session.subsid+"'", function(err, result){
                if(err) {
                    console.log(err)
                } else if(result.length>0){
                    planname=[]
                    for(let i=0;i<result.length;i++){
                        planname.push(result[i])
                    }
                    res.send(planname)   
                }
                else{
                    res.send("no")
                }
            })
        }
        else if(req.body.action === "savememberplan"){
            let membermobilesearch = req.body.membermobilesearch;
            let planname = req.body.planname;
            let duration = req.body.duration;
            let startdate = req.body.startdate;
            let enddate = req.body.enddate;
            let discount = req.body.discount;
            let amount2 = req.body.amount2;
            let memberid2 = req.session.memberid;
            let memberid3 = req.body.memberid;
            console.log(memberid2 + " memberid2")
            console.log(memberid3 + " memberid3")
            let fee = req.body.fee;
            var sqlcheck = "select * from gymmanagement_t.memberplans where subscriptionid='"+req.session.subsid+"' and memberid='"+memberid2+"' And status='Active'";
            console.log(sqlcheck + " - sql check")
            gymcon.query(sqlcheck, function(err, result9){
                if(err){
                console.log(err)
                }else if(result9.length>0){
                    res.send("This Member Already Active plan")
                }else{
                    let sql ="select * from gymmembers where subscriptionid like '"+req.session.subsid+"' and mobileno like '"+membermobilesearch+"'";
                    gymcon.query(sql, function(err, data){
                        console.log(sql + " !!! sql ")
                        if(err) console.log(err)
                        else if(data.length>0){
                            var sql1 ="select * from memberplans where subscriptionid like'"+req.session.subsid+"' and  memberid in(select memberid from gymmembers where mobileno like '"+membermobilesearch+"' and subscriptionid like '"+req.session.subsid+"') and planid like'"+planname+"'";
                            
                            gymcon.query(sql1, function(err, results){
                                console.log(sql1 + " - !!! sql1")
                                if(err) console.log(err)
                                else if(results.length > 0){
                                var sql3= "update memberplans set status='Deactivate' where subscriptionid like '"+req.session.subsid+"' and memberid in(select memberid from gymmembers where mobileno like '"+membermobilesearch+"' and subscriptionid like '"+req.session.subsid+"') and status like 'Active'";
                                    gymcon.query(sql3, function(err, results1){
                                        console.log(sql3 + " - !!!! sql3")
                                        if(err) console.log(err)
                                        else{
                                            var sql4 = "update memberplans set startdate='"+startdate+"', enddate='"+enddate+"', fee='"+fee+"', discount='"+discount+"', amount='"+amount2+"', status='Active' where  subscriptionid like'"+req.session.subsid+"' and  memberid in(select memberid from gymmembers where mobileno like '"+membermobilesearch+"') and planid in(select planid from gymplans where planname like '"+planname+"' and subscriptionid like '"+req.session.subsid+"')"; 
                                            gymcon.query(sql4, function(err, results2){
                                                console.log(sql4 + " !!! sql4")
                                                if(err) console.log(err)
                                                else{
                                                    res.send("Plan is Changed")
                                                }
                                            })
                                        }
                                    })
                            
                                }
                                else {
                                    var sql5 = "UPDATE memberplans SET status ='Deactive' WHERE subscriptionid LIKE '" + req.session.subsid + "' AND memberid IN (SELECT memberid FROM gymmembers WHERE mobileno LIKE '" + membermobilesearch + "' AND subscriptionid LIKE '" + req.session.subsid + "') AND status LIKE 'Active'";
                                    gymcon.query(sql5, function(err, results3) {
                                        console.log(sql5 + " - !!!! sql5 ")
                                        if (err) {
                                            console.log(err);
                                            res.send("Error updating existing plan");
                                        } else {
                                            var enddate1 = new Date(enddate);
                                            var currentDate = new Date();
                                            console.log(currentDate + " currentDate");
                                            console.log(enddate1 + " - enddate");
                                            var status = (currentDate > enddate1) ? 'Deactive' : 'Active';
                                
                                            var sql = "INSERT INTO memberplans(subscriptionid, memberid, planid, startdate, enddate, fee, discount, amount, memberid2, status) " +
                                                "VALUES ('" + req.session.subsid + "', " +
                                                "(SELECT memberid FROM gymmembers WHERE mobileno LIKE '" + membermobilesearch + "' AND subscriptionid LIKE '" + req.session.subsid + "'), " +
                                                "'" + planname + "', '" + startdate + "', '" + enddate + "', '" + fee + "', '" + discount + "', '" + amount2 + "', '" + memberid3 + "', '" + status + "')";
                                
                                            // Execute the SQL query
                                            gymcon.query(sql, function(err, result) {
                                                console.log(sql + " status active or deactive ")
                                                if (err) {
                                                    console.log("Error executing SQL query:", err);
                                                    res.send("Error saving plan");
                                                } else {
                                                    if (status === 'Deactive') {
                                                        res.send("Plan is Saved as Deactive");
                                                    } else {
                                                        res.send("Plan is Saved as Active");
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                                
                                // else{
                                //     var sql5 = "update memberplans set status ='Deactivate' where subscriptionid like'"+req.session.subsid+"' and memberid in(select memberid from gymmembers where mobileno like '"+membermobilesearch+"' and subscriptionid like '"+req.session.subsid+"') and status like 'Active'";
                                //     gymcon.query(sql5, function(err, results3){
                                //         console.log(sql5 + " - !!!! sql5 ")
                                //         if(err) console.log(err)
                                //         else{
                                //             var currentDate = new Date();
                                //             console.log(currentDate + " currentDate")
                                //             console.log(enddate + " - enddate")
                                //             // if(currentDate > enddate){
                                //                 if (currentDate > enddate) {
                                //                     var status = 'Deactive';
                                //                 } else {
                                //                     var status = 'Active';
                                //                 }
                                //                 var sql = "INSERT INTO memberplans(subscriptionid, memberid, planid, startdate, enddate, fee, discount, amount, memberid2, status) " +
                                //                     "VALUES ('" + req.session.subsid + "', " +
                                //                     "(SELECT memberid FROM gymmembers WHERE mobileno LIKE '" + membermobilesearch + "' AND subscriptionid LIKE '" + req.session.subsid + "'), " +
                                //                     "'" + planname + "', '" + startdate + "', '" + enddate + "', '" + fee + "', '" + discount + "', '" + amount2 + "', '" + memberid3 + "', '" + status + "')";

                                //             // Execute the SQL query
                                //             gymcon.query(sql, function(err, result) {
                                //                 if (err) {
                                //                     console.log("Error executing SQL query:", err);
                                //                     res.send("Error saving plan");
                                //                 } else {
                                //                     if (status === 'Deactive') {
                                //                         res.send("Plan is Saved as Deactive");
                                //                     } else {
                                //                         res.send("Plan is Saved as Active");
                                //                     }
                                //                 }
                                //             });
                                //         }
                                //     })
                                // }
                            })
                        }
                        else{
                            res.send("Please Check the number or try search operation")
                        }
                    
                    })
                }
                })
            }

        else if(req.body.action === "bmisearchmember"){
            gymcon.query("select * from gymbmireport where memberid2 in(select memberid2 from gymmembers where memberid like'"+req.session.userid+"' and subscriptionid like'"+req.session.subsid+"') and subscriptionid like '"+req.session.subsid+"' order by date desc", function(err, results){
                if(err){
                    console.log(err)
                }
                else if(results.length>0){
                    out = "<table id='report'><tr><th>Date</th><th>Age</th><th>Fat</th><th>Weight</th><th>Height</th><th>BMI</th><th>BMR</th></tr>"
                        for(i = 0; i < results.length; i++){
                            let age = results[i].age;
                            let height = results[i].height;
                            let weight = results[i].weight;
                            let fat = results[i].fat;
                            let bmi = results[i].bmi;
                            let bmr = results[i].bmr;
                            let date = new Date(results[i].date);
                            if(date == '' || date == null || date==undefined){
                                date = ''
                            }else{
                                date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
                            }
                            if(age === null || age === undefined){
                                age = '';
                            }
                            if(height === null || height === undefined){
                                height = '';
                            }
                            if(weight === null || weight === undefined){
                                weight = '';
                            }
                            if(fat === null || fat === undefined){
                                fat = '';
                            }
                            if(bmi === null || bmi === undefined){
                                bmi = '';
                            } 
                            if(bmr === null || bmr === undefined){
                                bmr = '';
                            }  
                            out = out + "<tr><td>"+date+"</td><td>" + age + "</td><td>" + fat+ "</td><td>" + weight + "</td><td>" + height + "</td><td>" + bmi + "</td><td>" + bmr + "</td></tr>"
                        }
                        out = out + "</table>"
                        res.send(out)
                }
                else{
                    res.send("Not found")
                }
            })
        }
        else if(req.body.action === "searchbmi"){
            let memberid = req.body.memberid
            gymcon.query("select * from gymbmireport where memberid2 like '"+ memberid+"' and subscriptionid like '"+req.session.subsid+"' order by date desc", function(err, results){
                if(err){
                    console.log(err)
                    console.log(results)
                }
                else if(results.length>0){
                    info1=[]
                        for(let i=0;i<results.length;i++){
                            info1.push(results[i])
                        }
                    res.send(info1)
                }
                else{
                    res.send("not found")
                }
            })
        }
        else if(req.body.action === "searchregmember"){
            let memberid =req.body.memberid
            gymcon.query("select * from gymmembers where memberid2 like '"+ memberid+"' and subscriptionid like '"+req.session.subsid+"'", function(err, results){
                if(err) console.log(err)
                else if(results.length>0){
                    information = []
                    information.push(results[0].memberid)
                    information.push(results[0].name)
                    information.push(results[0].mobileno)
                    gymcon.query("select * from memberplans where memberid like '"+ results[0].memberid+"' and subscriptionid like '"+req.session.subsid+"'", function(err, result){
                        if(err) console.log(err)
                        else if(result.length>0){
                            information.push(result[0].startdate)
                            information.push(result[0].enddate)
                        }
                        gymcon.query("select * from gymbmireport where memberid2 like '"+ memberid+"' and subscriptionid like '"+req.session.subsid+"' order by date desc", function(err, results){
                            if(err){
                                console.log(err)
                            }
                            else if(results.length>0){
                                information.push(results[0].age)
                                information.push(results[0].fat)
                                information.push(results[0].weight)
                                information.push(results[0].height)
                                information.push(results[0].bmi)
                                information.push(results[0].date)

                                res.send(information)
                            }
                            else{
                                res.send(information)
                            }
                        })                        
                        
                    })
                }
            })
        }
        else if(req.body.action === 'markattendancegym'){
            var date_ob = new Date();
            var currentdate = date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2) +" "+date_ob.getHours()+':'+date_ob.getMinutes()+':'+date_ob.getSeconds();
            var fdate = date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2)
            fdate = fdate + " 00:00:00"
            var sdate =  date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2)
            sdate = sdate + " 23:59:59"
            let memberid= req.body.memberid;
            let sql2 = "select * from gymmanagement_t.gymmembers where subscriptionid='"+req.session.subsid+"' and memberid2='"+memberid+"'";
            gymcon.query(sql2, function(err, result) {
                console.log(sql2 + " ..................")
            if (err) {
                console.log(err);
                res.send('Error occurred while checking balancepayment table.');
            } else if(result.length>0) {
                var memberid6=result[0].memberid;
                let sql3 = "select * from gymmanagement_t.memberpayments where subscriptionid='"+req.session.subsid+"' and memberid='"+memberid6+"'";
                gymcon.query(sql3, function(err, result1) {
                    console.log(sql3 + " ..................")
                    if(err){
                        console.log(err)
                    }else if(result1.length>0){
                    var sql1 = "select * from mattendance where subid like '"+req.session.subsid+"' and memberid2 like '"+memberid+"' and indate between '"+fdate+"' and '"+sdate+"'";
                    gymcon.query(sql1, function(err, result){
                        console.log(sql1 + "sql 1 att 1")
                        if(err) console.log(err)
                        else if(result.length>0){
                            res.send(" Attendance Already Marked")
                        }
                        else{
                            gymcon.query("select * from gymmembers where subscriptionid like '"+req.session.subsid+"' and memberid2 like '"+memberid+"'",function(err, result4){
                                if(err) console.log(err)
                                else if(result4.length>0){
                                    var sql2 = "insert into mattendance(subid,memberid2,indate) values('"+req.session.subsid+"', '"+memberid+"','"+currentdate+"')";
                                    gymcon.query(sql2, function(err, result){
                                        console.log(sql2 + " sql2 att")
                                        if(err) console.log(err)
                                        else
                                            res.send("Attendance is Marked")
                                    })
                                }
                                else{
                                    res.send("Invalid Member ID")
                                }
                                
                            })
                        }
                    })
                } else {
                    res.send("Please first Pay On Your Fee")

                            }
                })
            }
            })
        }
        else if(req.body.action === 'attendacesearch'){
            var date_ob = new Date();
            var currentdate = date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2) +" "+date_ob.getHours()+':'+date_ob.getMinutes()+':'+date_ob.getSeconds();
            var fdate = date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2)
            fdate = fdate + " 00:00:00"
            var sdate =  date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2)
            sdate = sdate + " 23:59:50"    
            //  let sql1 = "select mattendance.memberid2, mattendance.indate, gymmembers.name, gymmembers.mobileno, memberplans.startdate, memberplans.enddate, memberpayments.balancedate, max(memberpayments.paymentdate), memberpayments.balance from mattendance join gymmembers on mattendance.subid = gymmembers.subscriptionid and mattendance.memberid2 = gymmembers.memberid2 join memberplans on mattendance.memberid2 = memberplans.memberid2 join memberpayments on memberplans.memberid = memberpayments.memberid where mattendance.subid like '"+req.session.subsid+"' and mattendance.indate between '"+fdate+"' and '"+sdate+"' and memberplans.status='Active' group by memberpayments.memberid order by mattendance.indate desc";
                let sql1 ="SELECT DISTINCT mattendance.memberid2, mattendance.indate, mattendance.subid, gymmembers.name, gymmembers.mobileno, memberplans.startdate, memberplans.enddate, memberpayments.balancedate AS t1, memberpayments.balance FROM mattendance  JOIN gymmembers ON mattendance.subid = gymmembers.subscriptionid AND mattendance.memberid2 = gymmembers.memberid2  JOIN memberplans ON gymmembers.memberid = memberplans.memberid and gymmembers.subscriptionid = memberplans.subscriptionid JOIN memberpayments ON memberplans.memberid = memberpayments.memberid and memberplans.subscriptionid = memberpayments.subscriptionid WHERE mattendance.subid LIKE '"+req.session.subsid+"'  AND mattendance.indate BETWEEN '"+fdate+"' AND '"+sdate+"'  AND memberplans.status = 'Active'  AND memberpayments.paymentdate IN (SELECT MAX(memberpayments.paymentdate) FROM memberpayments WHERE memberplans.memberid = memberpayments.memberid)  ORDER BY mattendance.indate DESC;"
                // let sql1 = "select DISTINCT mattendance.memberid2,mattendance.indate,gymmembers.name,gymmembers.mobileno,memberplans.startdate,memberplans.enddate, memberpayments.balancedate as t1,memberpayments.balance from mattendance join gymmembers on mattendance.subid=gymmembers.subscriptionid and mattendance.memberid2=gymmembers.memberid2 join memberplans on gymmembers.memberid=memberplans.memberid join memberpayments on memberplans.memberid=memberpayments.memberid where mattendance.subid like '"+req.session.subsid+"' and mattendance.indate between '"+fdate+"' and '"+sdate+"' and memberplans.status='Active' and memberpayments.paymentdate in(select MAX(memberpayments.paymentdate) from memberpayments where memberplans.memberid=memberpayments.memberid) order by mattendance.indate desc"
                gymcon.query(sql1, function(err, result){
                console.log(sql1 + " 123 att report")
                if(err) console.log(err)
                else if(result.length>0){
                    var date_ob = new Date();
                    var currentdate = date_ob.getFullYear()+'-'+("0" + (date_ob.getMonth() + 1)).slice(-2)+'-'+("0" + date_ob.getDate()).slice(-2)
                    out = "<table id='report'><tr><th>Member ID</th><th>Name</th><th>Time</th><th>Start Date</th><th>End Date</th><th>Balance</th><th>Balance Date</th></tr>"
                    for(let i=0;i<result.length;i++){
                        var time = new Date(result[i].indate)
                        if(time == ''|| time==null){
                            time = ''
                        }
                        else{
                            time = time.getHours()+":"+time.getMinutes()+":"+time.getSeconds();
                        }
                        var sdate= new Date(result[i].startdate)
                        var edate = new Date(result[i].enddate)
                        let d1 = new Date();
                        var bdate1 = new Date(result[i].t1)
                        bdate = bdate1.getFullYear()+'-'+("0" + (bdate1.getMonth() + 1)).slice(-2)+'-'+("0" + bdate1.getDate()).slice(-2)
                        if(bdate==='NaN-aN-aN' || bdate==='' || bdate === null){
                            bdate = ''
                        }else{
                            var diff1 = bdate1.getTime() - d1.getTime();   
                            var daydiff1 = diff1 / (1000 * 60 * 60 * 24);      
                        }
                        // sdate = sdate.getFullYear()+'-'+("0" + (sdate.getMonth() + 1)).slice(-2)+'-'+("0" + sdate.getDate()).slice(-2)
                        // if(sdate === '0000-00-00 00:00:00' || sdate == ''|| sdate==null){
                        //     sdate = ''
                        // }
                        if (!isNaN(sdate) && sdate !== null && sdate !== '') {
                            sdate = sdate.getFullYear() + '-' + ("0" + (sdate.getMonth() + 1)).slice(-2) + '-' + ("0" + sdate.getDate()).slice(-2);
                        } else {
                            sdate = ''; // Set to blank if NaN or null
                        }
                        // edate = edate.getFullYear()+'-'+("0" + (edate.getMonth() + 1)).slice(-2)+'-'+("0" + edate.getDate()).slice(-2)
                        // if( edate === '0000-00-00 00:00:00'  || edate == ''|| edate==null){
                        //     edate = ''
                        // }  
                        if (!isNaN(edate) && edate !== null && edate !== '') {
                            edate = edate.getFullYear() + '-' + ("0" + (edate.getMonth() + 1)).slice(-2) + '-' + ("0" + edate.getDate()).slice(-2);
                        } else {
                            edate = ''; // Set to blank if NaN or null
                        }             
                        if(currentdate >= edate){
                            out = out + "<tr style='background: #FA8072;'><td>" + result[i].memberid2 + "</td><td>" + result[i].name+ "</td><td>" + time + "</td><td>" + sdate + "</td><td>" + edate + "</td><td>" + result[i].balance + "</td><td>" + bdate + "</td></tr>"         
                        }
                        else if(bdate==''){
                            out = out + "<tr><td style='background: white'>" + result[i].memberid2 + "</td><td>" + result[i].name+ "</td><td>" + time + "</td><td>" + sdate + "</td><td>" + edate + "</td><td>" + result[i].balance + "</td><td>" + bdate + "</td></tr>"
                        }
                        else if(daydiff1 <=0 ){
                            out = out + "<tr style='background: #B0E0E6;'><td>" + result[i].memberid2 + "</td><td style='border: 1px solid black;'>" + result[i].name+ "</td><td>" + time + "</td><td>" + sdate + "</td><td>" + edate + "</td><td>" + result[i].balance + "</td><td>" + bdate + "</td></tr>"
                        }
                        else if(daydiff1 >= 1 && daydiff1 <= 5){
                            out = out + "<tr style='background: #fff782;'><td>" + result[i].memberid2 + "</td><td>" + result[i].name+ "</td><td>" + time + "</td><td>" + sdate + "</td><td>" + edate + "</td><td>" + result[i].balance + "</td><td>" + bdate + "</td></tr>"            
                        }else{
                            out = out + "<tr><td style='background: white'>" + result[i].memberid2 + "</td><td>" + result[i].name+ "</td><td>" + time + "</td><td>" + sdate + "</td><td>" + edate + "</td><td>" + result[i].balance + "</td><td>" + bdate + "</td></tr>"  
                        }
                    }
                    out = out + "</table>"
                    res.send(out)
                }else{
                    res.send('No Data')
                }
            })
        }
     else if(req.body.action === "searchmember") {
        let mobileno = req.body.membermobile;
        let name = req.body.membername;
        let mid2 = req.body.memberid2;
        let memberid = '';
        let sdate = '';
        let info = []
        let sql ="select * from gymmembers where subscriptionid='"+req.session.subsid+"' and mobileno like '%"+mobileno+"%' and memberid2 like '%"+mid2+"%' and name like '%"+name+"%'"
        console.log(sql +" - search member")
        gymcon.query(sql, function(err,result) {
            if(err) {
                console.log(err)
            } 
            else if(result.length>0){
                info.push(result[0].memberid)
                info.push(result[0].name)
                info.push(result[0].mobileno)
                info.push(result[0].Address1)
                info.push(result[0].Address2)
                info.push(result[0].city)
                info.push(result[0].pin)
                info.push(result[0].email)
                info.push(result[0].memberid2)
                info.push(result[0].anniversarydate)
                info.push(result[0].birthdate)
                memberid = result[0].memberid
                req.session.memberid = result[0].memberid;
                gymcon.query("select * from gymplans where planid in(select planid from memberplans where memberid like '"+memberid+"' and status like 'Active') and subscriptionid like '"+req.session.subsid+"'", function(err, result2){
                    if(err) console.log(err)
                    else if(result2.length > 0){
                        info.push(result2[0].planname)
                        info.push(result2[0].duration)
                        info.push(result2[0].fee)
                        gymcon.query("select * from memberplans where memberid like '"+memberid+"' and subscriptionid like'"+req.session.subsid+"' and status like 'Active'", function(err, result3){
                            if(err) console.log(err)
                            else if(result3.length>0){
                                info.push(result3[0].planid)
                                info.push(result3[0].startdate)
                                info.push(result3[0].enddate)
                                info.push(result3[0].fee)
                                info.push(result3[0].amount)
                                info.push(result3[0].discount)
                                sdate = result3[0].startdate

                                var currentDate = new Date();
                                var endDate = new Date(result3[0].enddate);
                                if(currentDate > endDate) {
                                    // If current date is past the end date, update the status to 'Deactive'
                                    gymcon.query("UPDATE memberplans SET status = 'Deactive' WHERE memberid = ? AND subscriptionid = ? AND status = 'Active'", [memberid, req.session.subsid], function(updateErr, updateResults) {
                                        if(updateErr) {
                                            console.log(updateErr);
                                        } else {
                                            console.log("Status updated to 'Deactive'");
                                        }
                                    });
                                }
                        

                                gymcon.query("select * from memberpayments where memberid like '"+memberid+"' and subscriptionid like'"+req.session.subsid+"' order by paymentdate desc limit 1",function(err, result8){
                                    if(err) console.log(err)
                                    else if(result8.length>0){
                                        info.push(result8[0].balance)
                                        info.push(result8[0].paymentdate)
                                        res.send(info);
                                    }
                                    else{
                                        res.send(info);
                                    }
                                })       
                            }
                            else{
                                res.send(info);
                            }                                                                         
                        })
                    }
                    else{
                        res.send(info);
                    }           
                })
            }
            else{
                res.send("User Not Found")
            }
        })
    }else if(req.body.action === "newmember"){
        var newId = uuidv4();
        let name = req.body.membername;
        let membermobile = req.body.membermobile
        let password = (Math.random() + 1).toString(36).substring(7);
        mcon.query("select userid from users where mobile like'"+membermobile+"'",function(err,result12){
            if(err) console.log(err)
            else if(result12.length>0){
                let userid = result12[0].userid
                gymcon.query("select * from gymmembers where memberid like '"+userid+"' and subscriptionid like'"+req.session.subsid+"'", function(err, result){
                    if(err) console.log(err)
                    else if(result.length > 0){
                        res.send("Metch")
                    }
                    else{
                        gymcon.query("select max(memberid2) as maxid from gymmembers where subscriptionid like '"+req.session.subsid+"'", function(err, results){
                            if(err) console.log(err)
                            else if(results.length>0){
                                let maxid = results[0].maxid;
                                var arr = [];
                                arr.push(maxid + 1);
                                maxid = maxid + 1;
                                
                                gymcon.query("insert into gymmembers(subscriptionid,memberid,name,mobileno,memberid2)values('"+req.session.subsid+"', '"+userid+"', '"+name+"', '"+membermobile+"', '"+maxid+"')", function(err, result){
                                    if(err) console.log(err)
                                    res.send({ message: "New Member created", maxid: arr }); 
                                    // res.send("New Member created "+ maxid)
                                })
                            }
                        })
                    }
                })
            }else{
                var date_ob = new Date();
                var date = ("0" + date_ob.getDate()).slice(-2);
                var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
                var year = date_ob.getFullYear();  
                let hours = date_ob.getHours();
                let minutes = date_ob.getMinutes();
                let seconds = date_ob.getSeconds();
                var currentdate = year+'-'+month+'-'+date +" "+hours+':'+minutes+':'+seconds
                mcon.query("insert into users(userid,name,password,mobile,createddate)values('"+newId+"','"+name+"','"+password+"','"+membermobile+"','"+currentdate+"')",function(err,result){
                    if(err) console.log(err)
                    gymcon.query("select * from gymmembers where memberid like '"+newId+"' and subscriptionid like'"+req.session.subsid+"'", function(err, result){
                        if(err) console.log(err)
                        else if(result.length > 0){
                            res.send("Metch")
                        }
                        else{
                            gymcon.query("select max(memberid2) as maxid from gymmembers where subscriptionid like '"+req.session.subsid+"'", function(err, results){
                                if(err) console.log(err)
                                else if(results.length>0){
                                    let maxid = results[0].maxid;
                                    var arr = [];
                                    arr.push(maxid + 1);
                                    maxid = maxid + 1;
                                    gymcon.query("insert into gymmembers(subscriptionid,memberid,name,mobileno,memberid2)values('"+req.session.subsid+"', '"+newId+"', '"+name+"', '"+membermobile+"', '"+maxid+"')", function(err, result){
                                        if(err) console.log(err)
                                        res.send({ message: "New Member created", maxid: arr }); 
                                        // res.send("New Member created Password : "+password)
                                    })
                                }
                            })
                        }
                    })
                })    
            }
        })
    } 
    else if(req.body.action === "paymenthistory"){
        let mobileno = req.body.mobileno;
        var sql ="select memberpayments.paymentid, memberpayments.paymentdate, memberpayments.amount, memberpayments.balance, memberpayments.balancedate, gymmembers.name, gymmembers.mobileno, gymmembers.memberid2 from memberpayments join gymmembers on memberpayments.memberid = gymmembers.memberid and memberpayments.subscriptionid = gymmembers.subscriptionid where memberpayments.memberid in(select memberid from gymmembers where mobileno like '"+mobileno+"') and gymmembers.subscriptionid like '"+req.session.subsid+"' order by paymentdate desc";
        gymcon.query(sql, function(err, result){
            console.log(sql + " lllllllllllllllll")
            if(err) console.log(err)
            else if(result.length>0){
                out = "<table id='report'><tr><th>Member ID</th><th>Name</th><th>Mobile No.</th><th>Remaining Amount</th><th>Last Payment</th><th>Payment Date</th><th>Balance Date</th><th>Action</th></tr>"
                for(let i=0;i<result.length;i++){
                    var sdate=new Date(result[i].paymentdate)
                    var bdate=new Date(result[i].balancedate)
                    bdate = bdate.getFullYear() + '-' + ('0' + (bdate.getMonth() + 1)).slice(-2) + '-' + ('0' + bdate.getDate()).slice(-2);
                    if(bdate==='NaN-aN-aN' || bdate==='' || bdate === null){
                        bdate = ''
                    }
          //          bdate = bdate.getFullYear() + '-' + ('0' + (bdate.getMonth() + 1)).slice(-2) + '-' + ('0' + bdate.getDate()).slice(-2);
                    sdate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2);
                    out = out + "<tr><td>" + result[i].memberid2 + "</td><td>" + result[i].name+ "</td><td>" + result[i].mobileno + "</td><td>" + result[i].balance + "</td><td>" + result[i].amount + "</td><td>" + sdate + "</td><td>" + bdate + "</td><td><button onclick=deletepayment('"+result[i].paymentid+"')>Delete</button></td></tr>" 
                }
                out = out + "</table>"
                res.send(out)
            }else{
                res.send("No Data")
            }
        })
    }
    else if(req.body.action === "deletepayment"){
        let paymentid = req.body.paymentid;
        gymcon.query("delete from memberpayments where paymentid like '"+paymentid+"'", function(err, result){
            if(err){
                console.log(err)
                res.send("Something went wrong")
            }
            else{
                res.send("Successful")
            }
        })
    }
    else if(req.body.action === "paymenthistory2"){
        let mobileno = req.body.mobileno
        gymcon.query("select memberpayments.paymentid,memberpayments.paymentdate, memberpayments.amount, memberpayments.balance, memberpayments.balancedate, gymmembers.name, gymmembers.mobileno, gymmembers.memberid2 from memberpayments join gymmembers on memberpayments.memberid = gymmembers.memberid and memberpayments.subscriptionid = gymmembers.subscriptionid where memberpayments.subscriptionid like '"+req.session.subsid+"'  order by paymentdate desc", function(err, result){
            if(err) console.log(err)
            else if(result.length>0){
                out = "<table id='report'><tr><th>Member ID</th><th>Name</th><th>Mobile No.</th><th>Remaining Amount</th><th>Last Payment</th><th>Payment Date</th><th>Balance Date</th><th>Action</th></tr>"
                for(let i=0;i<result.length;i++){
                    var sdate=new Date(result[i].paymentdate)
                    var bdate=new Date(result[i].balancedate)
                    bdate = bdate.getFullYear() + '-' + ('0' + (bdate.getMonth() + 1)).slice(-2) + '-' + ('0' + bdate.getDate()).slice(-2);
                    if(bdate==='NaN-aN-aN' || bdate==='' || bdate === null){
                        bdate = ''
                    }
                    sdate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2);
                    out = out + "<tr><td>" + result[i].memberid2 + "</td><td>" + result[i].name+ "</td><td>" + result[i].mobileno + "</td><td>" + result[i].balance + "</td><td>" + result[i].amount + "</td><td>" + sdate + "</td><td>" + bdate + "</td><td><button onclick=deletepayment('"+result[i].paymentid+"')>Delete</button></td></tr>" 
                }
                out = out + "</table>"
                res.send(out)
            }else{
                res.send("No Data")
            }
        })
    }
    else if (req.body.action==="uploadpic"){
        var memberid2=req.body.memberid2;
        
        console.log(memberid2 + " memberid2")
        // var filename=req.body.filename; 
        var profilephotoid=uuidv4();
        var size=req.body.size;
        var cdate=new Date();
        cdate = cdate.getFullYear() + '-' + ('0' + (cdate.getMonth() + 1)).slice(-2) + '-' + ('0' + cdate.getDate()).slice(-2) + ' ' + ('0' + cdate.getHours()).slice(-2) + ':' + ('0' + cdate.getMinutes()).slice(-2) + ':' + + ('0' + cdate.getSeconds()).slice(-2)
        var sql = "select subscriptions.quota, subscriptions.usedquota from usermaster_t.subscriptions where subscriptionid like '" + req.session.subsid + "'";
        mcon.query(sql, function (err, result) {
            // console.log(sql + "   .....")
            if (err) console.log(err)
                else if (result.length > 0) {
                    let quota = 0, usedquota = 0;
                        if (result[0].quota == null || result[0].quota == undefined || result[0].quota == "") {
                            quota = 0
                            console.log(quota + "  111111 quota")
                        } else {
                            quota = result[0].quota;
                        }
                        if (result[0].usedquota == null || result[0].usedquota == undefined || result[0].usedquota == "") {
                            usedquota = 0
                        } else {
                        usedquota = result[0].usedquota;
                        }
                        if (usedquota > quota) {
                            res.send("You have reached the maximum limit of file upload")
                    } else {
                        return new Promise((resolve, reject) => {
                            savefiledb(req,res,req.session.orgid,(successfun)=>{
                                resolve(successfun)
                            })
                    }).then((data)=>{
                        var sql3 ="update gymmanagement_t.gymmembers set profilephotoid='"+data+"' where subscriptionid='"+req.session.subsid+"' And memberid='"+memberid2+"'";
                        gymcon.query(sql3,function(err,result){
                        console.log(sql3 +" ,,,,,,")
                            if(err) console.log(err)
                            else if(result.affectedRows>0){
                                return new Promise((resolve, reject) => {
                                    gettotalsize2(req.session.subsid, req.session.orgid, (successfun) => {
                                        resolve(successfun)
                                    });
                                }).then((data) => {
                                    res.send("File Upload")
                            })
                        }else{
                            res.send("error")
                        }
                    })     
                })         
            }
        }
        })
    }
    
    else if(req.body.action === 'getprofilepic'){
        var memberid2 = req.body.memberid2;
        let path ="gymdata/profilepic/"+req.session.orgid;
        gymcon.query("select * from gymmembers where subscriptionid='"+req.session.subsid+"' and memberid='"+memberid2+"'",function(err,result){
            if(err) console.log(err)
            else if(result.length>0){
                let fileid = result[0].profilephotoid
                return new Promise((resolve, reject) => {
                    retrivefile(req,res,fileid,path,req.session.orgid,(successfun) => {
                        resolve(successfun);
                    });
                }).then((data)=>{
                    res.send(data)
                    // console.log(data + " data")
                })

            }else{
                res.send("no file")
            }
        })    
    }
    else if(req.body.action === "savemember"){
        console.log("here")
       let membername = req.body.membername;
        let memberaddress1= req.body.memberaddress1;
        let memberaddress2= req.body.memberaddress2;
        let memberemail= req.body.memberemail;
        let membermobile= req.body.membermobile;
        let memberpincode= req.body.memberpincode;
        let membercity= req.body.membercity;
        let memberid2 = req.body.memberid2;
        let bdate = req.body.bdate;
        let anniversarydate = req.body.aniivesarydate;
        console.log(bdate, anniversarydate)
        gymcon.query("select memberid from gymmembers where mobileno like '"+membermobile+"' and subscriptionid like'"+req.session.subsid+"'", function(err, result){
            if(err) console.log(err)
            else if(result.length>0){
        // var sql ="select memberid from gymmembers where memberid2='"+memberid2+"' and subscriptionid like'"+req.session.subsid+"'";
        //         gymcon.query(sql,function(err,result){
        //             if(err) console.log(err)
        //                 else if(result.length>0){
        //                     res.send("Thos")  
        //                 } 
        //         })
         
        let sql2 ="update gymmembers set subscriptionid='"+req.session.subsid+"', name='"+membername+"', mobileno='"+membermobile+"', Address1='"+memberaddress1+"', Address2='"+memberaddress2+"', city='"+membercity+"', pin='"+memberpincode+"', email='"+memberemail+"', memberid2='"+memberid2+"'";
        if (bdate) {
            sql2 += ", birthdate='" + bdate + "'";
        }
        if (anniversarydate) {
            sql2 += ", anniversarydate='" + anniversarydate + "'";
        }
        sql2 += " where memberid='" + result[0].memberid + "' and subscriptionid like'" + req.session.subsid + "'";
              
        gymcon.query(sql2, function(err,result){
                    console.log(sql2 + " ------ ********")
                    if(err){
                        console.log(err)
                        res.send("error")
                    } 
                    else{
                        res.send("Profile saved")
                    }
                })
            }
            else{
                res.send("Please complete registration")
            }
        })   
    }
    
    //csscolor
    else if (req.body.action === 'retrivebgstylecolorgym') {
        var sql = "select * from usermaster_t.bgstyle ";
        mcon.query(sql, function(err, result) {
            console.log(sql +"   retrivprojectname")
            if (err) console.log(err, req);
            else if (result.length > 0) {
                r = [];
                for (i = 0; i < result.length; i++) {
                    r.push('{"name":"' + result[i].name + '","filename":"' + result[i].filename + '"}');
                }
                res.send(r);
            } else {
                res.send("error");
            }
        });
    }
    else if(req.body.action==="orgcolorgym"){
        var csscolor = req.body.csscolor
        var sql = "update gymmanagement_t.orgdetails set csscolor='"+csscolor+"'  where subscriptionid='"+req.session.subsid+"'";
        gymcon.query(sql,function(err,result){
        //    console.log(sql  +  ">>>>")
            if(err)console.log(err)
            else if(result.affectedRows>0){
               res.send("updated successfully")
            }else{
                res.send("orginfo error")
            }
        })
    }
//dashboard
    // else if(req.body.action == "showdashboardactdact"){
    //     // Get today's date in the format 'YYYY-MM-DD'
    //     let today = new Date();
    //     let todayStr = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    
    //     // SQL query to select records only from today's date
    //     var sql="SELECT * FROM gymmanagement_t.memberplans where subscriptionid='7ce9ab9b-89ec-4e4f-84de-606be3bdfeab';"
    //     // let sql = "SELECT * FROM gymmanagement_t.mattendance WHERE DATE(indate) ='"+todayStr+"'";
    //     gymcon.query(sql, function(err, result){
    //         console.log(sql + " - 8989")
    //         if(err) console.log(err)
    //         else if(result.length > 0){
    //             var count=0;
    //             var count1=0;
    //             let out = "<table id='report'><tr><th>Active</th><th>Deactive</th></tr>";
    //             for(let i = 0; i < result.length; i++){
    //                 var status=result[i].status;
                    
    //                 if(status=='Active'){
    //                     var c=0
    //                     count++;
    //                     console.log(c + " - c")
    //                 }else
    //                 {
    //                  count1++;
    //                 }
    //                 // var sdate = new Date(result[i].indate);
    //                 var memberid2 = result[i].memberid2;
    //                 var rotationvalue = Math.floor(Math.random() * 41) - 20;
    //                 // sdate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2);
    //             }
    //             console.log(count + "- count")
    //             out = out + "<tr><td style='transform:(" + rotationvalue + "); transition: transform 0.5s ease; background-color:red;'>" + count + "</td><td>"+count1+"</td></tr>";
    //             out = out + "</table>";
    //             res.send(out);
    //         } else {
    //             res.send("No Data");
    //         }
    //     });
    // }

    // else if (req.body.action == "showdashboardactdact") {
    //     // Get today's date in the format 'YYYY-MM-DD'
    //     let today = new Date();
    //     let todayStr = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    
    //     // SQL query to join memberplans and gymmembers tables
    //     let sql = "SELECT mp.*, gm.name, gm.mobileno, gm.Address1, gm.Address2, gm.city, gm.pin, gm.email, gm.anniversarydate, gm.birthdate, gm.profilephotoid FROM gymmanagement_t.memberplans mp LEFT JOIN gymmanagement_t.gymmembers gm ON mp.subscriptionid = gm.subscriptionid AND mp.memberid = gm.memberid WHERE mp.subscriptionid='" + req.session.subsid + "'";
    
    //     // Execute the SQL query to get details from both tables
    //     gymcon.query(sql, function (err, result) {
    //         console.log(sql + " - 8989");
    //         if (err) console.log(err);
    //         else if (result.length > 0) {
    //             let countActive = 0;
    //             let countInactive = 0;
    //             let rotationvalue = Math.floor(Math.random() * 41) - 20;
                
    //             // Calculate active and inactive members from the joined result
    //             for (let i = 0; i < result.length; i++) {
    //                 let status = result[i].status;
    //                 if (status == 'Active') {
    //                     countActive++;
    //                 } else {
    //                     countInactive++;
    //                 }
    //             }
    //             let totalplanmember =countActive+countInactive;
    
    //             // Second query to count total members from gymmembers for the given subscription ID
    //             let totalMembersSql = "SELECT COUNT(*) as totalMembers FROM gymmanagement_t.gymmembers WHERE subscriptionid='" + req.session.subsid + "'";
    //             gymcon.query(totalMembersSql, function (err, totalResult) {
    //                 if (err) {
    //                     console.log(err);
    //                     res.send("Error calculating total members");
    //                 } else {
    //                     let totalMembers = totalResult[0].totalMembers;
    //                     console.log(totalMembers + " - totalMembers");
    
    //                     // Create HTML output
    //                     let out = "<table id='report'><tr><th>Total Members</th><th>total Member In plan </th><th>Active Member Plan</th><th>Deactive Member Plan</th></tr>";
    //                     out += "<tr><td>" + totalMembers + "</td><td>" +totalplanmember +"</td><td>" + countActive + "</td>";
    //                     out += "<td>" + countInactive + "</td>";
    //                     out +="</tr>";
    //                     out += "</table>";
    
    //                     res.send(out);
    //                 }
    //             });
    //         } else {
    //             res.send("No Data");
    //         }
    //     });
    // }
    
    else if (req.body.action == "showdashboardactdact") {
        let today = new Date();
        let todayStr = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    
        // Subquery to select the latest record for each member
        let sql = `SELECT mp.memberid2,gm.name,gm.mobileno,gm.Address1,gm.Address2,gm.city,gm.pin,gm.email,gm.anniversarydate,gm.birthdate,gm.profilephotoid,mp.status,mp.enddate
            FROM (SELECT * FROM gymmanagement_t.memberplans WHERE (memberid2, startdate) IN (SELECT memberid2, MAX(startdate) AS max_startdate FROM gymmanagement_t.memberplans  WHERE subscriptionid = '${req.session.subsid}' GROUP BY memberid2)) mp
            LEFT JOIN  gymmanagement_t.gymmembers gm  ON  mp.subscriptionid = gm.subscriptionid  AND mp.memberid = gm.memberid WHERE  mp.subscriptionid = '${req.session.subsid}'
        `;
    
        gymcon.query(sql, function (err, result) {
            console.log(sql + " - 8989");
            if (err) {
                console.log(err);
                res.send("Error fetching data");
                return;
            } 
    
            if (result.length > 0) {
                let uniqueMembers = {};
    
                // Calculate active and inactive members from the joined result
                for (let i = 0; i < result.length; i++) {
                    let memberId2 = result[i].memberid2;
                    let status = result[i].status;
                    let endDate = new Date(result[i].enddate);
                    let isActive = endDate >= today && status === 'Active';
    
                    if (!uniqueMembers[memberId2] || isActive) {
                        uniqueMembers[memberId2] = {
                            isActive: isActive,
                            member: result[i]
                        };
                    }
                }
    
                let countActive = 0;
                let countInactive = 0;
    
                for (let memberId in uniqueMembers) {
                    if (uniqueMembers[memberId].isActive) {
                        countActive++;
                    } else {
                        countInactive++;
                    }
                }
    
                let totalplanmember = countActive + countInactive;
    
                // Second query to count total members from gymmembers for the given subscription ID
                let totalMembersSql = `
                    SELECT COUNT(DISTINCT memberid2) as totalMembers 
                    FROM gymmanagement_t.gymmembers 
                    WHERE subscriptionid='${req.session.subsid}'
                `;
                gymcon.query(totalMembersSql, function (err, totalResult) {
                    if (err) {
                        console.log(err);
                        res.send("Error calculating total members");
                        return;
                    } 
    
                    let totalMembers = totalResult[0].totalMembers;
                    console.log(totalMembers + " - totalMembers");
    
                    // Create HTML output
                    let out = "<table id='report'><tr><th>Total Members</th><th>Total Members in Plan</th><th>Active Member Plan</th><th>Deactive Member Plan</th></tr>";
                    out += `<tr><td onclick=showtotalmember();>${totalMembers}</td><td onclick=showtotalplanmember();>${totalplanmember}</td><td>${countActive}</td><td>${countInactive}</td></tr>`;
                    out += "</table>";
    
                    res.send(out);
                });
            } else {
                res.send("No Data");
            }
        });
    }
    
    //*** */
   
    else if (req.body.action == "showdashboardattendance") {
        let today = new Date();
        let todayStr = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        let subscriptionidFilter = req.session.subsid;
    
        let sqlPlans = `SELECT COUNT(DISTINCT mp.memberid2) AS total_members,COUNT(DISTINCT CASE WHEN ma.memberid2 IS NOT NULL THEN mp.memberid2 END) AS marked_attendance,COUNT(DISTINCT CASE WHEN ma.memberid2 IS NULL THEN mp.memberid2 END) AS not_marked_attendance
            FROM (SELECT * FROM gymmanagement_t.memberplans WHERE (memberid2, startdate) IN (SELECT memberid2, MAX(startdate) AS max_startdate FROM gymmanagement_t.memberplans WHERE subscriptionid = '${subscriptionidFilter}' GROUP BY memberid2)) mp
            LEFT JOIN gymmanagement_t.mattendance ma ON  mp.memberid2 = ma.memberid2 AND  DATE(ma.indate) = '${todayStr}' WHERE mp.subscriptionid ='${subscriptionidFilter}'`;
    
        gymcon.query(sqlPlans, function(err, result) {
            console.log(sqlPlans + " &&&&&&&")
            if (err) {
                console.log(err);
                res.send("Error fetching data");
                return;
            }
    
            let totalMembers = result[0].total_members;
            let markedAttendance = result[0].marked_attendance;
            let notMarkedAttendance = result[0].not_marked_attendance;
    
            let out = "<table id='report'><tr><th>Total Members Add On Plan</th><th>Marked Attendance</th><th>Not Marked Attendance</th></tr>";
            out += `<tr>
                        <td>${totalMembers}</td>
                        <td>${markedAttendance}</td>
                        <td>${notMarkedAttendance}</td>
                    </tr>`;
            out += "</table>";
    
            res.send(out);
        });
    }
    
    
    else if(req.body.action == "seebalencereport"){
        let sdate = req.body.sdate
        let edate = req.body.edate
        sdate = sdate + " 00:00:00"
        edate = edate+" 23:59:59"
        let onname = req.body.onname
        let onnumber = req.body.onnumber
        let totalbalance = 0;
        let sql = "select gymmembers.memberid2,gymmembers.name,gymmembers.mobileno,memberplans.amount,memberplans.startdate,memberplans.enddate, memberpayments.balancedate as t1,memberpayments.balance from gymmembers join memberpayments on gymmembers.subscriptionid=memberpayments.subscriptionid and gymmembers.memberid=memberpayments.memberid join memberplans on gymmembers.memberid=memberplans.memberid and gymmembers.subscriptionid=memberplans.subscriptionid where gymmembers.subscriptionid like '"+req.session.subsid+"' and gymmembers.name like'%"+onname+"%' and gymmembers.mobileno like'%"+onnumber+"%' and memberpayments.balancedate between '"+sdate+"' and '"+edate+"' and memberplans.status='Active' and memberpayments.paymentdate in(select MAX(memberpayments.paymentdate) from memberpayments where memberplans.memberid=memberpayments.memberid and memberpayments.subscriptionid like'"+req.session.subsid+"') order by memberpayments.paymentdate desc" 
        gymcon.query(sql,function(err, result){
            console.log(sql + " - 8989")
            if(err) console.log(err)
            else if(result.length>0){
                out = "<table id='report'><tr><th>Member ID</th><th>Name</th><th>Mobile No.</th><th>Remaining Fees</th><th>Due Date</th><th>Total Fees</th><th>Action</th></tr>"
                for(let i=0;i<result.length;i++){
                    var sdate=new Date(result[i].startdate)
                    var edate=new Date(result[i].enddate)
                    var pdate=new Date(result[i].t1)
                    var balance = result[i].balance
                    if(balance==null || balance=='' || balance == undefined){
                        balance
                    }else{
                        totalbalance += balance
                    } 
                    edate = edate.getFullYear() + '-' + ('0' + (edate.getMonth() + 1)).slice(-2) + '-' + ('0' + edate.getDate()).slice(-2);
                    if(edate==='NaN-aN-aN' || edate==='' || edate === null){
                        edate = ''
                    }
                    pdate = pdate.getFullYear() + '-' + ('0' + (pdate.getMonth() + 1)).slice(-2) + '-' + ('0' + pdate.getDate()).slice(-2);
                    if(pdate==='NaN-aN-aN' || pdate==='' || pdate === null){
                        pdate = ''
                    }
                    sdate = sdate.getFullYear() + '-' + ('0' + (sdate.getMonth() + 1)).slice(-2) + '-' + ('0' + sdate.getDate()).slice(-2);                
                    out = out + "<tr><td onclick=popmemberreport2('"+result[i].mobileno+"')>" + result[i].memberid2 + "</td><td>" + result[i].name+ "</td><td>" + result[i].mobileno + "</td><td>" + balance + "</td><td>" +pdate+ "</td><td>"+result[i].amount+"</td><td><button onclick=sendesssage('"+result[i].mobileno+"')><i class='fa fa-whatsapp' style='font-size:24px;'></button></td></tr>" 
                }
                out = out + "<tr><td></td><td></td><td>Total Remainig Fees</td><td>"+totalbalance+"</td><td></td><td></td><td></td></table>"
                res.send(out)
            }else{
                res.send("No Data")
            }
        })
    }
    //gym report
    else if(req.body.action == "showtotalmember"){
        let sql = "select * from  gymmembers  where subscriptionid='"+req.session.subsid+"' " 
        gymcon.query(sql,function(err, result){
            console.log(sql + " - 8989")
            if(err) console.log(err)
            else if(result.length>0){
                let birthdate ;
                let anniversarydate;
                out = "<table id='report'><tr><th>Member ID</th><th>Name</th><th>Mobile No.</th><th>Address1</th><th>email</th><th>city</th><th>pin</th><th>anniversarydate</th><th>birthdate</th></tr>"
                for(let i=0;i<result.length;i++){
                    let name=result[i].name;
                    if(name == 'undefined' || name == undefined || name == 'null' || name == null){
                        name = ''
                    }
                    let mobileno=result[i].mobileno;
                    if(mobileno == 'undefined' || mobileno == undefined || mobileno == 'null' || mobileno == null){
                        mobileno = ''
                    }
                    let Address1=result[i].Address1;
                    if(Address1 == 'undefined' || Address1 == undefined || Address1 == 'null' || Address1 == null){
                        Address1 = ''
                    }
                    let city=result[i].city;
                    if(city == 'undefined' || city == undefined || city == 'null' || city == null){
                        city = ''
                    }
                    let email= result[i].email;
                    if(email == 'undefined' || email == undefined || email == 'null' || email == null){
                        email = ''
                    }
                    let memberid2=result[i].memberid2;
                    if(memberid2 == 'undefined' || memberid2 == undefined || memberid2 == 'null' || memberid2 == null){
                        memberid2 = ''
                    }
                    // let anniversarydate = result[i].anniversarydate;
                   
                    let anniversarydate = new Date(result[i].anniversarydate);
                    if(result[i].anniversarydate == null || result[i].anniversarydate == undefined || result[i].anniversarydate == ""){
                        anniversarydate = ''
                    }else{
                        anniversarydate = new Date(result[i].anniversarydate);
                        anniversarydate = anniversarydate.getFullYear() + '-' + ('0' + (anniversarydate.getMonth() + 1)).slice(-2) + '-' + ('0' + anniversarydate.getDate()).slice(-2)
                        if(anniversarydate === null || anniversarydate === undefined){
                            anniversarydate = ''
                        }
                    }
                    let birthdate = new Date(result[i].birthdate);
                    if(result[i].birthdate == null || result[i].birthdate == undefined || result[i].birthdate == ""){
                        birthdate = ''
                    }else{
                        birthdate = new Date(result[i].birthdate);
                        birthdate = birthdate.getFullYear() + '-' + ('0' + (birthdate.getMonth() + 1)).slice(-2) + '-' + ('0' + birthdate.getDate()).slice(-2)
                        if(birthdate === null || birthdate === undefined){
                            birthdate = ''
                        }
                    }
                    // var birthdate1 = birthdate.getDate() + '-' + ('0' + (birthdate.getMonth() + 1)).slice(-2) + '-' + birthdate.getFullYear();
                    // if(birthdate1 == 'undefined' || birthdate1 == null || birthdate1 == 'null' || birthdate1 == undefined || birthdate1 == 'NaN-aN-aN'){
                    //     birthdate1=''
                    // }
                    let pin=result[i].pin;
                    if(pin == 'undefined' || pin == undefined || pin == 'null' || pin == null){
                        pin = ''
                    }

                    out = out + "<tr><td>" +memberid2 + "</td><td>" +name+ "</td><td>" +mobileno + "</td><td>" + Address1 + "</td><td>" +email+ "</td><td>"+city+"</td><td>"+pin+"</td><td>"+anniversarydate+"</td><td>"+birthdate+"</td></tr>" 
                }
                res.send(out)
            }else{
                res.send("No Data")
            }
        })
    }
    else if(req.body.action == "showtotalplanmember"){
        // let sql = "SELECT gm.memberid2, gm.name, gm.mobileno, gm.Address1, gm.city, gm.pin, gm.email, mp.planid, mp.startdate, mp.enddate, mp.fee, mp.discount, mp.amount, mp.status FROM gymmembers gm LEFT JOIN memberplans mp ON gm.memberid2 = mp.memberid2 WHERE gm.subscriptionid='" + req.session.subsid + "'";
        let sql="SELECT gm.memberid2, gm.name, gm.mobileno, gm.Address1, gm.city, gm.pin, gm.email, mp.planid, mp.startdate, mp.enddate, mp.fee, mp.discount, mp.amount, mp.status FROM gymmembers gm LEFT JOIN (SELECT *  FROM memberplans  WHERE (memberid2, startdate) IN (SELECT memberid2, MAX(startdate) AS max_startdate FROM memberplans  GROUP BY memberid2)) mp ON gm.memberid2 = mp.memberid2  WHERE gm.subscriptionid = '"+req.session.subsid+"';"
        gymcon.query(sql, function(err, result) {
            console.log(sql + " - 8989")
            if (err) {
                console.log(err);
                res.send("Error fetching data");
                return;
            } else if (result.length > 0) {
                let out = "<table id='report'><tr><th>Member ID</th><th>Name</th><th>Mobile No.</th><th>Address1</th><th>City</th><th>Pin</th><th>Email</th><th>Plan Name</th><th>Start Date</th><th>End Date</th><th>Fee</th><th>Discount</th><th>Amount</th><th>Status</th></tr>";
                for (let i = 0; i < result.length; i++) {
                    let memberid2 = result[i].memberid2 || '';
                    let name = result[i].name || '';
                    let mobileno = result[i].mobileno || '';
                    let Address1 = result[i].Address1 || '';
                    let city = result[i].city || '';
                    let pin = result[i].pin || '';
                    let email = result[i].email || '';
                    let planid = result[i].planid || '';
                    let startdate = result[i].startdate || '';
                    let enddate = result[i].enddate || '';
                    let fee = result[i].fee || '';
                    let discount = result[i].discount || '';
                    let amount = result[i].amount || '';
                    let status = result[i].status || '';
    
                    // Convert startdate and enddate to YYYY-MM-DD format
                    startdate = startdate ? new Date(startdate).toISOString().split('T')[0] : '';
                    // enddate = enddate ? new Date(enddate).toISOString().split('T')[0] : '';
    
                    out += "<tr><td>" + memberid2 + "</td><td>" + name + "</td><td>" + mobileno + "</td><td>" + Address1 + "</td><td>" + city + "</td><td>" + pin + "</td><td>" + email + "</td><td>" + planid + "</td><td>" + startdate + "</td><td>" + enddate + "</td><td>" + fee + "</td><td>" + discount + "</td><td>" + amount + "</td><td>" + status + "</td></tr>";
                }
                out += "</table>";
                res.send(out);
            } else {
                res.send("No Data");
            }
        });
    }
    
    
    else {
        console.log("unknown action")
    }
    
})
app.listen(port,()=>{
    console.log('Server started at  port ${port}')
})


// const optionsssl = {
//     key: fs.readFileSync("/home/cal100/certs/25feb23/cal25feb23.pem"),
//     cert: fs.readFileSync("/home/cal100/certs/25feb23/hostgator.crt"),
// };
// app.listen(55556, () => {
//      console.log(`Server started at  port ${55000}`);
// })
// https.createServer(optionsssl, app).listen(port);

