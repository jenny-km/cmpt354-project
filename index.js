const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const { Pool } = require('pg')
var pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgres://postgres:root@localhost/cmpt354_project",
  ssl:{
    rejectUnauthorized: false
  }
})
//left is the environment variable for production, and 5000 is for local
const PORT = process.env.PORT || 5000

var app = express()

app.use(bodyParser.json())
app.use(express.json()) // we will send a json so try to understand it
app.use(express.urlencoded({extended: false})) // we are sending a false type

app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
//in root, I want you to respond by rendering pages/index
// / -> is a request and displaying index is the response
app.get('/', async(req, res) => {
  var allPlayerquery = 'SELECT * FROM player';
  try{
    // wait until the query is done processing
    const result = await pool.query(allPlayerquery)
    // get the results data
    // results is the attribute
    // result.rows -> are the rows of the database
    const data = {results: result.rows} 
    // send the results data to this page
    res.render('pages/index.ejs', data)
  }catch (error){
      res.end(error)
  }
})

app.get('/searchPlayers', async(req, res) => {
  var allplayerquery = 'SELECT * FROM player ORDER BY playerid';

  // var allplayerquery = `SELECT P.playerID, P.name, P.gender, M.gname, M.gemail, M.gphone FROM Player P FULL JOIN Minor M ON P.playerid = M.playerid
  // WHERE P.name = '${temp_name}' AND P.gender = ${gender_toggle} ORDER BY playerid`;

  try{
    // wait until the query is done processing
    const result = await pool.query(allplayerquery)
    // get the results data
    // results is the attribute
    // result.rows -> are the rows of the database
    const data = {results: result.rows} 
    console.log(data)
    // send the results data to this page
    res.render('pages/searchPlayers', data)
  }catch (error){
      res.end(error)
  }
})

app.get('/filterPlayers', async(req, res) => {
  var allplayerquery = 'SELECT * FROM player ORDER BY playerid';
  try{
    const result = await pool.query(allplayerquery)
    const data = {results: result.rows} 
    
    let colArr = []
    for(const colName of Object.keys(result.rows[0])){
      const colObj = {
        colName: colName
      }
      if(req.query[colName]){
        colObj.checked = 'checked'
      }else {
        colObj.checked = ''
      }
      colArr.push(colObj)
    }

    console.log("colArr:", colArr)


    let columnNames = ['playerid', 'name', 'dob', 'gender', 'phone', 'email']
    let showColumns = columnNames
    let checkedColumns = Object.keys(req.query)

    console.log("Object keys req. query: ",Object.keys(req.query))
    for(let i = 0; i < checkedColumns.length; i++){
      let colindex = showColumns.indexOf(checkedColumns[i])
      if(colindex != -1){
        showColumns.splice(colindex, 1); 
      }
    }

    console.log( "showCOlumns : ", showColumns);
    console.log( "checked columns : ", checkedColumns);

    let colnameString = ''
    if(checkedColumns.length < 6){
      console.log("enter")
      for(let i = 0; i < showColumns.length; i++){
        console.log("inner: " + showColumns[i])
        if(i === showColumns.length-1){
          colnameString += showColumns[i] 
        }else{
          colnameString += showColumns[i] + ","
        }
      }
    }
   
    console.log( "colname string : ", colnameString);

    const selectedquery = `SELECT ${colnameString} FROM player ORDER BY playerid`
    const selectedResult = await pool.query(selectedquery)
    res.render('pages/filterPlayers', { players : selectedResult.rows, playerColumns: colArr, playerColumnsForTh: showColumns})
    }catch (error){
        res.end(error)
    }



  // var allplayerquery = 'SELECT * FROM player ORDER BY playerid';
  // try{
  //   // wait until the query is done processing
  //   const result = await pool.query(allplayerquery)
  //   // get the results data
  //   // results is the attribute
  //   // result.rows -> are the rows of the database
  //   const data = {results: result.rows} 
  //   console.log(data)
  //   // send the results data to this page
  //   res.render('pages/searchPlayers', data)
  // }catch (error){
  //     res.end(error)
  // }
})

app.get('/guardianInfo', async(req, res) => {
  var allguardianquery = `SELECT P.playerID, P.name, P.gender, M.gname, M.gemail, M.gphone FROM Player P INNER JOIN Minor M ON P.playerid = M.playerid ORDER BY P.playerID`;

  // var allplayerquery = `SELECT P.playerID, P.name, P.gender, M.gname, M.gemail, M.gphone FROM Player P FULL JOIN Minor M ON P.playerid = M.playerid
  // WHERE P.name = '${temp_name}' AND P.gender = ${gender_toggle} ORDER BY playerid`;

  try{
    // wait until the query is done processing
    const result = await pool.query(allguardianquery)
    // get the results data
    // results is the attribute
    // result.rows -> are the rows of the database
    const data = {results: result.rows} 
    console.log(data)
    // send the results data to this page
    res.render('pages/guardianInfo', data)
  }catch (error){
      res.end(error)
  }
})

