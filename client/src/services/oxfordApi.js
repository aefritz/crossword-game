import axios from 'axios';
import dotenv from'dotenv'
let config = dotenv.config();
let oxford_id = process.env.REACT_APP_OXFORD_ID;
let oxford_secret = process.env.REACT_APP_OXFORD_SECRET;


async function getWordList () {
  let resp = await axios(`https://cors-anywhere.herokuapp.com/https://od-api.oxforddictionaries.com/api/v1/wordlist/en/lexicalCategory%3Dnoun%3B?word_length=5`,{headers: {
    app_id: '17199df4',
    app_key: '47570c69bc84fa11a326a90c214198c7',
    accept: "application/json"
  }});
  return resp;
}

async function getWordDef (word) {
  console.log(oxford_id);
  console.log(oxford_secret);
  let resp = await axios(`https://cors-anywhere.herokuapp.com/https://od-api.oxforddictionaries.com/api/v1/entries/en/${word}`,{headers: {
    app_id: '17199df4',
    app_key: '47570c69bc84fa11a326a90c214198c7',
    accept: "application/json"
  }});
  return resp.data.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0];
}

export {getWordList,
  getWordDef};
