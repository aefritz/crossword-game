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
  redirectUri: 'https://timesxwordthrowback.surge.sh/login',
});


class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: props.accessToken,
      imageURL: props.imageURL,
      currentUser: null,
      savedGames: []
    }
    this.handleDelete = this.handleDelete.bind(this);
  }

  async handleDelete(id) {
    let resp = await deleteGame(id, this.state.accessToken);
    this.setState(prevState => ({
      ...prevState,
      savedGames: prevState.savedGames.filter(game => game.id !== id)
    }));
  }

  async componentDidMount() {
    let token;
    if (localStorage.getItem('crossword-app-token') || this.state.accessToken === '') {
      token = JSON.parse(localStorage.getItem('crossword-app-token'));
    }
    let propicURL = await getUserProPic(token);
    let savedGames = await getSavedGames(token);
    let user = await getUser(token);
    this.setState({
      accessToken: token,
      propicURL: propicURL.data.url,
      currentUser: user.data,
      savedGames: savedGames.data
    });
  }


  render () {
  return (
    <div className='userViewContainer'>

      <div className='userView1'>
      <h3>{(this.state.currentUser === null) ? null : this.state.currentUser.email}</h3>
        <div className='imageContainer'>
          <img src={this.state.propicURL} className='profileImage'/>
        </div>
        <div>
          <h4>Member Since: <span>{(this.state.currentUser === null) ? null : this.state.currentUser.createdAt.slice(0,10)}</span></h4>
          <h4>Games Played: <span>{(this.state.currentUser === null) ? null : this.state.currentUser.gamesPlayed}</span></h4>
          <h4>Best Time: <span>{(this.state.currentUser === null) ? null : this.state.currentUser.bestTime}</span></h4>
        </div>
      </div>

      <div className='userView2'>
      <h3>Saved Games</h3>
        <div className='savedGamesList'>
        {this.state.savedGames.map(game =>
            (<div className='savedGame'>
              <img src={Delete} className='deleteIcon' onClick={()=>this.handleDelete(game.id)}/>
              <Link to={`/play/${game.id}`}><img src={CrosswordIcon} className='crosswordIcon'/></Link>
              <div>
                <p>{game.createdAt.slice(0,10)}</p>
              </div>
            </div>))}
        {(this.state.savedGames.length === 0) ? <h5><i>You have no saved games.</i></h5> : null}
          </div>
      </div>

    </div>
  )
  }

}

export default User;
