## Description

TimesXWordThrowback generates NY Times-style mini crossword puzzles that place previous clue-answer pairs from the daily NY Times crosswords in a new configuration. Users log in with their Facebook accounts and can save and share their performance on Facebook with their friends.

## Deployed Site

[https://timesxwordthrowback.surge.sh](https://timesxwordthrowback.surge.sh)

## Installation Instructions for Further Development

1. Clone down the repository into a local repo.
2. Inside the root directory of the repo, run ```npm install``` in the terminal in order to install the node packages required by Express.
3. Then, navigate into the client directory and again run ```npm install``` to install the node packages required by React.
4. Because login and authentication are handled through Facebook's API, you will need to register an app at [Facebook Developers](https://developers.facebook.com/). After registering, confirm the app is set to development mode by default. You will be provided with an App Id and App Secret which you will need in step 6.
5. Below the Dashboard on the left-hand side of the Facebook Developers tool, click the '+' sign next to 'Products' to add Facebook Login to your app. After adding this feature, there are a number of optional settings you can customize around the OAuth login flow (i.e. forcing users to reenter their password to login).
6. Create .env files in the app root directory and client directory to contain the App Id and App Secret provided by Facebook. The files should look like the following:
```
REACT_APP_APP_ID=your_app_id_here
REACT_APP_APP_SECRET=your_app_secret_here
```
7. Locally, the client will run on port 3000 rather than the deployed URL. Therefore, when the app is run for development, the Facebook class must be instantiated with the redirect URL that matches this location. It is my understanding that this is necessary not only for Facebook to provide a valid redirect URL with an OAuth code, but also as an additional form of identification. For example:
```
const fb = new Facebook();
const options = fb.options({
  appId: appid,
  appSecret: appsecret,
  redirectUri: 'https://localhost:3000/login'
});
```
Instances of the Facebook class are created in the following components and services and so the code block above must be reflected throughout:
- 'crossword/server.js'
- 'crossword/client/src/App.js'
- 'crossword/client/src/services.js'
- 'crossword/client/src/components/User.jsx'
8. Run the following terminal commands in the root directory of the app to populate the PostgreSQL database with the crossword clue-answer pairs:
```
createdb crossword
node resetDb.js
node seed.js
```
9. To start up the Express server, in the root directory of the app run:
```
node server.js
```
10. To start up the React client, in the client directory run:
```
npm run start
```

## Acknowledgements

Thanks to [Doshea @ Github](https://github.com/doshea/nyt_crosswords) for the JSON archive of past NY Times Crossword puzzles and answers.

## MVP

- Users log in with Facebook.
- The app generates Times-style mini (5x5) crosswords using past NY Times crossword clues.
- User's performance is tracked. (time and no. of puzzles solved)
- Users can save progress.
- Users can share to Facebook.

## Technologies

- React
- Express
- PostgreSQL
- Facebook SDK for Node.js
- query-string: Node module used in OAuth login flow to extract the code from redirect
- RegExp: used for matching clue-answer pairs to fill the puzzleboard
- JSON: for importing clue-answer pairs and storing saved games

## Post-MVP

- This app was partially an experiment in using OAuth to outsource authentication, however the current set up locks out users who do not have a Facebook account. I hope to eventually add an option to log in without Facebook... or option to log in with other OAuth providers like Google.
- I would ultimately like to add more flexible gameboard configurations ... right now there are always three 'down' words and three 'across' words in the same positions. Algorithmically, this will take a lot of careful thought to be done well.

## ERD

![ERD](https://github.com/aefritz/crossword-game/blob/master/Crossword_ERD.jpg)

## Wireframes
![Landing Page](https://github.com/aefritz/crossword-game/blob/master/CrosswordLandingPage.jpeg)
![User View](https://github.com/aefritz/crossword-game/blob/master/CrosswordUserView.jpeg)
![Gameplay](https://github.com/aefritz/crossword-game/blob/master/CrosswordPlay.jpeg)
