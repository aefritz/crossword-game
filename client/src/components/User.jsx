import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import {getUser, getSavedGames, getUserProPic, deleteGame} from '../services.js';
import {Facebook, FacebookApiException} from 'fb';
import CrosswordIcon from './CrosswordIcon.png';
import Delete from './Delete.png';
import dotenv from'dotenv'
let config = dotenv.config();
let appid = process.env.REACT_APP_APP_ID;
let appsecret = process.env.REACT_APP_APP_SECRET;

const fb = new Facebook();
const options = fb.options({
  appId: appid,
  appSecret: appsecret,
  redirectUri: 'http://localhost:3000/login',
});


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      imageURL: '',
      currentUser: null,
      savedGames: []
    }
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleDelete(id) {
    let resp = await deleteGame(id, this.state.accessToken);
    console.log(resp);
  }

  async componentDidMount() {

  }

  async componentDidUpdate(prevProps, prevState) {
    let accessToken = this.props.accessToken;
    let currentUser = this.props.currentUser;
    let profileURL = this.props.propicURL;
    let savedGames = this.props.savedGames;
    if ((prevProps.accessToken !== accessToken) || (prevProps.currentUser !== currentUser)) {
      this.setState(prevState => ({
        ...prevState,
        accessToken: accessToken,
        imageURL: profileURL,
        currentUser: currentUser,
        savedGames: savedGames
      }));
    }
  }

  render () {
    console.log(this.props);
  return (
    <div className='userViewContainer'>

      <div className='userView1'>
      <h3>{(this.state.currentUser === null) ? null : this.state.currentUser.email}</h3>
        <div className='imageContainer'>
          <img src={this.state.imageURL} className='profileImage'/>
        </div>
        <div>
          <h4>Member Since: <span>{(this.state.currentUser === null) ? null : this.state.currentUser.createdAt}</span></h4>
          <h4>Games Played: <span>{(this.state.currentUser === null) ? null : this.state.currentUser.gamesPlayed}</span></h4>
        </div>
      </div>

      <div className='userView2'>
      <h3>Saved Games</h3>
        <div className='savedGamesList'>
        {(this.state.savedGames === [] ) ? null : this.state.savedGames.map(game =>
            (<div className='savedGame'>
              <img src={Delete} className='deleteIcon' onClick={()=>this.handleDelete(game.id)}/>
              <Link to={`/play/${game.id}`}><img src={CrosswordIcon} className='crosswordIcon'/></Link>
              <div>
                <p>{game.createdAt}</p>
              </div>
            </div>))}
          </div>
      </div>

    </div>
  )
  }

}

export default User;
