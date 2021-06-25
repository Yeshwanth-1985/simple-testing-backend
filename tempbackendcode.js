const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
require("dotenv").config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'rgukt123',
    database : 'smart-brain'
  }
});

app.post('/profile',auth,(req,res) => {
  knex.select('*').from('users').where({email: req.user.email})
  .then(data => {
    if(data.length){
      res.json(data[0]);
      }
      else 
        res.status(401).json("user not found");
    }
  )
})

app.post('/login',(req,res) => {
	let flag=false;
	let {email, password} = req.body;
  if(email && password){
  knex.select('email','hash').from('login').where({email})
  .then(data => {
    if(data.length)
    {
      if(bcrypt.compareSync(password,data[0].hash))
        {
            knex.select('*').from('users').where({email})
            .then(user => {
            accesstoken = generatetoken(user[0]);
            res.json({accesstoken});
            })
            .catch(err => res.status(400).json("invalid details and can't signin db"));        
        }
    }
    else {
      res.status(400).json("details not found");
    }
  })
  .catch(err => res.status(400).json("db error and can't signin"))
  }
  else {
    res.status(400).json("invalid details and can't signin db");
  }
})

app.post('/register',(req,res) => {
 let {email, username, password} = req.body;

 if(email && username && password)
 {
    password = bcrypt.hashSync(password, 10);

  knex.transaction(trx => {
      trx.insert({
      hash: password,
      email: email  
      })
      .into('login')
      .returning('email')
      .then(loginemail => {

      knex('users').insert({name: username,
      email: loginemail[0],
      joined: new Date()
      })
    .returning('*')
    .then(data => {
      console.log(data[0]);
      const accesstoken = generatetoken(data[0]);
      res.json({accesstoken});
    })
    .catch(err => res.status(401).json("40101"));
      })
      .then(trx.commit)
      .catch(trx.rollback);
    })
    .catch(err => res.status(400).json("40101"));
 }
 else {
  res.status(401).json("40103");
 }
})

function auth(req,res,next) {
	const authHeader = req.headers['authorization']
  console.log(authHeader);
	const token = authHeader && authHeader.split(' ')[1]
	if(token == null){
    console.log(null);
		res.status(400).json("invalid token")
  }

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if(err)
			return res.status(400).json("invalid token");
		req.user = user;
		console.log("front user",user);
		next();
	})
}

function generatetoken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
}

app.listen(4000);