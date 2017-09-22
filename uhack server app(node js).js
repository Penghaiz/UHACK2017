var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var con = mysql.createConnection({
    host: "localhost",
    user: "scott",
    password: "tiger",
    database: 'uhack'
});

var getUserId = function(user_id,callback){
            var query_sql = "select count(*) cnt from users where user_id = '"+user_id+"'";
            con.query(query_sql, function(err, results, fields){
                if (err) throw err;
                if(results[0].cnt == 0) addUser(user_id);
                callback(null,results);
            })
}

var addUser = function(user_id){
    var query_sql = "insert into users (user_id) values (?)";
    con.query(query_sql,user_id, function(err, results){
        if (err) throw err;
        console.log("add user info successfully");
    });
}

var addBloodInfo = function(array_blood_information,callback){
    console.log("received");
    var query_sql = "insert into blood_information (user_id,create_time,blood_type,glucose,neutrophils,lecukocyte,minerals ) values (?,?,?,?,?,?,?)";
    con.query(query_sql,array_blood_information, function(err, results){
        if (err) throw err;
        console.log("add blood info successfully");
        callback(null,results);
    });
}

var getBloodInfo = function(user_id,callback){
            con.query("select * from blood_information where user_id = ?", user_id, function(err, results, fields){
                if (err) throw err;
                callback(null,results);  
            })
}



//get blood information
app.get('/getBloodInfo', function(req,res){
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    getBloodInfo("123",function(err,results){
        if(err) throw err;
        console.log("results"+results);
        if(results.length == 0){
            res.send('Sorry, this user has not any blood information yet.');
        }
        else{
            res.send(JSON.stringify(results));
        }
    });
})

app.use(bodyParser.urlencoded({ extended: false }));



//add blood information
app.post('/addBloodInfo',function(req,res){   
    var user_id = req.body.user_id;
    var create_time = req.body.create_time;
    var blood_type = req.body.blood_type;
    var array_blood_information = [user_id,create_time,blood_type,0,0,0,0]; 
    addBloodInfo(array_blood_information,function(err,results){
        if(err) throw err;
        //res.writeHead(200, {'Content-Type': 'text/html'});Access-Control-Allow-Origin
        res.header("Access-Control-Allow-Origin", "*");
       // res.header("Access-Control-Allow-Headers", "X-Requested-With");
        //res.writeHead(200, { 'Content-Type': 'text/html' });
        res.send("successfully add your blood information!") // content-type will be text/html as default value
        //res.end('Okkkkkkkkkkkkk'); // content-type will be application/json
    })
})


app.listen( 3001, function(){
    console.log('server is running on port 3000');
})
/*
app.get('/gg/:id',function(req,res){
    res.send(req.params.id);
})
app.get('/gg/:id/:name',function(req,res){
    res.send(req.params.id + "," + req.params.name);
})


 test the route , httpResponse must be explicitly ended
app.get("/", function(httpRequest, httpResponse, next){
    httpResponse.write("Hello");
    next(); //remove this and see what happens
});

app.get("/", function(httpRequest, httpResponse, next){
    httpResponse.write(" World !!!");
    httpResponse.end();
});
app.listen(3000);



app.get('/:id', function(req,res,next){

    if(req.params.id == 'kk'){
        next();
    }else{
        res.redirect("http://localhost/t.php?t="+req.params.id);
    }
});

app.get('/kk', function(req,res){
    res.send(getDataFromMySql);

})

*/