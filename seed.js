let {sequelize} = require('./models');

async function loadCrosswordData () {
  let directory = __dirname;
  let filepath = directory + "/crossword_data.csv";
  await sequelize.query(`COPY questions(id,clue,answer,month,year,day,created_at,updated_at) FROM '${filepath}' DELIMITER ',' CSV HEADER`)
}

loadCrosswordData();
