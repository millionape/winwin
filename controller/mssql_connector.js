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

exports.getUser = function(user,pass){
    return new Promise(async function(resolve, reject) {
        try {
            console.log("sql connecting......")
            let pool = await sql.connect(sqlConfig)
            let result = await pool.request().query('select * from users') 
            //console.log(result.recordset)
            for(var auth of result.recordset){
              if(user === auth.userLogin && pass === auth.userPassword){
                resolve(true);
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
exports.get_all_groups = function(){
  return new Promise(async function(resolve, reject) {
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
exports.create_new_groups = function(groupName,inchargeName,inchargeLastName,locationText,province,amphoe,district,zipcode){
  return new Promise(async function(resolve, reject) {
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


///////////////  GROUPS //////////////////////////////
