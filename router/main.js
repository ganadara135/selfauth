//chain sdk parts
const chain = require('chain-sdk')
const client = new chain.Client("http://220.230.112.30:1999","client:8e75bc40f75dcb82e86e852963bb47ad14e8828ce500619151ef302dcb079afc")
//const client = new chain.Client();
const signer = new chain.HsmSigner();
var momentBy = require('moment');
//momentBy().format();

module.exports = function(app, fs)
{
  app.get('/',function(req,res){
      var sess = req.session;

      res.render('index', {
          title: "MY HOMEPAGE",
          length: 5,
          IDname: sess.IDname
//          username: sess.username
      })
  });

  app.post('/pwmanage/:IDname',function(req,res){
      var sess = req.session;
      var userName = req.params.IDname;
      var result = [];

      res.render('pwmanage', {
          title: "하하하하하",
          length: 5,
          IDname: userName,
          amount: result
      })
    });

  app.get('/choice/:IDname',function(req,res){
      var sess = req.session;
      var userName = req.params.IDname;
      var result = [];

      res.render('choice', {
          title: "하하하하하",
          length: 5,
          IDname: userName,
          amount: result
      })
    });

  app.post('/watching/:IDname',function(req,res){
        var sess = req.session;
        var userName = req.params.IDname;
        var result = {};

        result["대상자"] = userName;

        console.log("watching/:IDname/ : ", req.params.IDname);
        var test_count = 0;

      Promise.resolve().then(() =>
          client.transactions.queryAll({
            filter: 'outputs(account_alias=$1)',
            filterParams: [userName],
            startTime: (Date.now()- (60000*10*6) )  //  within a hour
      //      setEndTime: (Date.now()) //- (60000*10*6) )
          }, (tx, next, done) => {
            console.log(userName + " 's transaction: " + tx.id)
//            console.log(userName + " 's transaction: " + tx.timestamp)
/*
            tx.inputs.forEach(input => {
              console.log('-' + input.amount + ' ' + input.assetAlias)
            })
*/
//          var keys = Object.keys(tx.outputs[1]);
//          console.log("outputs  : " + keys)
            result["남은예약건수"] = tx.outputs[0].amount;
            console.log("남은예약건수  : ", tx.outputs[0].amount)

            var currentDate = new Date();
            tx.outputs.forEach(output => {
              //console.log('+' + output.amount + ' ' + output.assetAlias)
              var chkDate = new Date(output.referenceData.formatDate);

//              var difMill = (currentDate.getTimezoneOffset() * 60000 )

              if(chkDate.getTime() > currentDate.getTime() ){
                test_count++;
                console.log("test_count : ", test_count);
                result["유효예약숫자"] = test_count;

                result["formatDate["+test_count+"]"] = output.referenceData.formatDate;
                result["purpose["+test_count+"]"] = output.referenceData.purpose;

//                return done();
              }
            })

//            result[test_count + "area"] = "next() area";

            // next() moves to the next item.
            // done() terminates the loop early, and causes the
            //   query promise to resolve. Passing an error will reject
            //   the promise.
            next()

      })).then(() =>{
          res.json(result);
        }
      ).catch(err =>
        process.nextTick(() => {
          console.log("err :  ", err);
          res.json("에러");
           throw err })
      )
  });
/*
  app.get('/choice/:IDname',function(req,res){
      var sess = req.session;
      var username = req.params.IDname;

console.log("choice/:IDname/ : ", req.params.IDname);

      Promise.resolve().then(() =>
        client.mockHsm.keys.query({aliases: [username]}).then(data => {

        console.log("--------------------keys.query()   /   비밀키 찾는 쿼리------------------------")
        //  console.log(data)
        console.log(data.items)

//        xpub = data.items[0].xpub
      })).then(() =>
        res.render('choice', {
            title: "MY choice",
            length: 5,
            IDname: req.params.IDname
        })
      ).catch(err =>
        process.nextTick(() => {
          console.log("err :  ", err);
          res.json("에러");
           throw err })
      )
  });
*/
  app.post('/bookingUse/:IDname',function(req,res){
      var sess = req.session;
      var username = req.params.IDname;
      var userXpub = req.body.xpub;
      var bbookingTime = req.body.bookingTime;
      var bbpurpose    = req.body.purpose;
      var result = {};

      var date = new Date();
      date.setTime(bbookingTime);
      console.log("date : ", date)
//      var wrapped = momentBy(date);

// "Sunday, February 14th 2010, 3:25:50 pm"
//console.log(wrapped.format('"dddd, MMMM Do YYYY, h:mm:ss a"'));

      console.log("/bookingUse/");

//      res.json(result);
      Promise.resolve().then(() => {
        signer.addKey(userXpub, client.mockHsm.signerConnection)
      }).then(() =>
        client.transactions.build(builder => {
          builder.spendFromAccount({
            accountAlias: username,
            assetAlias: username,
            amount: 1
          })
          builder.retire({
            assetAlias: username,
            amount: 1,
            reference_data: { "bookingTime": bbookingTime, "formatDate": date, "purpose": bbpurpose }
          })
      })
     ).then(retirement => signer.sign(retirement))
      .then(signed => {
         client.transactions.submit(signed)
         /////////////////////////////////////////
         result["alias"] = username;
         result["xpub"] = userXpub;
         result["amount"] = 1;
         console.log("xpub : ", userXpub)
         console.log("result : ", result)

         res.json(result);
      }).catch(err =>
        process.nextTick(() => {
          console.log("err :  ", err);
          res.json("에러");
           throw err })
      )
  });

  app.get('/booking/:IDname',function(req,res){
      var sess = req.session;

      console.log("booking/ : ", req.params.IDname);
      res.render('booking', {
          title: "MY booking",
          length: 5,
          IDname: req.params.IDname
      })
  });

  app.get('/choice',function(req,res){
      var sess = req.session;

      res.render('choice', {
          title: "MY choice",
          length: 5,
          IDname: req.IDname
      })
  });



  app.get('/enroll',function(req,res){
      var sess = req.session;

      res.render('enroll', {
          title: "Enrollment",
          length: 5,
          IDname: sess.IDname
      })
  });
  // XMLHttpRequest communication
  app.post('/checkID/:IDname', function(req, res){

     var result = {  };
     var IDname = req.params.IDname;


     // CHECK REQ VALIDITY
     if(!req.params.IDname){
//     if(!req.body["password"] || !req.body["name"]){
         result["success"] = 0;
         result["error"] = "invalid request";
         res.json(result);
         return;
     }

     // LOAD DATA & CHECK DUPLICATION
     fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
         var users = JSON.parse(data);
         if(users[IDname]){
             // DUPLICATION FOUND
             result["success"] = 0;
             result["error"] = "duplicate";
         }else {
             result["success"] = 1;
         }
         res.json(result);
     })
  });
