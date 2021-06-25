const handleSignin = (req,res,knex,bcrypt,generatetoken) => {
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
        else {
        res.status(400).json("details doesn't match");    
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
}

module.exports = {
	handleSignin: handleSignin
}