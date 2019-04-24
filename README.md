## Deployed Site

[https://timesxwordthrowback.surge.sh](https://timesxwordthrowback.surge.sh)

## Description

TimesXWordThrowback generates NY Times-style mini crossword puzzles that reuse previous clue-answer pairs from the NY Times crossword. Users log in with their Facebook accounts and can save and share their performance on Facebook with their friends.

## Acknowledgements

Thanks to [https://github.com/doshea/nyt_crosswords](Doshea @ Github) for the JSON archive of past NY Times Crossword puzzles and answers.

## MVP

- Users log in with Facebook
- The app generates Times-style mini (5x5) crosswords using past NY Times crossword clues
- User's performance is tracked. (time and no. of puzzles solved)
- Users can save progress
- Users can share to Facebook

## Technologies
- React
- Express
- PostgreSQL
- Facebook SDK for Node.js
- query-string: Node module used in OAuth login flow to extract code from redirect
- RegExp: used for matching clue-answer pairs to fill the puzzleboard
- JSON: for importing clue-answer pairs and storing saved games

## Post-MVP

- Option to log in without Facebook... or option to log in with other platforms.
- More flexible gameboard configuration ... right now there are always three 'down' words and
three 'across' words in the same positions. I would like to be able to render new configurations.


## ERD

![ERD](https://github.com/aefritz/crossword-game/blob/master/Crossword_ERD.jpg)

## Wireframes
![Landing Page](https://github.com/aefritz/crossword-game/blob/master/CrosswordLandingPage.jpeg)
![User View](https://github.com/aefritz/crossword-game/blob/master/CrosswordUserView.jpeg)
![Gameplay](https://github.com/aefritz/crossword-game/blob/master/CrosswordPlay.jpeg)
