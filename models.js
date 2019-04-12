const Sequelize = require('sequelize');

let sequelize;
if (process.env.DATABASE_URL) {
sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  operatorsAliases: false,
  define: {
    underscored: true,
    returning: true
  }
});
} else {
  sequelize = new Sequelize({
    database: 'crossword',
    dialect: 'postgres',
    operatorsAliases: false,
    define: {
      underscored: true,
      returning: true
  }
  });
}


const User = sequelize.define('users', {
  email: {type: Sequelize.STRING, primaryKey: true},
  gamesPlayed: {type: Sequelize.INTEGER, defaultValue: 0, allowNull: false},
  bestTime: {type: Sequelize.INTEGER, allowNull: true}
});

const SavedGame = sequelize.define('saved_games', {
  puzzle: {type: Sequelize.TEXT, allowNull: false},
  usersPositions: {type: Sequelize.TEXT, allowNull: false}
});

const Question = sequelize.define('questions', {
  id: {type: Sequelize.INTEGER, primaryKey: true},
  clue: {type: Sequelize.TEXT},
  answer: {type: Sequelize.TEXT},
  month: {type: Sequelize.STRING},
  day: {type: Sequelize.STRING},
  year: {type: Sequelize.STRING}
})

SavedGame.belongsTo(User);
User.hasMany(SavedGame, {onDelete: 'cascade'});

module.exports = {
  sequelize,
  User,
  SavedGame,
  Question
};
