import React from 'react';
import {Redirect} from 'react-router-dom';
import queryString from 'query-string';


function LoginFlow (props) {
  let {accessToken, exchangeCodeForToken, setToken, url} = props;
  if ((accessToken === '') && (props.location.search === '') && (url !== '')) {
  /*if the user doesn't have an access token and there is no query string containing the
  OAuth code, then redirect to Facebook for authentication*/
    window.location = url;
  } else if ((accessToken === '') && (props.location.search !== '')) {
  /*if the user doesn't have an access token but there is a query string containing the
  OAuth code, then parse the URL for the code and exchange it for a valid token*/
    let {code} = queryString.parse(props.location.search);
    exchangeCodeForToken(code, setToken);
    return (<div></div>)
  } else {
    /*if the user has a token then take them to the user page*/ 
    return (<Redirect to="/user"/>)
  }
}

export default LoginFlow;
