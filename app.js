const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();

app.use(express.json());

const dbpath = path.join(__dirname, "cricketTeam.db");

let db = null;

const initializerDBAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializerDBAndServer();

//API 1
app.get("/players/", async (request, response) => {
  const getPlayerQuery = `SELECT * FROM cricket_team;`;
  const playersArray = await db.all(getPlayerQuery);
  response.send(playersArray);
});

//API 2
app.post("/players/", async (request, response) => {
  const playerdetails = request.body;
  const { playerName, jerseyNumber, role } = playerdetails;
  const addPlayerQuery = ` 
    INSERT INTO
        cricket_team (playerName, jerseyNumber, role)
    VALUES
        ('${playerName}', '${jerseyNumber}', '${role}');`;
  const dbresponse = await db.run(addPlayerQuery);
  const playerId = dbresponse.lastID;
  response.send("Player Added to Team");
});
