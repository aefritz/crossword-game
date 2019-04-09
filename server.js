const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const {Facebook} = require('fb');

const { User, SavedGame } = require('./models');
const PORT = process.env.PORT || 3001;
const appId = process.env.REACT_APP_APP_ID;
const appSecret = process.env.REACT_APP_APP_SECRET;

const fb = new Facebook();
const options = fb.options({
  appId: appId,
  appSecret: appSecret,
  redirectUri: 'http://localhost:3000/'
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


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
