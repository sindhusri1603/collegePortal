const express =require('express')
const bdy=require('body-parser')
const dbo=require('./mongo')
//
const multer=require('multer')
// const { google } = require('googleapis');
// const { OAuth2 } = google.auth;
const nodemailer = require('nodemailer');
const upload = multer({ dest: 'uploads/' })
const ejs = require('ejs');
const path=require('path')
const puppeteer=require('puppeteer')
const { log } = require('console')
const app=express()
app.use(bdy.urlencoded({extended:true}))


app.set('view engine','ejs')
app.use(express.static("public"))
stud_roll="";
stud_nme=""
stud_yr=""
staff_name=""
app.get("/",async function(req,res){
    let database=await dbo.getdata();
    const collection=database.collection('users')
    const cursor=collection.find({})
    let users=await cursor.toArray()
    console.log("connected to db");
    res.render('sreg')
})
app.post("/slogin",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('users')
    const cursor=collection.findOne({nme:req.body.nnme,pss:req.body.npss})
    let emp=await cursor
    if(!emp){
        res.redirect('slogin')
    }
    else{
        stud_nme=emp.snme
        stud_roll=emp.nme
        stud_yr=emp.yjoin
        res.render('entry')
    }
})
app.get("/entry",function(req,res){
    res.render('entry')
})
app.get("/Marks",async function(req,res){
    /**/ 
    console.log(stud_roll);
    let database=await dbo.getdata()
    const collection=database.collection('users')
    const cursor=collection.findOne({nme:stud_roll})
    let emp=await cursor
    console.log(emp);
    res.render('Marks',{emp})
})
app.get("/Sendmess",function(req,res){
    res.render('Sendmess')
})
app.post("/Sendmess",async function(req,res){
    var datetime = new Date();
    let database=await dbo.getdata()
    const collection=database.collection('mess')
    let val={yr:req.body.year,mess:req.body.mss,nme:staff_name,date:datetime.toISOString().slice(0,10),who:"staff"}
    await collection.insertOne(val);
    console.log(val);
    res.redirect("tentry")
})
app.get("/ssendmess",function(req,res){
    console.log("Neomw");
    res.render('ssendmess')
})
app.post("/ssendmess",async function(req,res){
    var datetime = new Date();
    let database=await dbo.getdata()
    const collection=database.collection('mess')
    let val={yr:stud_yr,mess:req.body.mss,nme:stud_nme,date:datetime.toISOString().slice(0,10),who:"student"}
    await collection.insertOne(val);
    const cursors=collection.find({yr:stud_yr})
    let emps=await cursors.toArray()
    console.log("Hello");
    console.log(emps);
    console.log(emps.date);
    res.render('Dmess',{emp:emps })
})
app.get("/Dmess",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('mess')
    const cursor=collection.find({yr:stud_yr})
    let emp=await cursor.toArray()
    res.render('Dmess',{emp })
})
app.get("/UMarks",function(req,res){
    res.render('UMarks')
})
app.get("/tlogin",function(req,res){
    res.render('tlogin')
})
app.get("/SdispIII",function(req,res){
    res.render('SdispIII')
})
app.get("/adminlogin",function(req,res){
    res.render("adminlogin")
})
app.get("/admin",function(req,res){
    res.render("admin")
})
app.get("/mail",function(req,res){
    res.render("mail")
})
app.post("/mail",function(req,res){
    var email=req.body.email
    //
    const oauth2Client = new OAuth2(
        'YOUR_CLIENT_ID',
        'YOUR_CLIENT_SECRET',
        'YOUR_REDIRECT_URI'
      );
      
      oauth2Client.setCredentials({
        refresh_token: 'YOUR_REFRESH_TOKEN'
      });
      
      const accessToken = oauth2Client.getAccessToken();
      
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'YOUR_EMAIL_ADDRESS',
          accessToken,
          clientId: 'YOUR_CLIENT_ID',
          clientSecret: 'YOUR_CLIENT_SECRET',
          refreshToken: 'YOUR_REFRESH_TOKEN',
        },
      });

})
app.post("/adminlogin",async function(req,res){
let database=await dbo.getdata()
    const collection=database.collection('admin')
    const cursor=collection.findOne({name:req.body.name,pss:req.body.pss})
    let emp=await cursor
    if(!emp){
        console.log(emp);
        res.redirect('adminlogin')
    }
    else{
        console.log(emp);
        res.redirect('admin')
    }
})
app.get("/vstaff",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('teacher')
    const cursor=collection.find()
    let emp=await cursor.toArray()
    res.render('vstaff',{emp})
})
app.get("/vstud",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('users')
    const cursor=collection.find()
    let emp=await cursor.toArray()
    res.render('vstud',{emp})
})
app.post("/UMarks",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('users')
    const name=req.body.year,sect=req.body.section,deptar=req.body.dept,mod=req.body.model
    const cursor=collection.find({yjoin:name,sec:sect,dept:deptar,type:"student"})
    let emp=await cursor.toArray()
    if(mod==='I'){
        res.render('SdispI',{emp})
    }
    else if(mod==='II')
    {
        res.render('SdispII',{emp})
    }
    else{
        res.render('SdispIII',{emp})
    }
})
app.post("/SdispI",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('users')
    const reg=req.body.nme
    const s1=req.body.s1
    const s2=req.body.s2
    const s3=req.body.s3
    const s4=req.body.s4
    const s5=req.body.s5
    var myquery = {nme: reg };
    var newvalues = { $set: {"I.s1":s1,"I.s2":s2,"I.s3":s3,"I.s4":s4,"I.s5":s5 } };
    collection.updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    res.render('SdispI')
  });
})
app.post("/SdispII",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('users')
    const reg=req.body.nme,s1=req.body.s1,s2=req.body.s2,s3=req.body.s3,s4=req.body.s4,s5=req.body.s5
    var myquery = {nme: reg };
    var newvalues = { $set: {"II.s1":s1,"II.s2":s2,"II.s3":s3,"II.s4":s4,"II.s5":s5 } };
    await collection.updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    res.render('SdispII')
    db.close();
  });
})
app.post("/SdispIII",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('users')
    const reg=req.body.nme,s1=req.body.s1,s2=req.body.s2,s3=req.body.s3,s4=req.body.s4,s5=req.body.s5
    var myquery = {nme: reg };
    var newvalues = { $set: {"III.s1":s1,"III.s2":s2,"III.s3":s3,"III.s4":s4,"III.s5":s5 } };
    await collection.updateOne(myquery, newvalues, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    res.render('SdispI')
    db.close();
  });
})
app.get("/View",function(req,res){
    res.render('View')
})
app.post("/View",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('users')
    const name=req.body.year,sect=req.body.section,deptar=req.body.dept,mod=req.body.model
    const cursor=collection.find({yjoin:name,sec:sect,dept:deptar,type:"student"})
    let emp=await cursor.toArray()
    res.render('IView',{emp})
})
app.get("/tentry",function(req,res){
    res.render('tentry')
})
app.post("/entry",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('users')
    let val={type:"student",nme:req.body.unme,snme:req.body.nam,sec:req.body.section,pss:req.body.pss,mno: req.body.umno ,dept:req.body.udept,yjoin:req.body.ujoin,I:{s1:0,s2:0,s3:0,s4:0,s5:0},II:{s1:0,s2:0,s3:0,s4:0,s5:0},III:{s1:0,s2:0,s3:0,s4:0,s5:0}}
    await collection.insertOne(val);
    console.log(val);
    res.redirect('slogin')
})
app.get("/treg",function(req,res){
    res.render('treg')
})
app.get("/imark",function(req,res){
    res.render('imark')
})
app.get("/dimark",async function(req,res){
    res.render('dimark')
})
inme="",isec="",idept=""
app.post("/imark",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('users')
    inme=req.body.year,isec=req.body.section,idept=req.body.dept
    const cursor=collection.find({yjoin:inme,sec:isec,dept:idept,type:"student"})
    let emp=await cursor.toArray()
    res.render('dimark',{emp})
})
app.get("/marking",function(req,res){
    res.render("marking")
})
    app.get("/download",async function(req,res){
        let database = await dbo.getdata();
        const collection = database.collection('users');
        const cursor = collection.find({ yjoin: inme, sec: isec, dept: idept, type: "student" });
        let emps = await cursor.toArray();
        console.log("yjoin "+inme+"sec "+isec+"dept "+idept);
        console.log(emps);
        try {
            const browser = await puppeteer.launch({ headless: true });
            const page = await browser.newPage();
            const content = await ejs.renderFile(path.join(__dirname, '/views/marking.ejs'), { emp: emps,dept:idept,yjoin:inme });
            await page.setContent(content);
            const pdfn = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "20px",
                bottom: "40px",
                left: "20px",
                right: "20px"
            }
            });
            await browser.close();
            res.set({
            "Content-Type": "application/pdf",
            "Content-Length": pdfn.length,
            "Content-Disposition": "attachment; filename=InternalMark_"+inme+".pdf"
            });
            res.send(pdfn);
        } catch (error) {
            console.log(error.message);
            res.status(500).send("Error occurred while generating PDF");
        }
    })

app.get("/tentry",function(req,res){
    res.redirect("tentry")
})
app.get("/slogin",function(req,res){
    res.render('slogin')
})
app.post("/tlogin",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('teacher')
    const cursor=collection.findOne({nme:req.body.nnme,pss:req.body.npss})
    let emp=await cursor
    if(!emp){
        console.log(emp);
        res.redirect('tlogin')
    }
    else{
        console.log(emp);
        staff_name=emp.nme
        res.redirect('tentry')
    }
})
app.post('./Udmarks',async function(req,res){
    let database=await dbo.getdata();
    const collection=database.collection('users')
    const cursor=collection.find({})
    let users=await cursor.toArray()
    const id=req.body.id
    console.log(id);
})
app.post("/tentry",async function(req,res){
    let database=await dbo.getdata()
    const collection=database.collection('teacher')
    let val={type:"teacher",nme:req.body.tnme,pss:req.body.tpss,mno: req.body.tmno ,dept:req.body.tdept,yjoin:req.body.tjoin}
    await collection.insertOne(val);
    console.log(val);
    res.redirect('tlogin')
})
app.listen(3000,function(req,res){
    console.log("Stating at 3000 server")    
})
