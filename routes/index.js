var express = require('express');
var db = require('../controller/mssql_connector')
var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/admin', function(req, res, next) {
  db.get_all_groups().then(function(result){
    console.log('groups :',result);
    res.render('admin',{
      groups : result.recordset
    });
  })  
  
});


router.post('/login', function(req, res) {
  var user = req.body.user;
  var pass = req.body.password;
  console.log('recv :',user,pass);
  db.getUser(user,pass).then(function(result){
    console.log('auth:',result);
    if(result){
      res.redirect('/admin')
    }else{
      res.render('error',{
        title : "Auth error",
        msg : 'username or password wrong , please try again'
      })
    }
  });
  
  // ...
});



module.exports = router;
