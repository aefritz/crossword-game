import React, { Component } from 'react';
import {Route, Link, Redirect, withRouter} from 'react-router-dom';
import getWordList from './services/oxfordApi';
import {Facebook, FacebookApiException} from 'fb';
import queryString from 'query-string';
import './App.css';
import LoginFlow from './components/LoginFlow';
import Gameboard from './components/Gameboard';
import {getUser, createUser} from './services';
let appid = process.env.REACT_APP_APP_ID;
let appsecret = process.env.REACT_APP_APP_SECRET;


const fb = new Facebook();
const options = fb.options({
  appId: appid,
  appSecret: appsecret,
  redirectUri: 'http://localhost:3000/'
});

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      formValue: {
        searchWord: "",
      },
      filteredData: [],
      token_set: false,
      accessToken: "",
      redirectURL: "",
      expires: "",
      currentUser: null
    }
    this.exchangeCodeForToken = this.exchangeCodeForToken.bind(this);
    this.setToken = this.setToken.bind(this);
  }

  setToken (token) {
    this.setState({
      accessToken: token,
      token_set: true
    })
  }

  async exchangeCodeForToken(code, passedFunction) {
    console.log(code);
    let token;
    let expires;
    await fb.api('oauth/access_token', {
      redirect_uri: 'http://localhost:3000/',
      client_id: appid,
      client_secret: appsecret,
      code: code
    }, async function (res) {
      if(!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      token = res.access_token;
      await fb.setAccessToken(token);
      await fb.api('me', { fields: ['email'], access_token: token }, function (res) {
        console.log(res);
      });
      localStorage.setItem('crossword-app-token', JSON.stringify(token));
      passedFunction(token);
    });
  }



  async componentDidMount (props) {
    let crossword_data = {};
    let token = ''
    if (localStorage.getItem('crossword-app-data')) {
      crossword_data = JSON.parse(localStorage.getItem('crossword-app-data'));
    } else {
      const resp = await getWordList();
      crossword_data = resp.data.results;
      console.log(crossword_data)
      localStorage.setItem('crossword-app-data', JSON.stringify(crossword_data));
    }
    let url = await fb.getLoginUrl({
      scope: 'email'
    });
    if (localStorage.getItem('crossword-app-token')) {
      token = JSON.parse(localStorage.getItem('crossword-app-token'));
      await fb.setAccessToken(token);
    }
    await fb.api('me', { fields: ['email'], access_token: token }, function (res) {
      console.log(res);
    });
    let resp = await getUser(token);
    console.log(resp.data);
    this.setState({
      data: crossword_data,
      redirectURL: url,
      accessToken: token,
      currentUser: resp.data
    });
  }

  render() {
    return (
      <div className="App">

        <nav>
          <Link to='/user'>User</Link>
          <Link to='/play'>Play</Link>
        </nav>

        <Route exact path = "/" render={(props)=>
          <LoginFlow {...props}
          exchangeCodeForToken={this.exchangeCodeForToken}
          setToken={this.setToken}
          accessToken={this.state.accessToken}
          url={this.state.redirectURL}/>}/>

        <Route path = "/play" render={(props)=>
        <Gameboard data={this.state.data}/>}/>

        <Route path = "/play" render={(props)=>
        null}/>

      </div>
    )
  }
}

export default withRouter(App);
