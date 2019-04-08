import React from 'react';
import queryString from 'query-string';
import {Facebook, FacebookApiException} from 'fb';
const fb = new Facebook();
const options = fb.options({
  appId: '406373586828876',
  appSecret: '49ef2134cedfd3e8b0e5007b6e4e156a',
  redirectUri: 'http://localhost:3000/'
});


function LoginFlow (props) {
  let {accessToken, exchangeCodeForToken, setToken, url} = props;
  console.log(url);
  console.log(props);
  if ((accessToken === '') && (props.location.search === '') && (url !== '')) {
    window.location = url;
  } else if ((accessToken === '') && (props.location.search !== '')) {
    let {code} = queryString.parse(props.location.search);
    console.log(code);
    exchangeCodeForToken(code, setToken);
    return (<div></div>)
  } else {
    console.log(url);
    return (<div></div>)
  }
}

export default LoginFlow;
