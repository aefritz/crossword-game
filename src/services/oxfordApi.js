import axios from 'axios';

async function getWordList () {
  let resp = await axios(`https://cors-anywhere.herokuapp.com/https://od-api.oxforddictionaries.com/api/v1/wordlist/en/lexicalCategory%3Dnoun%3B?word_length=5`,{headers: {
    app_id: "17199df4",
    app_key: "47570c69bc84fa11a326a90c214198c7",
    accept: "application/json"
  }});
  return resp;
}

export default getWordList;
