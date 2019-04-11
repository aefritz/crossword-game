import React, {Component} from 'react';
import {getWordDef} from '../services/oxfordApi';
import {saveGame, reSaveGame, getCrosswordData, deleteGame, updateUser, getSavedGame} from '../services.js';
import {FacebookShareButton, FacebookIcon} from 'react-share';

class Gameboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      words: {across: [
          {word:"",
          definition: ""},
        {
          word:"",
          definition: ""},
        {
          word:"",
          definition: ""}
      ],down:[
        {
          word:"",
          definition: ""},
        {
          word:"",
          definition: ""},
        {
          word:"",
          definition: ""},
      ]},
      selectedPosition: {x: null, y: null},
      toggleDirection: '',
      currentDefinition: '',
      accessToken: props.accessToken,
      win: false,
      timer: null,
      showMsg: false,
      game_time: 0,
      saved_game_id: (props.id !== undefined) ? props.id : null,
      positions: [
        [{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''}],
        [{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''}],
        [{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''}],
        [{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''}],
        [{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''},{letter:'', answer:''}]
      ],
      formValue: {
        searchWord: "",
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.turnOffMsg = this.turnOffMsg.bind(this);
  }

  async componentDidMount () {
    let resp = await getCrosswordData(this.state.accessToken);
    this.setState({
      data: resp.data,
    })
    if (this.state.saved_game_id === null) {
      this.startGame();
    } else {
      let resp = await getSavedGame(this.state.saved_game_id, this.state.accessToken);
      this.startSavedGame(resp.data);
    }
  }

  startSavedGame(data) {
    let timer = window.setInterval(()=>{
      console.log('bleep');
      document.querySelector('#timer').innerText = (parseInt(document.querySelector('#timer').innerText) + 1) + "s";
    },1000);
    this.setState({
      timer: timer,
      words: JSON.parse(data.puzzle),
      positions: JSON.parse(data.usersPositions)
    })
  }


  /*async componentWillReceiveProps(nextProps) {
    console.log(this.props);
    console.log(nextProps);
    console.log('fired');
    if (this.props.data !== nextProps.data) {
      await this.setState(prevState => ({
        ...prevState,
        data: nextProps.data,
        accessToken: nextProps.accessToken
      }));
      this.startGame();
    }
  }*/

  componentWillUnmount() {
        window.clearInterval(this.state.timer);
    }


  async startGame() {
    let finished = false;
    let down1Array;
    let down2Array;
    let down3Array;
    let down1ArrayLength;
    let down2ArrayLength;
    let down3ArrayLength;
    let across1;
    let across2;
    let across3;
    let down1;
    let down2;
    let down3;
    while (finished === false) {
      let oneMatchForEach = false;
      while (oneMatchForEach === false) {
        across1 = this.state.data[Math.floor(10000*Math.random())].answer;
        across3 = this.state.data[Math.floor(10000*Math.random())].answer;
        let regExp1 = this.convertStrInfoToRegex(across1[0], across3[0]);
        let regExp2 = this.convertStrInfoToRegex(across1[2], across3[2]);
        let regExp3 = this.convertStrInfoToRegex(across1[4], across3[4]);
        down1Array = this.state.data.filter(word => word.answer.match(regExp1));
        down2Array = this.state.data.filter(word => word.answer.match(regExp2));
        down3Array = this.state.data.filter(word => word.answer.match(regExp3));
        down1ArrayLength = down1Array.length;
        down2ArrayLength = down2Array.length;
        down3ArrayLength = down3Array.length;
        if ((down1ArrayLength > 0) && (down2ArrayLength > 0) && (down3ArrayLength > 0)) {
          oneMatchForEach = true;
        }
      }
      let match_found = false;
      let i = 0;
      while (match_found === false) {
        const indx1 = Math.floor(down1ArrayLength*Math.random());
        const indx2 = Math.floor(down2ArrayLength*Math.random());
        const indx3 = Math.floor(down3ArrayLength*Math.random());
        down1 = down1Array[indx1].answer;
        down2 = down2Array[indx2].answer;
        down3 = down3Array[indx3].answer;
        let regExpAttemptStr = `${down1[2]}.${down2[2]}.${down3[2]}`
        let regExpAttempt = new RegExp(regExpAttemptStr, 'i');
        let potentialMatches = this.state.data.filter(word => word.answer.match(regExpAttempt));
        if (potentialMatches.length > 0) {
          console.log(potentialMatches);
          const indx = Math.floor(potentialMatches.length*Math.random());
          across2 = potentialMatches[indx].answer;
          match_found = true;
          finished = true;
        }
        i++;
        if (i === 5) {
          break;
        }
      }
    }
    let wordArray = [across1, across2, across3, down1, down2, down3];
    console.log(wordArray);
    let definitionArray = wordArray.map((word) => {
      let entry = this.state.data.filter(blah => blah.answer === word)[0];
      return entry.clue;
    });
    let timer = window.setInterval(()=>{
      console.log('bleep');
      document.querySelector('#timer').innerText = (parseInt(document.querySelector('#timer').innerText) + 1) + "s";
    },1000);
    this.setState(prevState => ({
      ...prevState,
      timer: timer,
      words: {across: [
          {word: wordArray[0],
          definition: definitionArray[0]},
        {
          word: wordArray[1],
          definition: definitionArray[1]},
        {
          word: wordArray[2],
          definition: definitionArray[2]}
      ],down:[
        {
          word: wordArray[3],
          definition: definitionArray[3]},
        {
          word: wordArray[4],
          definition: definitionArray[4]},
        {
          word: wordArray[5],
          definition: definitionArray[5]},
      ]},
      positions: [
        [{letter: '', answer: wordArray[0][0]},{letter:'', answer: wordArray[0][1]},{letter:'', answer: wordArray[0][2]},{letter:'', answer: wordArray[0][3]},{letter:'', answer: wordArray[0][4]}],
        [{letter:'', answer: wordArray[3][1]},{letter:'', answer:''},{letter:'', answer:wordArray[4][1]},{letter:'', answer:''},{letter:'', answer:wordArray[5][1]}],
        [{letter:'', answer: wordArray[3][2]},{letter:'', answer: wordArray[1][1]},{letter:'', answer:wordArray[1][2]},{letter:'', answer:wordArray[1][3]},{letter:'', answer:wordArray[1][4]}],
        [{letter:'', answer: wordArray[3][3]},{letter:'', answer:''},{letter:'', answer:wordArray[4][3]},{letter:'', answer:''},{letter:'', answer:wordArray[5][3]}],
        [{letter:'', answer: wordArray[3][4]},{letter:'', answer: wordArray[2][1]},{letter:'', answer:wordArray[2][2]},{letter:'', answer:wordArray[2][3]},{letter:'', answer: wordArray[2][4]}]
      ],
    }));
  }


  async handleChange(ev) {
    const {value} = ev.target;
    console.log(value);
    let winStatus;
    const x = parseInt(ev.target.dataset.x);
    const y = parseInt(ev.target.dataset.y);
    console.log(x,y,value);
    const positions = this.state.positions;
    positions[y][x].letter = value;
    this.setState(prevState => ({
      ...prevState,
      positions: positions}));
    if (value.length !== 0) {
      if (this.state.toggleDirection === 'down') {
        let nextPosition = (y + 1) % 5;
        console.log(nextPosition);
        let node = document.querySelectorAll(`input[data-x = '${x}'][data-y = '${nextPosition}']`);
        console.log(node)
        document.querySelector(`input[data-x = '${x}'][data-y = '${nextPosition}']`).focus();
      }
      if (this.state.toggleDirection === 'across') {
        let nextPosition = (x + 1) % 5;
        console.log(nextPosition);
        let node = document.querySelectorAll(`input[data-x = '${x}'][data-y = '${nextPosition}']`);
        console.log(node)
        document.querySelector(`input[data-x = '${nextPosition}'][data-y = '${y}']`).focus();
      }
    }
    if (this.state.positions.every(a => a.every(b => b.letter.toUpperCase() === b.answer))) {
      window.clearInterval(this.state.timer);
      console.log('winner');
      let game_time = parseInt(document.querySelector('#timer').innerText);
      this.setState(prevState => ({
        ...prevState,
        game_time: game_time,
        win: true,
        showMsg: true,
        timer: null
      }));
      if (this.state.saved_game_id !== null) {
        await deleteGame(this.state.saved_game_id, this.state.accessToken);
      }
      console.log(this.state.accessToken);
      await updateUser({time: game_time}, this.state.accessToken);
    }
  }

  handleFocus(ev) {
    let x = ev.target.dataset.x;
    let y = ev.target.dataset.y;
    this.setState(prevState => ({
      ...prevState,
      selectedPosition: {
        x: x,
        y: y
      }
    }));
  }

  handleClick(ev) {
    console.log(ev.target);
    let direction;
    let x = ev.target.dataset.x;
    let y = ev.target.dataset.y;
    if (document.querySelectorAll('.rowHighlight')) {
      document.querySelectorAll('.rowHighlight').forEach(element => element.className='space');
    }
    if (((x === "0") || ( x === "2") || ( x === "4")) && this.state.toggleDirection === '') {
      document.querySelectorAll(`[data-x = '${x}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(x)/2;
      console.log(this.state.words.down[selector]);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'down',
        currentDefinition: this.state.words.down[selector].definition
      }))
    } else if (((x === "1") || (x === "3"))) {
      document.querySelectorAll(`[data-y = '${y}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(y)/2;
      console.log(this.state.words.across[selector]);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'across',
        currentDefinition: this.state.words.across[selector].definition
      }))
    } else if (((x === "0") || (x === "2") || ( x=== "4")) && ((y === "0") || (y === "2") || (y === "4"))  && this.state.toggleDirection === 'down') {
      console.log('triggered');
      document.querySelectorAll(`[data-y = '${y}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(y)/2;
      console.log(this.state.words.across[selector]);
      console.log(this.state.words.across[selector].definition);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'across',
        currentDefinition: this.state.words.across[selector].definition
      }))
    } else if (((x === "0") || (x === "2") || ( x=== "4")) && ((y === "0") || (y === "2") || (y === "4")) && this.state.toggleDirection === 'across') {
      document.querySelectorAll(`[data-x = '${x}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(x)/2;
      console.log(this.state.words.down[selector]);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'down',
        currentDefinition: this.state.words.down[selector].definition
      }))
    } else if (((x === "0") || (x === "2") || ( x=== "4")) && ((y === "1") || (y === "3"))) {
      document.querySelectorAll(`[data-x = '${x}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(x)/2;
      console.log(this.state.words.down[selector]);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'down',
        currentDefinition: this.state.words.down[selector].definition
      }))
    }
  }

  async handleSave() {
    let words = JSON.stringify(this.state.words);
    let positions = JSON.stringify(this.state.positions);
    let resp;
    if (this.state.saved_game_id === null) {
      resp = await saveGame({
        puzzle: words,
        usersPositions: positions
      }, this.state.accessToken);
      console.log(resp);
    } else if (this.state.saved_game_id !== null) {
      console.log(this.state.saved_game_id);
      resp = await reSaveGame(this.state.saved_game_id, {
        puzzle: words,
        usersPositions: positions
      }, this.state.accessToken);
      console.log(resp);
    }
    this.setState(prevState => ({
      ...prevState,
      saved_game_id: resp.data.id
    }));
  }

  convertStrInfoToRegex(char1, char2) {
    let newRegExpString = "";
    for (let i=0; i<5; i++) {
      if (i === 0) {
        newRegExpString += char1;
      } else if ((i >= 1) && (i < 4)) {
        newRegExpString += ".";
      } else if (i === 4) {
        newRegExpString += char2;
      }
    }
    let newRegEx = new RegExp(newRegExpString, 'i');
    return newRegEx;
  }

  turnOffMsg() {
    this.setState(prevState => ({
      ...prevState,
      showMsg: false
    }))
  }

  render() {
    return (
      <div className='gameContainer'>

      <div className='mainBoard'>
        <form>

          <div className="container" onClick={this.handleClick} onChange={this.handleChange}>

            <div className="space" data-x="0" data-y="0" >
              <input className="space" type='text'  data-x="0" data-y="0"  value={this.state.positions[0][0].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="1" data-y="0" >
              <input className="space" type='text'  data-x="1" data-y="0"  value={this.state.positions[0][1].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="2" data-y="0" >
              <input className="space" type='text'  data-x="2" data-y="0"  value={this.state.positions[0][2].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="3" data-y="0">
              <input className="space" type='text' data-x="3" data-y="0" value={this.state.positions[0][3].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="4" data-y="0">
              <input className="space" type='text'  data-x="4" data-y="0" value={this.state.positions[0][4].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="0" data-y="1">
              <input className="space" type='text' data-x="0" data-y="1" value={this.state.positions[1][0].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="dark_space" data-x="1" data-y="1">
            </div>

            <div className="space" data-x="2" data-y="1">
              <input className="space" type='text' data-x="2" data-y="1" value={this.state.positions[1][2].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="dark_space" data-x="3" data-y="1">
            </div>

            <div className="space" data-x="4" data-y="1">
              <input className="space" type='text' data-x="4" data-y="1" value={this.state.positions[1][4].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="0" data-y="2">
              <input className="space" type='text' data-x="0" data-y="2" value={this.state.positions[2][0].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="1" data-y="2">
              <input className="space" type='text' data-x="1" data-y="2" value={this.state.positions[2][1].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="2" data-y="2">
              <input className="space" type='text' data-x="2" data-y="2" value={this.state.positions[2][2].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="3" data-y="2">
              <input className="space" type='text' data-x="3" data-y="2" value={this.state.positions[2][3].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="4" data-y="2">
              <input className="space" type='text' data-x="4" data-y="2" value={this.state.positions[2][4].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="0" data-y="3">
              <input className="space" type='text' data-x="0" data-y="3" value={this.state.positions[3][0].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="dark_space" data-x="1" data-y="3">
            </div>

            <div className="space" data-x="2" data-y="3">
              <input className="space" type='text' data-x="2" data-y="3" value={this.state.positions[3][2].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="dark_space" data-x="3" data-y="3">
            </div>

            <div className="space" data-x="4" data-y="3">
              <input className="space" type='text' data-x="4" data-y="3" value={this.state.positions[3][4].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="0" data-y="4">
              <input className="space" type='text' data-x="0" data-y="4" value={this.state.positions[4][0].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="1" data-y="4">
              <input className="space" type='text' data-x="1" data-y="4" value={this.state.positions[4][1].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="2" data-y="4">
              <input className="space" type='text' data-x="2" data-y="4" value={this.state.positions[4][2].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="3" data-y="4">
              <input className="space" type='text' data-x="3" data-y="4" value={this.state.positions[4][3].letter} onFocus={this.handleFocus}></input>
            </div>

            <div className="space" data-x="4" data-y="4">
              <input className="space" type='text' data-x="4" data-y="4" value={this.state.positions[4][4].letter} onFocus={this.handleFocus}></input>
            </div>

          </div>
        </form>
      </div>

        <div className='gameInfo'>
          <button onClick={this.handleSave}>Save Game</button>
          <p id='timer'>0</p>
          <textarea value={this.state.currentDefinition} className='clue'></textarea>
          {
          (this.state.win && this.state.showMsg) && (<div className='winMessage' onClick={this.turnOffMsg}>
                <h3 onClick={this.turnOffMsg}>Congratulations</h3>
                <FacebookShareButton children={<FacebookIcon/>} url="http://facebook.com" quote={`I finished a puzzle in ${this.state.game_time} seconds`}/>
              </div>)
            }
        </div>

      </div>
      )
    }
}

export default Gameboard;
