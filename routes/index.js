'use strict';
var express = require('express');
var location = require('../controller/locationDatas')
var db = require('../controller/mssql_connector')
const fs = require('fs');

var router = express.Router();


router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/createGroup', function(req, res, next) {
  var datas = location.getLocations();
  // const categories = [...new Set(datas.map(data => data['province']))]
  // for(var item of data){
  //   console.log(item['province']);
  // }
  // console.log(categories)
  res.render('createGroup',{
    locations:datas
  });
});
router.get('/admin', function(req, res, next) {
  db.get_all_groups().then(function(result){
    console.log('groups :',result);
    res.render('admin',{
      groups : result.recordset
    });
  })  
  
});
router.post('/newGroupForm', function(req, res) {
  var groupName = req.body.groupName;
  var inchargeName = req.body.inchargeName;
  var inchargeLastName = req.body.inchargeLastName;
  var locationText = req.body.locationText;
  var province = req.body.province;
  var amphoe = req.body.amphoe;
  var district = req.body.district;
  var zipcode = req.body.zipcode;
  console.log(groupName,inchargeName,
    inchargeLastName,
    locationText,
    province,
    amphoe,
    zipcode,
    district)
  db.create_new_groups(groupName,inchargeName,inchargeLastName,locationText,province,amphoe,district,zipcode).then(function(result){
    console.log('insert result is',result);
    res.redirect('/admin');
  });
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
