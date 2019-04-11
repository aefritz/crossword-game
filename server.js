const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const {Facebook} = require('fb');

const { User, SavedGame, Question } = require('./models');
const PORT = process.env.PORT || 3001;
const appId = process.env.REACT_APP_APP_ID;
const appSecret = process.env.REACT_APP_APP_SECRET;

const fb = new Facebook();
const options = fb.options({
  appId: appId,
  appSecret: appSecret,
  redirectUri: 'http://localhost:3000/login'
});

const app = express();
console.log(appId);
console.log(appSecret);
app.use(logger('dev'));
app.use(cors());
app.use(bodyParser.json());

app.use(async (req,res,next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    fb.setAccessToken(token);
    console.log(token);
    let email;
    await fb.api('me', { fields: ['email'], access_token: token }, function (response) {
      req.specialData = response.email;
      console.log(req.specialData)
      next();
    });
  } catch(e) {
    console.error(e);
    res.status(403);
  }
});

app.get('/user', async (req, res) => {
  try {
    const email = req.specialData;
    let user = await User.findByPk(email);
    console.log(user);
    if (user !== null) {
      res.json(user.dataValues);
    } else {
      res.json({msg: 'user not found'})
    }
  } catch(e) {
    console.error(e);
    res.status(403);
  }
});

app.put('/user', async (req, res) => {
  try {
    console.log("put route triggered");
    const email = req.specialData;
    let time = parseInt(req.body.time);
    let user = await User.findByPk(email);
    let new_games_played = parseInt(user.dataValues.gamesPlayed) + 1;
    let resp = await user.update({
      email,
      gamesPlayed: new_games_played,
      bestTime: ((time < user.dataValues.bestTime) || (user.dataValues.bestTime === null)) ? time : user.dataValues.bestTime
    })
    const new_time = parseInt(req.body.time);
    //user.gamesPlayed = parseInt(user.gamesPlayed) + 1;
    //if ((user.bestTime === null) || (user.best_time > new_time)) {
      //user.bestTime = new_time;
    //}
    //user.save();
    res.json(user);
  } catch (e) {
    console.error(e);
    res.status(403);
  }
})

app.post('/user', async (req, res) => {
  try {
    const email = req.specialData;
    let user = await User.create({email});
    console.log(user);
    res.json(user.dataValues);
  } catch(e) {
    console.error(e);
    res.status(403);
  }
});

app.post('/savedgames', async (req, res) => {
  try {
    const email = req.specialData;
    let data = req.body;
    console.log(req.body);
    let user = await User.findByPk(email);
    let newgame = await SavedGame.create(data);
    await newgame.setUser(user);
    res.json(newgame.dataValues);
  } catch(e) {
    console.error(e);
    res.status(403);
  }
})

app.get('/savedgames', async (req, res) => {
  try {
    const email = req.specialData;
    let games = await SavedGame.findAll({where:{userEmail: email}});
    res.json(games);
  } catch (e) {
    console.error(e);
    res.status(403);
  }
});

app.delete('/savedgames/:id', async (req, res) => {
  try {
    const email = req.specialData;
    let id = req.params.id;
    let savedgame = await SavedGame.findByPk(id);
    if (savedgame.userEmail === email) {
      await SavedGame.destroy({where: {id}});
      res.json({msg: 'game deleted'})
    }
  } catch(e) {
    console.error(e);
    res.status(403);
  }
})

app.put('/savedgames/:id', async (req, res) => {
  try {
    const email = req.specialData;
    let {id} = req.params;
    let data = req.body;
    let user = await User.findByPk(email);
    let savedgame = await SavedGame.findByPk(id);
    if (savedgame.userEmail === email) {
      savedgame.update(data);
    }
    res.json(savedgame);
  } catch(e) {
    console.error(e);
    res.status(403);
  }
});

app.get('/userspro', async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    await fb.api('/me/picture','GET',{redirect: false, access_token: token, height: 200, width: 200}, function (response) {
      res.json({url: response.data.url});
    });
  } catch(e) {
    console.error(e);
    res.status(403);
  }
});

app.get('/crossworddata', async (req, res) => {
  try {
    let questions = await Question.findAll({});
    res.json(questions);
  } catch(e) {
    console.error(e);
    res.status(403);
  }
})

app.get('/savedgames/:id', async (req, res) => {
  try {
    let {id} = req.params;
    let savedgame = await SavedGame.findByPk(id);
    res.json(savedgame);
  } catch(e) {
    console.error(e);
    res.status(403);
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
