import axios from 'axios';
let oxford_id = process.env.OXFORD_ID;
let oxford_secret = process.env.OXFORD_SECRET;

async function getWordList () {
  let resp = await axios(`https://cors-anywhere.herokuapp.com/https://od-api.oxforddictionaries.com/api/v1/wordlist/en/lexicalCategory%3Dnoun%3B?word_length=5`,{headers: {
    app_id: oxford_id,
    app_key: oxford_secret,
    accept: "application/json"
  }});
  return resp;
}

export default getWordList;
