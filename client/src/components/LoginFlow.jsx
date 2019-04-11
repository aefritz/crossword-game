import React from 'react';
import {Redirect} from 'react-router-dom';
import queryString from 'query-string';
import {Facebook, FacebookApiException} from 'fb';


function LoginFlow (props) {
  let {accessToken, exchangeCodeForToken, setToken, url} = props;
  console.log(url);
  console.log(props);
  if ((accessToken === '') && (props.location.search === '') && (url !== '')) {
    console.log('triggered1');
    window.location = url;
  } else if ((accessToken === '') && (props.location.search !== '')) {
    console.log('triggered2');
    let {code} = queryString.parse(props.location.search);
    console.log(code);
    exchangeCodeForToken(code, setToken);
    return (<div></div>)
  } else {
    return (<Redirect to="/user"/>)
  }
}

export default LoginFlow;
