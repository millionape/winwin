var sql = require('mssql');
const randomString = require('random-base64-string')
var sqlConfig = {
  user: 'SA',
  password: 'Gun11092544#',
  server: '13.229.194.207',
  database: 'myDatabase',
  // options: {
  //   encrypt: true
  // }
};

exports.getUser = function (user, pass) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......")
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query('select * from users')
      //console.log(result.recordset)
      for (var auth of result.recordset) {
        if (user === auth.userLogin && pass === auth.userPassword) {
          console.log('auth is :',auth)
          resolve(auth);
        }
      }
      resolve(false);

    } catch (err) {
      console.log(err);
      resolve(false);

    }
  })
}
exports.userLookup = function (user, pass) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......")
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query('select * from users')
      //console.log(result.recordset)
      resolve(result.recordset);
    } catch (err) {
      console.log(err);
      resolve(false);

    }
  })
}
///////////////  GROUPS //////////////////////////////
exports.get_all_groups = function () {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......")
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query('select * from groups')
      //console.log(result.recordset)
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  })
}
exports.create_new_groups = function (groupName, inchargeName, inchargeLastName, locationText, province, amphoe, district, zipcode) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      const generatedId = randomString(12);
      let result = await pool.request().query(`INSERT INTO groups (groupId, groupName, inchargeName, inchargeLastName, locationInText , province , amphoe , district , zipcode) VALUES ('${generatedId}', '${groupName}', '${inchargeName}', '${inchargeLastName}','${locationText}','${province}','${amphoe}','${district}','${zipcode}')`);
      //console.log(result.recordset)
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  })
}
exports.edit_groups = function (groupName, inchargeName, inchargeLastName, locationText, province, amphoe, district, zipcode ,groupId) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      // const generatedId = randomString(12);
      let result = await pool.request().query(`UPDATE groups SET groupName='${groupName}', inchargeName='${inchargeName}', inchargeLastName='${inchargeLastName}',locationInText='${locationText}',province='${province}',amphoe='${amphoe}',district='${district}',zipcode='${zipcode}' WHERE groupId='${groupId}'`);
      //console.log(result.recordset)
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  })
}
exports.getGroupInfo = function (groupId) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query(`SELECT * FROM dbo.groups WHERE groupId='${groupId}'`);
      console.log('select result :',result);
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  });
}
exports.groupDelete = function (groupId) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query(`DELETE FROM groups WHERE groupId='${groupId}'`);
      console.log('select result :',result);
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  });
}


///////////////  GROUPS //////////////////////////////

///////////////// MEMBES //////////////////////////////////
exports.create_new_members = function (groupId, memberName, memberLastName, memberThaiId, memberMobileNumber, memberShirtNumber, motorcycleBrand, motorcycleColor,memberLicenseNumber,memberLicenseType,memberMotorcycleSerial,gender) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      const generatedId = randomString(12);
      let result = await pool.request().query(`INSERT INTO personInfo (groupId, personId, personName, personLastName, mobileNumber , shirtNumber , motorcycleBrand , motorcycleColor , licensePlate , licenseType , motorcycleSerial, gender) 
                                              VALUES ('${groupId}', '${memberThaiId}', '${memberName}', '${memberLastName}','${memberMobileNumber}','${memberShirtNumber}','${motorcycleBrand}','${motorcycleColor}','${memberLicenseNumber}','${memberLicenseType}','${memberMotorcycleSerial}','${gender}')`);
      //console.log(result.recordset)
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  })
}
exports.edit_members = function (memberName, memberLastName, memberThaiId, memberMobileNumber, memberShirtNumber, motorcycleBrand, motorcycleColor,memberLicenseNumber,memberLicenseType,memberMotorcycleSerial,gender) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query(`UPDATE personInfo SET personName='${memberName}', personLastName='${memberLastName}', mobileNumber='${memberMobileNumber}' , shirtNumber='${memberShirtNumber}' , motorcycleBrand='${motorcycleBrand}' , motorcycleColor='${motorcycleColor}' ,
                                                 licensePlate='${memberLicenseNumber}' , licenseType='${memberLicenseType}' , motorcycleSerial='${memberMotorcycleSerial}', gender='${gender}' WHERE personId='${memberThaiId}'`);
      //console.log(result.recordset)
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  })
}
exports.list_members_in_group = function(groupId){
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query(`SELECT indexes,personName,personLastName,personId,mobileNumber,shirtNumber,motorcycleBrand,motorcycleColor,licensePlate,licenseType FROM dbo.personInfo WHERE groupId='${groupId}'`);
      //console.log(result.recordset)
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  })
}
exports.get_member_from_id = function(memberId){
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query(`SELECT * FROM dbo.personInfo WHERE personId='${memberId}'`);
      //console.log(result.recordset)
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  })
}

///////////////// MEMBES //////////////////////////////////

exports.searchGroup = function (keyword) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query(`SELECT * FROM dbo.groups WHERE groupName LIKE '%${keyword}%'`);
      console.log('select result :',result);
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  });
}
exports.searchPerson = function (keyword) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query(`SELECT * FROM dbo.personInfo WHERE personName LIKE '%${keyword}%' OR personLastName LIKE '%${keyword}%'`);
      console.log('select result :',result);
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  });
}
exports.upload = function (files,personId) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool_res = await new sql.ConnectionPool(sqlConfig);
      pool_res.connect().then(async function(){
        var binBuff = new Buffer(files, 'binary');
        console.log('Buffer ==>',binBuff)
        console.log('personId ==>',personId)
        var ps = await new sql.PreparedStatement(pool_res);
        ps.input('theImage', sql.VarBinary);
        ps.prepare(`UPDATE personInfo SET docs=(@theImage) WHERE personId='${personId}'`, function (err) {
            // check err
            if(err) console.log("err first ==>",err);
            ps.execute({theImage: binBuff}, function(err, records) {
                if(err) console.log("err second ==>",err);
                console.log('upload res===>:',records)
                ps.unprepare(function(err) {
                  if(err){
                    console.log('something error 2:',err);
                    resolve({result:"NG"});
                  }
                  resolve({result:"GG"});
                    // check err
                    // If no error, it's been inserted!
                });
            });
        });
      });
    } catch (err) {
      console.log(err);
      resolve(err);
    }
  });
}
exports.create_new_user = function (memberName, memberLastName,userName,password,email) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      const generatedId = randomString(12);
      let result = await pool.request().query(`INSERT INTO users (userId, userLogin,userPassword, userName, userLastName, userEmail) 
                VALUES ('${generatedId}', '${userName}', '${password}','${memberName}','${memberLastName}','${email}')`);
      //console.log(result.recordset)
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  })
}