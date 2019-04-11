import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {getUser, getSavedGames, getUserProPic} from '../services.js';
import {Facebook, FacebookApiException} from 'fb';
import dotenv from'dotenv'
let config = dotenv.config();
let appid = process.env.REACT_APP_APP_ID;
let appsecret = process.env.REACT_APP_APP_SECRET;

const fb = new Facebook();
const options = fb.options({
  appId: appid,
  appSecret: appsecret,
  redirectUri: 'http://localhost:3000/',
  imageURL: ''
});


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      imageURL: '',
      currentUser: null
    }
  }

  async componentDidMount() {

  }

  async componentDidUpdate(prevProps, prevState) {
    let accessToken = this.props.accessToken;
    let currentUser = this.props.currentUser;
    let profileURL = this.props.propicURL
    console.log(accessToken);
    if ((prevProps.accessToken !== accessToken) || (prevProps.currentUser !== currentUser)) {
      this.setState(prevState => ({
        ...prevState,
        accessToken: accessToken,
        imageURL: profileURL,
        currentUser: currentUser
      }));
    }
  }

  render () {
    console.log(this.props);
  return (
    <div className='userViewContainer'>

      <div className='userView1'>
        <div className='imageContainer'>
          <img src={this.state.imageURL} className='profileImage'/>
        </div>
        <div>
          <h3>{(this.state.currentUser === null) ? null : this.state.currentUser.email}</h3>
          <h4>Member Since: <span>{(this.state.currentUser === null) ? null : this.state.currentUser.createdAt}</span></h4>
          <h4>Games Played: <span>{(this.state.currentUser === null) ? null : this.state.currentUser.gamesPlayed}</span></h4>
        </div>
      </div>

      <div className='userView2'>
      </div>

    </div>
  )
  }

}

export default User;
