import React, { Component } from 'react';
import {Route, Link, Redirect, withRouter} from 'react-router-dom';
import {getWordList} from './services/oxfordApi';
import {Facebook, FacebookApiException} from 'fb';
import CrosswordAnimation from './components/CrosswordAnimation.gif';
import FacebookLogin from './components/FacebookLogin.png';
import queryString from 'query-string';
import './App.css';
import LoginFlow from './components/LoginFlow';
import User from './components/User';
import Gameboard from './components/Gameboard';
import {getUser, createUser, getUserProPic, getSavedGames} from './services';
import dotenv from'dotenv'
let config = dotenv.config();
let appid = process.env.REACT_APP_APP_ID;
let appsecret = process.env.REACT_APP_APP_SECRET;


const fb = new Facebook();
const options = fb.options({
  appId: appid,
  appSecret: appsecret,
  redirectUri: 'https://localhost:3000/login'
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
      propicURL: "",
      currentUser: null,
      savedGames: null
    }
    this.exchangeCodeForToken = this.exchangeCodeForToken.bind(this);
    this.setToken = this.setToken.bind(this);
  }

  async setToken (token) {
    let resp = await getUser(token);
    if (resp.data.msg === 'user not found') {
      resp = await createUser(token);
    }
    this.setState({
      accessToken: token,
      token_set: true,
      currentUser: resp.data,
    })
  }

  async exchangeCodeForToken(code, passedFunction) {
    console.log(code);
    let token;
    let expires;
    await fb.api('oauth/access_token', {
      redirect_uri: 'http://localhost:3000/login',
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
      localStorage.setItem('crossword-app-token', JSON.stringify(token));
      passedFunction(token);
    });
  }



  async componentDidMount (props) {
    let token = '';
    let crossword_data = {};
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
      let resp = await getUser(token);
      if (resp.data.msg === 'user not found') {
        resp = await createUser(token);
      }
      let propicURL = await getUserProPic(token);
      let savedGames = await getSavedGames(token);
      this.setState({
        data: crossword_data,
        redirectURL: url,
        accessToken: token,
        currentUser: resp.data,
        propicURL: propicURL.data.url,
        savedGames: savedGames.data
      });
    } else {
      this.setState({
        redirectURL : url
      });
    }
  }

  render() {
    return (
      <div className="App">

        <nav>
          <Link to='/user'>User</Link>
          <Link to='/play'>Play</Link>
        </nav>

        <Route exact path = '/' render={(props) => (
          <div className="landingPage">
            <Link to='/login'><img src={FacebookLogin} className="facebookLogin"/></Link>
            <img src={CrosswordAnimation} className="landingImage"/>
          </div>
        )}/>

        <Route path = "/login" render={(props)=>
          <LoginFlow {...props}
          exchangeCodeForToken={this.exchangeCodeForToken}
          setToken={this.setToken}
          accessToken={this.state.accessToken}
          url={this.state.redirectURL}/>}/>

        <Route exact path = "/play/" render={(props)=>
          <Gameboard data={this.state.data} accessToken={this.state.accessToken}/>}/>

        <Route exact path = "/play/:id" render={(props)=>
          <Gameboard data={this.state.data} accessToken={this.state.accessToken} id={props.match.params.id}/>}/>

        <Route path = '/user' render={(props)=>
          <User accessToken={this.state.accessToken} currentUser={this.state.currentUser} propicURL={this.state.propicURL} savedGames={this.state.savedGames}/>}/>


      </div>
    )
  }
}

export default withRouter(App);