// XMLHttpRequest communication
  app.post('/createKeyAssetAccount/:IDname',function(req,res){
      var sess = req.session;
      var IDofUser = req.params.IDname;
      var result = {};

      // CHECK REQ VALIDITY
      if(!req.body.password || !req.body.IDname){
      //     if(!req.body["password"] || !req.body["name"]){
          result["success"] = 0;
          result["error"] = "invalid request";
          res.json(result);
          return;
      }

      // LOAD DATA & CHECK DUPLICATION
      fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
          var users = JSON.parse(data);
          if(users[IDofUser]){
              // DUPLICATION FOUND
              result["success"] = 0;
              result["error"] = "duplicate";
              res.json(result);
              return;
          }
          // ADD TO DATA
          users[IDofUser] =  req.body;

          // SAVE DATA
          fs.writeFile(__dirname + "/../data/user.json",
                       JSON.stringify(users, null, '\t'), "utf8", function(err, data){
      //             result = {"success": 1};
      //             res.json(result);
/*              res.render('choice', {
                  title: "MY HOMEPAGE",
                  length: 5,
                  IDname: req.body.IDname
              })
*/
          })
      })

      Promise.resolve().then(() => {
        // snippet create-key
        const keyPromise = client.mockHsm.keys.create({alias: IDofUser})
        // endsnippet
        return keyPromise
      }).then(key => {
        xpub = key.xpub
        // snippet signer-add-key
        const signer = new chain.HsmSigner() // Holds multiple keys.
        signer.addKey(key.xpub, client.mockHsm.signerConnection)
        // endsnippet
        _signer = signer
      }).then(() =>
        client.assets.create({
          alias: IDofUser,
          rootXpubs: [xpub],
          quorum: 1,
        })
      ).then(() =>
        client.accounts.create({
          alias: IDofUser,
          rootXpubs: [xpub],
          quorum: 1
        })
      ).then(() =>
        client.transactions.build(builder => {
          builder.issue({
            assetAlias: IDofUser,
            amount: 999
          })
          builder.controlWithAccount({
            accountAlias: IDofUser,
            assetAlias: IDofUser,
            amount: 999
          })
        })
      ).then(unsigned => {
        const signer = _signer

        // snippet sign-transaction
        const signerPromise = signer.sign(unsigned)
        // endsnippet
        return signerPromise
      }).then(signed => {
        client.transactions.submit(signed)
  /////////////////////////////////////////
        result["alias"] = IDofUser;
        result["xpub"] = xpub;
        result["amount"] = 999;
        console.log("xpub : ", xpub)
        console.log("result : ", result)

        res.json(result);
      }).catch(err =>
        process.nextTick(() => {
          console.log("err :  ", err);
           throw err })
      )
  });
