let express=require('express');
let mongodb= require('mongodb');

let cors=require('cors');

let bodyParser=require('body-parser');
let app=express();
let bcrypt=require('bcrypt');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let port=4000;
app.listen(port,function(){console.log('Express listening on '+ port);});

//CORS
app.use(cors());


//WIT REQUIREMENTS:

const {Wit, log} = require('node-wit');
const {interactive} = require('node-wit');
//let uri ='mongodb://localhost:27017/sobha';
const client = new Wit({
  accessToken: 'YSF657EFAV2HMIUCJGHWP3MJAE2UTCXW',
  //logger: new log.Logger(log.DEBUG) // optional
});




//GET METHOD

app.get('/',function(request,response)
{
    response.send("Get Method!");
    console.log('getting');
});

app.get('/login',function(req,res)
{
    res.send("login page");
    console.log("Login page!");
});

// OPTIONS METHOD

app.options("/*", function(request, response, next)
{
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
   
  response.sendStatus(200);
});


//POST METHODS

//LOGIN PAGE

app.post('/login',function(request,response)
{
    let uril ='mongodb://localhost:27017';
    //console.log(request.body);
    let name=request.body.name;
    let password=request.body.password;
    let b;

    // BCRYPT

    bcrypt.genSalt(10, function(err, salt)
    {
       if(err) throw err;
       bcrypt.hash(password, salt, function(err, hash)
       {
          if(err) throw err;
          bcrypt.compare(password, hash, function(err, res)
          {
            console.log(res);
            b=res;
          });

          // MONGODB

          //mongodb.MongoClient.connect(uril,function(error,db)
          mongodb.MongoClient.connect(uril,function(error,db)
          {
              var db = db.db('login');
              if(error){console.log("Connection Error!!!");}
              db.collection('login').findOne({Name:name,Password:password},(err,result)=>
              {
                if(err){ throw err;process.exit(1);}
                console.log(result);
                if(result==null)
                    {response.sendStatus(301);}
                else
                    {response.sendStatus(200);}
              });

              console.log(password);
              db.collection('login').insert({'Name':name,'Password':password},function(error,result)
              {
                  if(error){console.log("error");process.exit(1);}
                  console.log(result);
              });
              //response.sendStatus(200);
          });
        });
    });
});


//CHATBOX || DASHBOARD

app.post('/chatbox',function(request,response)
{
  let urid ='mongodb://localhost:27017';
  //console.log(request.body);
  let ureq=request.body.ureq;
  let uip=request.body.ipadd;
  let country=request.body.country;
  let state=request.body.state;
  let city=request.body.city;
  let phone=request.body.phone;
  let email=request.body.email;
  let name=request.body.name;
  let session_flag=request.body.flag;
  //let wit_res;
  //let b;
  
  // SESSION
  let sestart;let sesend;let ttime;let tdiff;


  if(session_flag)
  {
  	let Session=new Date();
  	sestart=Session.getHours()+':'+Session.getMinutes()+':'+Session.getSeconds()+" "+Session.getDate()+"/"+(Session.getMonth()+1)+"/"+Session.getFullYear();
  }
  else
  {
  	let Sess= new Date();
  	sesend=Sess.getHours()+':'+Sess.getMinutes()+':'+Sess.getSeconds()+" "+Sess.getDate()+"/"+(Sess.getMonth()+1)+"/"+Sess.getFullYear();
  }
  //MONGODB

  /*mongodb.MongoClient.connect(urid,function(error,db)
  {
    if(error){console.log("Connection Error!!!");}
    var db = db.db('dashboard');
    db.collection('dash').findOne({'UserIP':uip},(err,result)=>
    {
      if(result==null)
      {
        db.collection('dash').insert({'UserRequest':ureq,'UserIP':uip,'Ucity':city,'Ustate':state,'Ucountry':country},function(error,result)
        {
          if(error){console.log("error");process.exit(1);}
          console.log(result);
        });
        response.status(200),json({msg:"New user inserted into DB"});
      }
      else
      {
      	response.json(result);
      }
    });
       
    db.collection('dash').insert({'UserRequest':ureq,'UserIP':uip},function(error,result)
    {
      if(error){console.log("error");process.exit(1);}
      console.log(result);
    });*/
       
    //SENDING QUERY TO WIT.ai AND RETRIVING RESPONSE

    client.message(ureq, {}).then((data) =>
    {
        console.log(data.entities.intent[0].value+"\n"+data._text);
        let obj=[];
        for(let key in data.entities)
           obj.push(key);
        //console.log('\n'+obj+'\n');
        // SAVING Data in MONGODB
        mongodb.MongoClient.connect('mongodb://localhost:27017',function(error,db)
        {
          let dbi=db.db('sobha');
          if(error){console.log("error!!!");}
          dbi.collection('sobha').update({upsert:true,'User_IP':uip,'User_info':{'Country':country,'State':state,'City':city,'Phone':phone,'Email':email,'Name':name},'User_Query':obj,'Session':{'Session_start':sestart,'Session_end':sesend}},function(error,result)
          {
            if(error){console.log("error");process.exit(1);}
            console.log(result);
          });
        });
        response.json({success:true,wr:JSON.stringify(data.entities.intent[0].value)});
    }).catch(console.error);
  //}); 
});


// RETRIVE DATA TO SEND TO DASBOARD 
  