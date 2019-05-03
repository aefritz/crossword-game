import React, { Component } from 'react';
import {Route, Link, Redirect, withRouter} from 'react-router-dom';
import {Facebook, FacebookApiException} from 'fb';
import CrosswordAnimation from './components/CrosswordAnimation.gif';
import FacebookF from './components/FacebookF.png';
import LoginFlow from './components/LoginFlow';
import User from './components/User';
import Gameboard from './components/Gameboard';
import queryString from 'query-string';
import './App.css';
import {getUser, createUser, getUserProPic, getSavedGames} from './services';
import dotenv from 'dotenv';
let config = dotenv.config();
let appid = process.env.REACT_APP_APP_ID;
let appsecret = process.env.REACT_APP_APP_SECRET;

//instantiates new Facebook object with app info
const fb = new Facebook();
const options = fb.options({
  appId: appid,
  appSecret: appsecret,
  redirectUri: 'https://timesxwordthrowback.surge.sh/login'
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
      propicURL: "",
      currentUser: null,
      savedGames: null
    }
    this.exchangeCodeForToken = this.exchangeCodeForToken.bind(this);
    this.setToken = this.setToken.bind(this);
  }

  async componentDidMount (props) {
    //fetches redirect URL for OAuth flow in case user doesn't have a valid token
    let url = await fb.getLoginUrl({
      scope: 'email'
    });
    if (localStorage.getItem('crossword-app-token')) {
      //checks for token in local storage and uses it to retrieve account info
      let token = JSON.parse(localStorage.getItem('crossword-app-token'));
      await fb.setAccessToken(token);
      let resp = await getUser(token);
      if (resp.data.msg === 'user not found') {
        resp = await createUser(token);
      }
      let propicURL = await getUserProPic(token);
      let savedGames = await getSavedGames(token);
      this.setState({
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

  /*in this function, callback represents the callback that sets the token into state.
  The callback used for this function is setToken.*/
  async exchangeCodeForToken(code, callback) {
    let token;
    await fb.api('oauth/access_token', {
      redirect_uri: 'https://timesxwordthrowback.surge.sh/login',
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
      callback(token);
    });
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


  render() {
    return (
      <div className="App">

        <main>

            <nav>
              <h2>Times-xWord-Throwback</h2>
            </nav>

            {this.state.accessToken && <nav>
              <Link to='/user'>User</Link>
              <Link to='/play'>Play</Link>
              <Link to='/thanks'>Acknowledgements</Link>
              {this.state.accessToken && <Link to='/logout'>Logout</Link>}
            </nav>}

            <Route exact path = '/' render={(props) => (
              <div className="landingPage">
                <div className="fb-login-button" onClick={()=>this.props.history.push('/login')}><div className="logoContainer"><img src={FacebookF} className="facebookF"/></div><div className="loginText">Login with Facebook</div></div>
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


            <Route path = '/logout' render={(props)=>{
              localStorage.removeItem('crossword-app-token');
              this.setState({
                accessToken: ''
              });
              return (
                <Redirect to='/'/>
              )
            }}/>

            <Route path = '/thanks' render={(props)=>(
              <div className='thanks'>
                Special thanks to:
                <ul>
                  <li>The Noun Project for icons. Detailed credits on the way</li>
                  <li><a href='https://github.com/doshea/nyt_crosswords' className='attribution' id='github-link'>Doshea @ Github</a> for the JSON archive of past NY Times Crossword puzzles and answers</li>
                </ul>
              </div>
            )}/>

            <footer>
              Designed by Austin Fritz in 2019.
            </footer>

          </main>

      </div>
    )
  }
}

export default withRouter(App);
