const cookieParser = require('cookie-parser');
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
const mysql = require('mysql');

app.use(cors(
  {
      origin: ["http://localhost:3000"],
      methods: ["POST", "GET", "PUT"],
      credentials: true
  }
));

app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'gracemarkscalculator'
});

app.get('/api/students', function (req, res) {
  connection.query('SELECT Name, RollNumber, sub1mark, sub2mark, sub3mark, sub4mark, sub5mark FROM students', function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.get('/api/attendance', function (req, res) {
  connection.query('SELECT Name, RollNumber, sub1cia1, sub1cia2, sub1cia3, sub2cia1, sub2cia2, sub2cia3, sub3cia1, sub3cia2, sub3cia3, sub4cia1, sub4cia2, sub4cia3, sub5cia1, sub5cia2 ,sub5cia3, sub1assignment1,sub1assignment2,sub2assignment1,sub2assignment2,sub3assignment1,sub3assignment2,sub4assignment1,sub4assignment2,sub5assignment1,sub5assignment2 FROM students', function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.get('/api/temp', function (req, res) {
  connection.query('SELECT Name, RollNumber, sub1mark, sub2mark, sub3mark, sub4mark, sub5mark, sub1cia1, sub1cia2, sub1cia3, sub2cia1, sub2cia2, sub2cia3, sub3cia1, sub3cia2, sub3cia3, sub4cia1, sub4cia2, sub4cia3, sub5cia1, sub5cia2 ,sub5cia3, sub1assignment1,sub1assignment2,sub2assignment1,sub2assignment2,sub3assignment1,sub3assignment2,sub4assignment1,sub4assignment2,sub5assignment1,sub5assignment2 FROM students', function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});
 
app.get('/api/students/:id', function (req, res) {
  const studentId = req.params.id;
  connection.query(`SELECT Name, sub1mark, sub2mark, sub3mark, sub4mark, sub5mark, sub1cia1, sub1cia2, sub1cia3, sub2cia1, sub2cia2, sub2cia3, sub3cia1, sub3cia2, sub3cia3, sub4cia1, sub4cia2, sub4cia3, sub5cia1, sub5cia2 ,sub5cia3, sub1assignment1,sub1assignment2,sub2assignment1,sub2assignment2,sub3assignment1,sub3assignment2,sub4assignment1,sub4assignment2,sub5assignment1,sub5assignment2 FROM students where RollNumber ="${studentId}"`, function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});



app.post('/login', (req, res) => {
  const sql = "SELECT * FROM teacher Where username = ? AND  password = ?";
  connection.query(sql, [req.body.username, req.body.password], (err, result) => {
      if(err) return res.json({Status: "Error", Error: "Error in runnig query"});
      if(result.length > 0) {
          const id = result[0].T_id;
          const token = jwt.sign({id}, "jwt-secret-key", {expiresIn: '1d'});
          res.cookie('token', token);
          return res.json({Status: "Success"})
      } else {
          return res.json({Status: "Error", Error: "Wrong Email or Password"});
      }
  })
})

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if(!token) {
      return res.json({Error: "You are no Authenticated"});
  } else {
      jwt.verify(token, "jwt-secret-key", (err, decoded) => {
          if(err) return res.json({Error: "Token wrong"});
          // req.role = decoded.role;
          req.id = decoded.id;
          next();
      } )
  }
}
app.get('/fff', verifyUser, (req,res) => {
  return res.json({Status: "Success"}); 
})
app.get('/logout', (req, res) => {
  res.clearCookie('token');
  return res.json({Status: "Success"});
})

app.listen(3005, function () {
  console.log('Example app listening on port 3000!');
});