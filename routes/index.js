'use strict';
var express = require('express');
var location = require('../controller/locationDatas')
var db = require('../controller/mssql_connector')
var randomstring = require("randomstring");
var moment = require('moment');
const fs = require('fs');

var router = express.Router();
const auth = (req, res, next) => {
  /* ตรวจสอบว่า authorization คือ Boy หรือไม่*/
  if (req.cookies.userId !== undefined)
    next(); //อนุญาตให้ไปฟังก์ชันถัดไป
  else
    res.send("ไม่มีสิทธิในการเข้าถึง")
};

router.get('/', function (req, res, next) {
  if(req.cookies.userId !== undefined){
    res.redirect('/admin')
  }else{
    res.render('index');
  }
  
});
router.get('/logout', function (req, res, next) {
  res.clearCookie("userId");
  res.clearCookie("displayName");
  res.redirect('/')
});
router.get('/showGroup', auth, async function (req, res, next) {
  const groupId = req.query.id;
  var datas = location.getLocations();
  let members = await db.list_members_in_group(groupId);
  console.log('list members :', members.recordset);
  db.getGroupInfo(groupId).then(function (response) {
    if (response) {
      console.log('res :', response)
      res.render('editGroup', {
        locations: datas,
        groupData: response.recordset[0],
        members: members.recordset,
        displayName : req.cookies.displayName
      });
    }
  })

});
router.get('/deleteGroup', auth, function (req, res, next) {
  const groupId = req.query.groupId;
  db.groupDelete(groupId).then(function(result){
    if(result){
      console.log('delete status :',result);
      res.redirect('/admin')
    }
  })

});
router.get('/createGroup', auth, function (req, res, next) {
  var datas = location.getLocations();
  // const categories = [...new Set(datas.map(data => data['province']))]
  // for(var item of data){
  //   console.log(item['province']);
  // }
  // console.log(categories)
  res.render('createGroup', {
    locations: datas,
    displayName : req.cookies.displayName
  });
});
router.get('/memberEdit', auth, function (req, res, next) {
  const memberId = req.query.memberId;
  
  db.get_member_from_id(memberId).then(function(result){
    console.log('member info ',result.recordset[0])
    res.render('editMember', {
      memberInfo: result.recordset[0],
      displayName : req.cookies.displayName
    });
  })
  
});
router.get('/admin', auth, function (req, res, next) {
  db.get_all_groups().then(function (result) {
    console.log('groups :', result);
    res.render('admin', {
      groups: result.recordset,
      displayName : req.cookies.displayName
    });
  })
});

router.get('/addMemberToGroup', auth, function (req, res, next) {
  const groupId = req.query.groupId;
  const groupName = req.query.groupName;
  res.render('createMember', {
    groupId: groupId,
    groupName: groupName,
    displayName : req.cookies.displayName
  })
});
router.post('/newGroupForm', auth, function (req, res) {
  var groupName = req.body.groupName;
  var inchargeName = req.body.inchargeName;
  var inchargeLastName = req.body.inchargeLastName;
  var locationText = req.body.locationText;
  var province = req.body.province;
  var amphoe = req.body.amphoe;
  var district = req.body.district;
  var zipcode = req.body.zipcode;
  console.log(groupName, inchargeName,
    inchargeLastName,
    locationText,
    province,
    amphoe,
    zipcode,
    district)
  db.create_new_groups(groupName, inchargeName, inchargeLastName, locationText, province, amphoe, district, zipcode).then(function (result) {
    console.log('insert result is', result);
    res.redirect('/admin');
  });
});
router.post('/editGroupForm', auth, function (req, res) {
  var backURL = req.header('Referer') || '/';
  var groupName = req.body.groupName;
  var inchargeName = req.body.inchargeName;
  var inchargeLastName = req.body.inchargeLastName;
  var locationText = req.body.locationText;
  var province = req.body.province;
  var amphoe = req.body.amphoe;
  var district = req.body.district;
  var zipcode = req.body.zipcode;
  var groupId = req.body.groupId;
  console.log(groupName, inchargeName,
    inchargeLastName,
    locationText,
    province,
    amphoe,
    zipcode,
    district)
  db.edit_groups(groupName, inchargeName, inchargeLastName, locationText, province, amphoe, district, zipcode, groupId).then(function (result) {
    console.log('edit result is', result);
    res.redirect(backURL);
  });
});