app.get('/statistics', async(req, res) => {
// post -> make some changes on the server like adding a new user
// get -> we are just retrieving information
try{
  res.render('pages/statistics', { totalPlayers : null, teamAvgs: null, foundingTeams: null})
}catch (error){
    res.end(error)
}
})
 

// add Player Data
app.post('/addplayerdata', async(req, res) => {
  var temp_name = req.body.s_name
  var temp_email = req.body.s_email
  var temp_gender = req.body.s_gender
  var temp_phone = req.body.s_phone
  var temp_dob = req.body.s_birthday


  if(!temp_dob){
    temp_dob = 'NULL'
  }

  // put person in the database
  var addplayerquery = `INSERT INTO player (name, dob, gender, phone, email) VALUES ('${temp_name}', ${temp_dob}, '${temp_gender}', '${temp_phone}', '${temp_email}')`;
  // var addplayerquery = `INSERT INTO player (name, dob, gender, phone, email) VALUES ('${temp_name}', '${temp_dob}', '${temp_gender}', '${temp_phone}', '${temp_email}')`;
  if(!temp_dob){
    var addplayerquery = `INSERT INTO player (name, dob, gender, phone, email) VALUES ('${temp_name}', ${temp_dob}, '${temp_gender}', '${temp_phone}', '${temp_email}')`;
  }
  var allplayerquery = 'SELECT * FROM player';
  try{
    // wait until the query is done processing
    const addresult = await pool.query(addplayerquery)
    var ret_obj = {name: temp_name, email: temp_email, gender: temp_gender, phone: temp_phone, dob: temp_dob} // creating an object with key and value pairs
    console.log(ret_obj)

    const result = await pool.query(allplayerquery)
    const data = {results: result.rows} 
    res.render('pages/index.ejs', data)
  }catch (error){
      res.end(error)
  }
})

app.post('/deleteplayerdata', async(req, res) => {
  var temp_id = req.body.s_delete_values;
  
  var deleteplayerquery = `delete from player WHERE playerid=${temp_id}`;
  var allplayerquery = 'SELECT * FROM player ORDER BY playerid';
  try{
    // wait until the query is done processing 
    const deleteResult = await pool.query(deleteplayerquery)

    const result = await pool.query(allplayerquery)
    const data = {results: result.rows} 
    res.render('pages/searchPlayers.ejs', data)
  }catch (error){
      res.end(error)
  }
})

app.post('/updateplayerdata', async(req, res) => {
  var temp_id = req.body.s_player_id
  var temp_name = req.body.s_name
  var temp_email = req.body.s_email
  var temp_gender = req.body.s_gender
  var temp_phone = req.body.s_phone
  var temp_dob = req.body.s_birthday

  // put person in the database
  var changeplayerquery = `UPDATE player SET name = '${temp_name}', dob = '${temp_dob}', gender = '${temp_gender}', phone = '${temp_phone}', email = '${temp_email}' WHERE playerid = ${temp_id}`;
  var allplayerquery = 'SELECT * FROM player ORDER BY playerid';
  try{
    // wait until the query is done processing
    const changeresult = await pool.query(changeplayerquery)
    var ret_obj = {name: temp_name, email: temp_email, gender: temp_gender, phone: temp_phone, dob: temp_dob} // creating an object with key and value pairs
    console.log(ret_obj)

    const result = await pool.query(allplayerquery)
    const data = {results: result.rows} 
    res.render('pages/searchPlayers', data)
  }catch (error){
      res.end(error)
  }
})

app.post('/redirectupdate', async(req, res) => {
  // get the id from form
  var temp_id = req.body.s_redirect_update_values
  // select user
  var selectplayerquery = `SELECT * FROM player WHERE playerid=${temp_id}`;

  try{
    const result = await pool.query(selectplayerquery)
    const data = {results: result.rows} 
      // redirect to update page
    res.render('pages/updatePlayer', data)
  }catch (error){
      res.end(error)
  }
})