// 이 부분은 삭제하라
  app.get('/list', function (req, res) {
   fs.readFile( __dirname + "/../data/" + "user.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
  });

  app.get('/getUser/:username', function(req, res){
   fs.readFile( __dirname + "/../data/user.json", 'utf8', function (err, data) {
        var users = JSON.parse(data);
        res.json(users[req.params.username]);
   });
  });

// 비밀번호 업데이트로 활용
  app.put('/updateUser/:username', function(req, res){

    var result = {  };
    var username = req.params.username;

    // CHECK REQ VALIDITY
    if(!req.body["password"] || !req.body["IDname"]){
        result["success"] = 0;
        result["error"] = "invalid request";
        res.json(result);
        return;
    }

    // LOAD DATA
    fs.readFile( __dirname + "/../data/user.json", 'utf8',  function(err, data){
        var users = JSON.parse(data);
        // ADD/MODIFY DATA
        users[username] = req.body;

        // SAVE DATA
        fs.writeFile(__dirname + "/../data/user.json",
                     JSON.stringify(users, null, '\t'), "utf8", function(err, data){
            result = {"success": 1};
            res.json(result);
        })
    })
  });

// 이앱은 삭제하라
  app.delete('/deleteUser/:username', function(req, res){
    var result = { };
    //LOAD DATA
    fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
        var users = JSON.parse(data);

        // IF NOT FOUND
        if(!users[req.params.username]){
            result["success"] = 0;
            result["error"] = "not found";
            res.json(result);
            return;
        }

        delete users[req.params.username];
        fs.writeFile(__dirname + "/../data/user.json",
                     JSON.stringify(users, null, '\t'), "utf8", function(err, data){
            result["success"] = 1;
            res.json(result);
            return;
        })
    })
  });

  app.post('/login/:IDname', function(req, res){
        var sess;
        sess = req.session;
//        var password = req.body["password"];

        console.log("req.session  : ", req.session);
        console.log("res.session  : ", res.session);
        console.log("req.body  : ", req.body);
        console.log("req.body[password] : ", req.body["password"]);

        fs.readFile(__dirname + "/../data/user.json", "utf8", function(err, data){
            var users = JSON.parse(data);
            var IDname = req.params.IDname;
            var password = req.body.password;
            var result = {};
            if(!users[IDname]){
                // USERNAME NOT FOUND
                result["success"] = 0;
                result["error"] = "not found";
                res.json(result);
                return;
            }

            if(users[IDname]["password"] == password){
                result["success"] = 1;
                result["IDname"]= IDname;
        //        result["username"]=sess.username;
//                res.IDname = IDname;
                var tenMinute = 60000 * 10;
                // expires 는 쿠키생존기간 설정변수
                req.session.cookie.expires = new Date(Date.now() + tenMinute);
                //maxAge 는 expires 설정후 지난 시간을 나타냄
                req.session.cookie.maxAge = tenMinute;
        //        sess.IDname = users[IDname]["IDname"];

                res.render('choice', {
                    title: "MY HOMEPAGE",
                    length: 5,
                    IDname: req.body.IDname,
                    amount: 0
                })

            }else{
                result["success"] = 0;
                result["error"] = "incorrect";
                res.json(result);
            }
        })
    });

    app.get('/logout', function(req, res){
        sess = req.session;
        if(sess.IDname){
            req.session.destroy(function(err){
                if(err){
                    console.log(err);
                }else{
                    res.redirect('/');
                }
            })
        }else{
            res.redirect('/');
        }
    });
}
