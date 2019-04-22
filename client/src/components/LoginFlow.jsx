import React from 'react';
import {Redirect} from 'react-router-dom';
import queryString from 'query-string';
import {Facebook, FacebookApiException} from 'fb';


function LoginFlow (props) {
  let {accessToken, exchangeCodeForToken, setToken, url} = props;
  if ((accessToken === '') && (props.location.search === '') && (url !== '')) {
    window.location = url;
  } else if ((accessToken === '') && (props.location.search !== '')) {
    let {code} = queryString.parse(props.location.search);
    exchangeCodeForToken(code, setToken);
    return (<div></div>)
  } else {
    return (<Redirect to="/user"/>)
  }
}

export default LoginFlow;
