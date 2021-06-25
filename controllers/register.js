const handleRegister = (req,res,knex,bcrypt,generatetoken) => {
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
}

module.exports = {
	handleRegister: handleRegister
}