app.post('/searchplayertable', async(req, res) => {
  // get the id from form
  var temp_name = req.body.s_name
  var temp_gender_male = req.body.s_gender_male
  var temp_gender_female = req.body.s_gender_female
  var selectplayerquery = "";
  console.log(temp_name)
  // player name cannot be null
  if(temp_gender_female == null && temp_gender_male != null){
    selectplayerquery = `SELECT * FROM player WHERE name ILIKE '%${temp_name}%' AND gender ILIKE '${temp_gender_male.toLowerCase()}' ORDER BY playerid`;
    console.log(selectplayerquery)
  }else if(temp_gender_female != null && temp_gender_male == null){
    selectplayerquery = `SELECT * FROM player WHERE name ILIKE '%${temp_name}%' AND gender ILIKE '${temp_gender_female.toLowerCase()}' ORDER BY playerid`;
  }else{
    selectplayerquery = `SELECT * FROM player WHERE name ILIKE '%${temp_name}%' ORDER BY playerid`;
  }

  console.log(temp_name)
  console.log(temp_gender_male) 
  console.log(temp_gender_female) // undefined if not checked

  try{
    const result = await pool.query(selectplayerquery)
    const data = {results: result.rows} 
      // redirect to update page
    res.render('pages/searchPlayers', data)
  }catch (error){
      res.end(error)
  }
})

app.post('/searchguardiantable', async(req, res) => {
  // get the id from form

  var temp_name = req.body.s_name
  var temp_gender_male = req.body.s_gender_male
  var temp_gender_female = req.body.s_gender_female
  var selectguardianquery = "";
  // player name cannot be null

  if(temp_gender_female == null && temp_gender_male != null){
    selectguardianquery = `SELECT P.playerID, P.name, P.gender, M.gname, M.gemail, M.gphone FROM Player P INNER JOIN Minor M ON P.playerid = M.playerid WHERE P.name ILIKE '%${temp_name}%' AND P.gender ILIKE '${temp_gender_male.toLowerCase()}' ORDER BY P.playerID`;
    console.log(selectguardianquery)
  }else if(temp_gender_female != null && temp_gender_male == null){
    selectguardianquery = `SELECT P.playerID, P.name, P.gender, M.gname, M.gemail, M.gphone FROM Player P INNER JOIN Minor M ON P.playerid = M.playerid WHERE P.name ILIKE '%${temp_name}%' AND P.gender ILIKE '${temp_gender_female.toLowerCase()}' ORDER BY P.playerID`;
  }else{
    selectguardianquery = `SELECT P.playerID, P.name, P.gender, M.gname, M.gemail, M.gphone FROM Player P INNER JOIN Minor M ON P.playerid = M.playerid WHERE P.name ILIKE '%${temp_name}%' ORDER BY P.playerID`;
  }

  console.log(temp_name)
  console.log(temp_gender_male) 
  console.log(temp_gender_female) // undefined if not checked

  try{
    const result = await pool.query(selectguardianquery)
    const data = {results: result.rows} 
      // redirect to update page
    res.render('pages/guardianInfo', data)
  }catch (error){
      res.end(error)
  }
})

app.post('/onfilterclick', async(req, res) => {
  // get the id from form
  let queryString = ''
  let index = 0

  for(let colName of Object.keys(req.body)) {

    if(index === 0){
      queryString += '?'
    }

    if(index === Object.keys(req.body).length-1) {
      queryString += `${colName}=checked`
    }else {
      queryString += `${colName}=checked&`
    }
    ++index

    console.log("query string: ", queryString)
  }

  res.redirect(`/filterPlayers/${queryString}`);
})


app.post('/getTotalPlayers', async(req, res) => {
  var getTotalPlayersQuery = 'SELECT count(*) FROM player';

  try{
    const result = await pool.query(getTotalPlayersQuery)
    console.log("total Players: " , result.rows)
      // redirect to update page
    res.render('pages/statistics', {totalPlayers: result.rows, teamAvgs: null, foundingTeams:null})
  }catch (error){
      res.end(error)
  }
})

app.post('/getTeamAvgScores', async(req, res) => {
  var getTeamAvgsQuery = 'SELECT TeamName, AVGScore FROM AverageScores, Captained_Team WHERE AverageScores.TeamID = Captained_Team.TeamID ORDER BY AVGScore';
  try{
    const result = await pool.query(getTeamAvgsQuery)
    console.log("Team AVGS: " , result.rows)
    res.render('pages/statistics', {teamAvgs: result.rows, totalPlayers: null, foundingTeams: null})
  }catch (error){
      res.end(error)
  }
})

app.post('/getFoundingTeams', async(req, res) => {
  var getFoundingTeamsQuery = 'SELECT teamname FROM DividedTeamid, Captained_Team WHERE DividedTeamid.teamid = Captained_Team.teamid';
  try{
    const result = await pool.query(getFoundingTeamsQuery)
    console.log("founding Teams: " , result.rows)
    res.render('pages/statistics', {teamAvgs: null, totalPlayers: null, foundingTeams: result.rows})
  }catch (error){
      res.end(error)
  }
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
