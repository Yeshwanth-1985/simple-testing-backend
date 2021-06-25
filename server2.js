const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const signin = require('./controllers/signin.js');
const register = require('./controllers/register.js');
const profile = require('./controllers/profile.js');

const app = express();
require("dotenv").config();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
  }
});

app.post('/profile',auth,(req,res) => {profile.handleProfile(req,res,knex)});

app.post('/login',(req,res) => {signin.handleSignin(req,res,knex,bcrypt,generatetoken)});

app.post('/register',(req,res) => {register.handleRegister(req,res,knex,bcrypt,generatetoken)});

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

app.listen(process.env.PORT || 4000, () => {
  console.log(`port is running at ${process.env.PORT}`);
});