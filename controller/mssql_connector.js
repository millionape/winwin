var sql = require('mssql');
const randomString = require('random-base64-string')
var sqlConfig = {
  user: 'SA',
  password: 'Gun11092544#',
  server: '13.229.88.179',
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
          // res.cookie('userId', auth.userId)
          resolve(auth.userId);
        }
      }
      resolve(false);

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
exports.list_members_in_group = function(groupId){
  return new Promise(async function (resolve, reject) {
    try {
      console.log("sql connecting......");
      let pool = await sql.connect(sqlConfig)
      let result = await pool.request().query(`SELECT TOP 1000 * FROM dbo.personInfo WHERE groupId='${groupId}'`);
      //console.log(result.recordset)
      resolve(result);

    } catch (err) {
      console.log(err);
      resolve(err);

    }
  })
}

///////////////// MEMBES //////////////////////////////////