## Description

This app generates NY Times-style mini crossword puzzles. Users log in with their Facebook accounts and can save and share their performance on Facebook with their friends.

## MVP

- Users log in with Facebook
- The app generates Times-style mini (5x5) crosswords using Oxford English Dictionary API and Words API.
- User's performance is tracked. (time and no of puzzles solved)
- Users can save progress
- Users can share to Facebook

## Important Technologies
- React
- Express
- FB development kit for Node.js
- query-string for Node.js (used in OAuth login flow to extract code from redirect)
- Canvas (I hope to use Canvas to take screenshots of finished games for users to share with their friends)
- RegExp for searching word APIs and puzzle creation

## Post-MVP

- Option to log in without Facebook... or option to log in with other platforms.
- Integrating clues from previous NY Times Crosswords. There is no API but there is a JSON database -- I would need to think about how to unpack all of the data. The other problem with Times questions is that some/many are self-referential.
- Optimizing generation performance - this algorithm might be complicated and I might have to settle for less than ideal results given the complexity and the timeframe. However, I like this challenge of the project.
- Attempting the backend in Ruby (I would like to see this in action)

## Timeline

- Monday: Backend framework as validated by Facebook / Game logic
- Tuesday: game logic and puzzleboard interactivity
- Wednesday: Puzzleboard interactivity
- Thursday: Styling
- Friday: Styling

## ERD

![ERD](https://github.com/aefritz/crossword-game/blob/master/Crossword_ERD.jpg)

## Wireframes
![Landing Page](https://github.com/aefritz/crossword-game/blob/master/CrosswordLandingPage.jpeg)
![User View](https://github.com/aefritz/crossword-game/blob/master/CrosswordUserView.jpeg)
![Gameplay](https://github.com/aefritz/crossword-game/blob/master/CrosswordPlay.jpeg)
