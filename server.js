const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
require("dotenv").config();
app.use(express.json());

const posts = [
	{
		username: "yesh",
		title: "post 1"
	},
	{
		username: "yadav",
		title: "post 2"
	},
	{
		username: "yash",
		title: "post 3"
	}
];

const database = {
  users: [
  {
    id: '123',
    name: 'john',
    email: 'john@example.com',
    password: 'rgukt123',
    entries: 0,
    joined: new Date()
  
  },
  {
    id: '124',
    name: 'sally',
    email: 'sally@example.com',
    password: 'rahul123',
    entries: 0,
    joined: new Date()
  
  },
  {
    id: '125',
    name: 'yesh',
    email: 'yesh@example.com',
    password: 'rgukt123',
    entries: 0,
    joined: new Date()
  
  },
  {
    id: '126',
    name: 'yadav',
    email: 'yadav@example.com',
    password: 'rgukt321',
    entries: 0,
    joined: new Date()
  
  }
  ]
};

app.get('/posts',auth,(req,res) => {
	res.json(posts.filter(post => post.username==req.user.name));
})

app.post('/login',(req,res) => {
	let flag=false;
	const {email, password} = req.body;
	database.users.forEach((user,index) => {
        if(user.email === email && user.password === password)
        {
        	flag=true;
        	const accesstoken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
      		res.json({ accesstoken: accesstoken});
        }
    });
    if(!flag)
    	res.json("failed");
})

function auth(req,res,next) {
	const authHeader = req.headers['authorization']
	const token = authHeader && authHeader.split(' ')[1]
	if(token == null)
		res.status(400).json("invalid token")

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if(err)
			return res.status(400).json("invalid token");
		req.user = user;
		console.log("user",user);
		next();
	})
}

app.listen(3000);