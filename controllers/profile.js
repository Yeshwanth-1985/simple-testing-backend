const handleProfile = (req,res,knex) => {
  knex.select('*').from('users').where({email: req.user.email})
  .then(data => {
    if(data.length){
      res.json(data[0]);
      }
      else 
        res.status(401).json("user not found");
    }
  )
}

module.exports = {
	handleProfile: handleProfile
}