router.post('/login', function (req, res) {
  var user = req.body.user;
  var pass = req.body.password;
    console.log('recv :', user, pass);
    db.getUser(user, pass).then(function (result) {
      console.log('auth:', result);
      if (result !== false) {
        res.cookie('userId', result.userId)
        res.cookie('displayName', result.userName)
        res.redirect('/admin')
      } else {
        res.render('error', {
          title: "Auth error",
          msg: 'username or password wrong , please try again'
        })
      }
    });
  

  // ...
});
router.post('/newMemberForm', auth, function (req, res) {
  var backURL = req.header('Referer') || '/';
  var groupId = req.body.groupId;
  var memberName = req.body.memberName;
  var memberLastName = req.body.memberLastName;
  var memberThaiId = req.body.memberThaiId;
  var memberMobileNumber = req.body.memberMobileNumber;
  var memberShirtNumber = req.body.memberShirtNumber;
  var motorcycleBrand = req.body.motorcycleBrand;
  var motorcycleColor = req.body.motorcycleColor;
  var memberLicenseNumber = req.body.memberLicenseNumber;
  var memberLicenseType = req.body.memberLicenseType;
  var memberMotorcycleSerial = req.body.memberMotorcycleSerial;
  var gender = req.body.gender;
  db.create_new_members(groupId, memberName, memberLastName, memberThaiId, memberMobileNumber, memberShirtNumber, motorcycleBrand, motorcycleColor, memberLicenseNumber, memberLicenseType, memberMotorcycleSerial, gender).then(
    function (result) {
      console.log('new member result :', result);
      res.redirect(`/showgroup?id=${groupId}`);
    }
  )
})
router.post('/editMemberForm', auth, function (req, res) {
  var backURL = req.header('Referer') || '/';
  var groupId = req.body.groupId;
  var memberName = req.body.memberName;
  var memberLastName = req.body.memberLastName;
  var memberThaiId = req.body.memberThaiId;
  var memberMobileNumber = req.body.memberMobileNumber;
  var memberShirtNumber = req.body.memberShirtNumber;
  var motorcycleBrand = req.body.motorcycleBrand;
  var motorcycleColor = req.body.motorcycleColor;
  var memberLicenseNumber = req.body.memberLicenseNumber;
  var memberLicenseType = req.body.memberLicenseType;
  var memberMotorcycleSerial = req.body.memberMotorcycleSerial;
  var gender = req.body.gender;
  db.edit_members( memberName, memberLastName, memberThaiId, memberMobileNumber, memberShirtNumber, motorcycleBrand, motorcycleColor, memberLicenseNumber, memberLicenseType, memberMotorcycleSerial, gender).then(
    function (result) {
      console.log('edit member result :', result);
      res.redirect(`/showgroup?id=${groupId}`);
    }
  )
});
router.post('/searchGroup', auth, function (req, res) {
  var groupKeyword = req.body.groupKeyword;
  console.log('recv',groupKeyword);
  db.searchGroup(groupKeyword).then(function(response){
    console.log('res count:',response.rowsAffected);
    // res.send(response);
    res.render('groupSearchShow', {
      keyword : groupKeyword,
      groups: response.recordset,
      displayName : req.cookies.displayName
    });
  });
  
  
});
router.post('/searchPerson', auth, function (req, res) {
  var personKeyword = req.body.personKeyword;
  console.log('recv',personKeyword);
  db.searchPerson(personKeyword).then(function(response){
    console.log('res count:',response.rowsAffected);
    res.render('personSearchShow', {
      keyword : personKeyword,
      person: response.recordset,
      displayName : req.cookies.displayName
    });
  });
  
  
});
router.post('/upload', function(req, res) {
  var personId = req.body.personId;
  console.log('recv person id ====>',personId)
  console.log(req.files);
  if(req.files.length >0){
    db.upload(req.files[0]['buffer'],personId).then(function(resp){
      console.log("upload res ==>",resp);
      res.redirect('back');
    });
  }else{
    res.render('error',{
      title:"อัพโหลดผิดพลาด",
      msg: "ไม่พบเอกสาร หรือ เอกสารไม่ถูกต้อง"
    })
  }
  
  
});

router.post('/pre_download', function(req, res){
  var personId = req.body.personId;
  db.get_member_from_id(personId).then(function(result){
    console.log('member info ',result.recordset[0]);
    const person = result.recordset[0];
    if(person.docs){
      var fileContents = Buffer.from(person.docs, "binary");
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=${person.personId}.pdf`,
      });
      res.end(fileContents);  
    }else{
      res.render('error',{
        title:"ดาวน์โหลดผิดพลาด",
        msg: "ไม่พบเอกสาร หรือ เอกสารไม่ถูกต้อง"
      })
    }
  });
});
router.get('/userList', auth, function (req, res) {
  var personKeyword = req.body.personKeyword;
  console.log('recv',personKeyword);
  db.userLookup().then(function(response){
    console.log('user res :',response);
    res.render('userShow', {
      person: response,
      displayName : req.cookies.displayName
    });
  });
  
  
});
router.get('/createUser', auth, function (req, res) {
  res.render('createUser', {
    
    displayName : req.cookies.displayName
  });  
});

router.post('/newUserForm', auth, function (req, res) {
  var backURL = req.header('Referer') || '/';
  var memberName = req.body.memberName;
  var memberLastName = req.body.memberLastName;
  var userName = req.body.userName;
  var password = req.body.password;
  var email = req.body.email;
  
  db.create_new_user(memberName, memberLastName,userName,password,email).then(
    function (result) {
      console.log('new user result :', result);
      res.redirect('/userList');
    }
  );
})

module.exports = router;
