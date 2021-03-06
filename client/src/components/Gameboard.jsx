import React, {Component} from 'react';
import {saveGame, reSaveGame, getCrosswordData, deleteGame, updateUser, getSavedGame} from '../services.js';
import {FacebookShareButton, FacebookIcon} from 'react-share';

class Gameboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      words: {across: [
          {word:"",
          clue: ""},
        {
          word:"",
          clue: ""},
        {
          word:"",
          clue: ""}
      ],down:[
        {
          word:"",
          clue: ""},
        {
          word:"",
          clue: ""},
        {
          word:"",
          clue: ""},
      ]},
      selectedPosition: {x: null, y: null}, //whichever square is active
      toggleDirection: '', //is the user looking a 'down' word or 'across' word
      currentClue: '', // the clue for the selected word
      accessToken: props.accessToken,
      win: false, // when true, win modal displays
      timer: null,
      showMsg: false, //used to turn off win modal
      loading: true, // determines whether 'loading' modal displays
      game_time: 0,
      saved_game_id: (props.id !== undefined) ? props.id : null,
      positions: [ //juxtaposes the letters the user has entered and the correct letter
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
    }) //if an instance of this component is not initialized without a saved game, start a fresh game
    if (this.state.saved_game_id === null) {
      this.startGame();
    } else { //otherwise, follow the saved game flow
      let resp = await getSavedGame(this.state.saved_game_id, this.state.accessToken);
      this.startSavedGame(resp.data);
    }
  }

  startSavedGame(data) {
    let timer = window.setInterval(()=>{
      document.querySelector('#timer').innerText = (parseInt(document.querySelector('#timer').innerText) + 1) + "s";
    },1000);
    this.setState({
      timer: timer, //the timer must be placed in state so that it can be removed from the window object
      words: JSON.parse(data.puzzle),
      positions: JSON.parse(data.usersPositions),
      loading: false
    })
  }


  componentWillUnmount() { //needed to clear timer from the window when user navigates away
    window.clearInterval(this.state.timer);
  }


  async startGame() {
    let finished = false; /*finished refers to whether or not a set of words has been found
    to fill the gameboard*/
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
    while (finished === false) { //until there are matches for every position -- down & across
      let oneMatchForEach = false; //set to false until there are
      while (oneMatchForEach === false) {

        //first, choose two words to be 1-across and 3-across
        across1 = this.state.data[Math.floor(5000*Math.random())].answer;
        across3 = this.state.data[Math.floor(5000*Math.random())].answer;

        /*creates regExps to search through answerlist
        ex. regExp1 is '*...*' where the *s represent the first characters of 1-across and 3-across
        and the .s represent a wildcard character.
        Answers that match the regExps are used to find 1-Down, 2-Down, and 3-Down
        */
        let regExp1 = this.convertStrInfoToRegex(across1[0], across3[0]);
        let regExp2 = this.convertStrInfoToRegex(across1[2], across3[2]);
        let regExp3 = this.convertStrInfoToRegex(across1[4], across3[4]);
        /*these arrays consist of all answers that match the regExp,
        but a particular answer is not chosen yet*/
        down1Array = this.state.data.filter(word => word.answer.match(regExp1));
        down2Array = this.state.data.filter(word => word.answer.match(regExp2));
        down3Array = this.state.data.filter(word => word.answer.match(regExp3));

        down1ArrayLength = down1Array.length;
        down2ArrayLength = down2Array.length;
        down3ArrayLength = down3Array.length;
        if ((down1ArrayLength > 0) && (down2ArrayLength > 0) && (down3ArrayLength > 0)) {
          oneMatchForEach = true; //if there are matching clues available, break out of the loop
        }
      }

      let match_found = false;
      let i = 0;
      while (match_found === false) {

        //from the arrays above, choose one answer from each at random
        const indx1 = Math.floor(down1ArrayLength*Math.random());
        const indx2 = Math.floor(down2ArrayLength*Math.random());
        const indx3 = Math.floor(down3ArrayLength*Math.random());
        down1 = down1Array[indx1].answer;
        down2 = down2Array[indx2].answer;
        down3 = down3Array[indx3].answer;

        //regExpAttempt is the regular expression that the final answer, 2-across, must match
        let regExpAttemptStr = `${down1[2]}.${down2[2]}.${down3[2]}`
        let regExpAttempt = new RegExp(regExpAttemptStr, 'i');
        let potentialMatches = this.state.data.filter(word => word.answer.match(regExpAttempt));
        if (potentialMatches.length > 0) {
          const indx = Math.floor(potentialMatches.length*Math.random());
          across2 = potentialMatches[indx].answer;
          match_found = true;
          finished = true; /*if there is a matching answer, assign it to 2-across and break
          out of the loop*/
        }
        i++;
        /*otherwise, make 5 more attempts to fill this position, or else go back to line
        103 and repeat the process*/
        if (i === 5) {
          break;
        }
      }
    }
    let wordArray = [across1, across2, across3, down1, down2, down3];
    let clueArray = wordArray.map((word) => {
      let entry = this.state.data.filter(blah => blah.answer === word)[0];
      return entry.clue;
    });
    let timer = window.setInterval(()=>{
      document.querySelector('#timer').innerText = (parseInt(document.querySelector('#timer').innerText) + 1) + "s";
    },1000);
    this.setState(prevState => ({
      ...prevState,
      timer: timer,
      loading: false, //now that the puzzle is set up, turn off the loading modal
      words: {across: [
          {word: wordArray[0],
          clue: clueArray[0]},
        {
          word: wordArray[1],
          clue: clueArray[1]},
        {
          word: wordArray[2],
          clue: clueArray[2]}
      ],down:[
        {
          word: wordArray[3],
          clue: clueArray[3]},
        {
          word: wordArray[4],
          clue: clueArray[4]},
        {
          word: wordArray[5],
          clue: clueArray[5]},
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

  /*handleChange here has two main functions:
  1) to change the focus from one input field to the next as the user inputs characters
  2) to check positions for whether the user's answers match the true answers ... resulting in a win
  */
  async handleChange(ev) {
    const {value} = ev.target;
    let winStatus;
    const x = parseInt(ev.target.dataset.x);
    const y = parseInt(ev.target.dataset.y);
    const positions = this.state.positions;
    positions[y][x].letter = value;
    this.setState(prevState => ({
      ...prevState,
      positions: positions}));
    if (value.length !== 0) {
      if (this.state.toggleDirection === 'down') {
        let nextPosition = (y + 1) % 5;
        let node = document.querySelectorAll(`input[data-x = '${x}'][data-y = '${nextPosition}']`);
        document.querySelector(`input[data-x = '${x}'][data-y = '${nextPosition}']`).focus();
      }
      if (this.state.toggleDirection === 'across') {
        let nextPosition = (x + 1) % 5;
        let node = document.querySelectorAll(`input[data-x = '${x}'][data-y = '${nextPosition}']`);
        document.querySelector(`input[data-x = '${nextPosition}'][data-y = '${y}']`).focus();
      }
    }
    if (this.state.positions.every(a => a.every(b => b.letter.toUpperCase() === b.answer))) {
      window.clearInterval(this.state.timer);
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
    let direction;
    let x = ev.target.dataset.x;
    let y = ev.target.dataset.y;
    if (document.querySelectorAll('.rowHighlight')) { //if a previous row/column is highlighted, remove it
      document.querySelectorAll('.rowHighlight').forEach(element => element.className='space');
    }
    if (((x === "0") || ( x === "2") || ( x === "4")) && this.state.toggleDirection === '') {
      //if the user clicks on a cell in column 1, 3, or 5 the default view is 'down'
      document.querySelectorAll(`[data-x = '${x}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(x)/2; /*if the user selects the xth column, they are
      selecting the x/2th 'down' word*/
      console.log(this.state.words.down[selector].word);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'down',
        currentClue: this.state.words.down[selector].clue
      }))
    } else if (((x === "1") || (x === "3"))) {
      document.querySelectorAll(`[data-y = '${y}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(y)/2;
      console.log(this.state.words.across[selector].word);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'across',
        currentClue: this.state.words.across[selector].clue
      }))
    } else if (((x === "0") || (x === "2") || ( x=== "4")) && ((y === "0") || (y === "2") || (y === "4"))  && this.state.toggleDirection === 'down') {
      document.querySelectorAll(`[data-y = '${y}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(y)/2;
      console.log(this.state.words.across[selector].word);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'across',
        currentClue: this.state.words.across[selector].clue
      }))
    } else if (((x === "0") || (x === "2") || ( x=== "4")) && ((y === "0") || (y === "2") || (y === "4")) && this.state.toggleDirection === 'across') {
      document.querySelectorAll(`[data-x = '${x}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(x)/2;
      console.log(this.state.words.down[selector].word);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'down',
        currentClue: this.state.words.down[selector].clue
      }))
    } else if (((x === "0") || (x === "2") || ( x=== "4")) && ((y === "1") || (y === "3"))) {
      document.querySelectorAll(`[data-x = '${x}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(x)/2;
      console.log(this.state.words.down[selector].word);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'down',
        currentClue: this.state.words.down[selector].clue
      }))
    }
  }

  //makes calls to back-end to save the game
  //sends words and postions to the database in JSON format
  async handleSave() {
    let words = JSON.stringify(this.state.words);
    let positions = JSON.stringify(this.state.positions);
    let resp;
    if (this.state.saved_game_id === null) {
      resp = await saveGame({
        puzzle: words,
        usersPositions: positions
      }, this.state.accessToken);
    } else if (this.state.saved_game_id !== null) {
      resp = await reSaveGame(this.state.saved_game_id, {
        puzzle: words,
        usersPositions: positions
      }, this.state.accessToken);
    }
    this.setState(prevState => ({
      ...prevState,
      saved_game_id: resp.data.id
    }));
  }

  //creates regular expressions of the form '[char1]...[char2]'
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

  //toggles showMsg in state so the user can collapse the win modal
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
          <div className='clueContainer'>
            <p className='clueHeader'>Clue:</p>
            <div className='clueContainer2'>
              <p className='clue'>{this.state.currentClue} </p>
            </div>
          </div>
          {
          (this.state.win && this.state.showMsg) && (<div className='modalMessage' onClick={this.turnOffMsg}>
                <h3 onClick={this.turnOffMsg}>Congratulations</h3>
                <h3>You finished in {this.state.game_time} seconds</h3>
                <h6>Share on Facebook</h6>
                <FacebookShareButton children={<FacebookIcon/>} url="https://timesxwordthrowback.surge.sh" quote={`I finished a puzzle in ${this.state.game_time} seconds`}/>
              </div>)
            }
            {
            (this.state.loading) && (<div className='modalMessage'>
                  <h3>Loading</h3>
                  <h3>Please wait</h3>
                </div>)
              }
        </div>

      </div>
      )
    }
}

export default Gameboard;
