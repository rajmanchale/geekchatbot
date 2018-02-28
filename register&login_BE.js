let express=require('express');
let mongodb= require('mongodb');
let cors=require('cors');
let bodyParser=require('body-parser');
let app=express();
let jwt=require('jsonwebtoken');
let bcrypt=require('bcrypt');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let port=5000;
//Server up 
app.listen(port,function(){console.log('Express listening on '+ port);});
//CORS
app.use(cors());

//Authentication and validation

//LOGIN PAGE

app.post('/login',function(request,response)
{
    let uri ='mongodb://localhost:27017';
    let name=request.body.name;
    let password=request.body.password;
    //let b;
    mongodb.MongoClient.connect(uri,function(err,client)
    {
    	let db=client.db('login');
    	db.collection('login').findOne({Name:name},function(err,result){
    		if(err) throw err;
    		if(result==null)
    	    {
    			response.json({success:false,msg:"Wrong username"});
    			console.log('result is null');
    	    }
    		else
    		{
    			console.log(result+" "+typeof(result)+"\n"+result['Password']+"\n"+result['Name']);
    			console.log('Saved pass: '+result['Password']);
    			let hash=result['Password'];
    			const token = jwt.sign({GCA:"geekventure"},"Geeky@Dragon7",{ expiresIn:3600 });
    			console.log(hash);
    			bcrypt.compare(password,hash,function(err, res)
                {
                   console.log(res);
                   if(res)
                   	{
                   		console.log('Password correct!');
                   		response.json({success:true,token:token});
                   	}
                   else if(!res)
                   	{
                   		console.log('Wrong Password!!!');
                   		response.json({success:false,msg:'Wrong password'});
                   	}
                });
    		}

    	});
    });
    
    // REGISTRATION CODE SNIPPET

    /*bcrypt.genSalt(10, function(err, salt)
    {
       if(err) throw err;
       bcrypt.hash(password, salt, function(err, hash)
       {
          let newpass=hash;
          // MONGODB

          mongodb.MongoClient.connect(uri,function(error,client)
          {
              var db = client.db('login');
              if(error){console.log("Connection Error!!!");}
              console.log(password);
              db.collection('login').insert({'Name':name,'Password':newpass},function(error,result)
              {
                  if(error){console.log("error");process.exit(1);}
                  console.log(result);
              });
              response.sendStatus(200);
          });
        });
    });*/
});

//CODE FOR RETRIEVING DATA FROM DB

app.get('/*',function(req,res)
{
	console.log('Getting Charts!!');
    let uri ='mongodb://localhost:27017';
    //let flag=req.body.flag;
    //if(flag==69)
    mongodb.MongoClient.connect(uri,function(error,client)
   {
    let db=client.db('sobha');
    db.collection('sobha').find({}).toArray(function(err,result)
    {
        if(err) throw err;
        else
        {  
        	//console.log(result);
        	//res.json(result);
        	result.forEach(function(doc){
        		console.log('DOCS FROM DB:\n')
        		console.log(doc);
        	});
        	res.status(200).json(result);
        }
    });
   });
});


