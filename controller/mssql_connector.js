var sql = require('mssql');
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
