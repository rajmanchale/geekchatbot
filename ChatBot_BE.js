let express=require('express');
let mongodb= require('mongodb');
let cors=require('cors');
let bodyParser=require('body-parser');
let app=express();
//let bcrypt=require('bcrypt');
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

//OPTIONS
app.options("/*", function(request, response, next)
{
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
   
  response.sendStatus(200);
});


let initime;
//POST
app.post('/chatbox',function(request,response)
{
  let uri ='mongodb://localhost:27017';
  //let initime;
  // Initial Body
  
  if(request.body.flag==51)
  {
  	let uip=request.body.ip;
  	let country=request.body.country;
  	let state=request.body.state;
  	let city=request.body.city;
  	let session_flag=request.body.flag;
    console.log(uip+' '+country+' '+state+' '+city+' '+session_flag+'\n');
  	mongodb.MongoClient.connect(uri,function(error,client)
  	{
    	let db=client.db('sobha');
    	db.collection('sobha').findOne({'User_IP':uip},function(error,result)
    	{
    		if(error) throw error;
    		//Date and time
    		let Session= new Date();
    		initime=(Session.getHours()*3600)+(Session.getMinutes()*60)+Session.getSeconds();
    		let ses=Session.getHours()+':'+Session.getMinutes()+':'+Session.getSeconds()+" "+Session.getDate()+"/"+(Session.getMonth()+1)+"/"+Session.getFullYear();
    		//
    		if(result==null)
    		{
    		 	db.collection('sobha').insert({'User_IP':uip,'User_info':{'Name':'','Email':'','Phone':'','City':city,'State':state,'Country':country,'Visited_count':1},'Session':{'Session_start':[ses],'Session_end':[],'Time_spent':[]},'User_Query':[]},function(err,result){
    			response.status(200).json({success:true,msg:"New user saved"});
    			});
    		}
    		else if(result)
    		{
              //console.log(ses);
            	db.collection('sobha').update({User_IP:uip},{$inc:{'User_info.Visited_count':1},$push:{'Session.Session_start':ses}},function(err,result){
                response.status(200).json({success:true,msg:"User updated"});
            	});
    		}
    	});
  	});
 
  } 

 // Interactive Body
 if(request.body.flag==52)
 {	
   let uip=request.body.ip;
   let ureq=request.body.ureq;
   let pageurl=request.body.url;
   console.log(request.body.flag+'\t'+ureq+' '+uip);
   //WIT REQUESTS AND RESPONSE
   client.message(ureq, {}).then((data) =>
    {
        //console.log(data.entities.intent[0].value+"\n"+data._text);
        let obj=[];
        for(let key in data.entities)
        {
        	if(key=='intent')
            {}
        	else
        		obj.push(key);
        }
        
        // SAVING Data in MONGODB
        mongodb.MongoClient.connect(uri,function(error,db)
        {
          let dbi=db.db('sobha');
          if(error){console.log("error!!!");}
          dbi.collection('sobha').update({User_IP:uip},{$push:{User_Query:{$each:obj}}},function(error,result)
          {
          	if(error) throw error;
          	if(result==null){console.log('User_Query is empty');}
          });
        });
        response.json({success:true,wr:JSON.stringify(data.entities.intent[0].value)});
    }).catch(console.error);
  
 }
 
 // Final Body
 
 if(request.body.flag==53)
 { 
  console.log(request.body.flag+" "+request.body.ip);
  //console.log(initime+'\n'+typeof(initime));
  let phone=request.body.phone;
  let email=request.body.email;
  let name=request.body.name;
  let uip=request.body.ip;
  let extime=new Date();
  let exx=extime.getHours()+':'+extime.getMinutes()+':'+extime.getSeconds()+" "+extime.getDate()+"/"+(extime.getMonth()+1)+"/"+extime.getFullYear();
    		
  //saving phone,name,email and session
  mongodb.MongoClient.connect(uri,function(error,client)
  {
  	if(error) throw error;
    let db=client.db('sobha');
    //Date and time
    let extime=new Date();
    let qtim= (extime.getHours()*3600)+(extime.getMinutes()*60)+extime.getSeconds();
    let tdiff=(qtim - initime)/60;
    console.log(initime+' '+qtim+' '+tdiff+'\n'+typeof(initime)+' '+typeof(qtim)+' '+typeof(tdiff));
    let exx=extime.getHours()+':'+extime.getMinutes()+':'+extime.getSeconds()+" "+extime.getDate()+"/"+(extime.getMonth()+1)+"/"+extime.getFullYear();
    //
    db.collection('sobha').update({User_IP:uip},{$set:{'User_info.Name':name,'User_info.Email':email,'User_info.Phone':phone},$push:{'Session.Session_end':exx,'Session.Time_spent':tdiff}},function(err,result){
    	if(err) throw err;
    	console.log('Final Update done:'+'\t'+result);
     });
  });
   response.status(200).json({success:true,msg:"Closing session"});
 } 
  
});