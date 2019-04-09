import React, {Component} from 'react';
import {getWordDef} from '../services/oxfordApi';

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
          defintion: ""},
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
  }

  componentDidMount() {
  }

  async componentWillReceiveProps(nextProps) {
    if (this.props.data !== nextProps.data) {
      await this.setState(prevState => ({
        ...prevState,
        data: nextProps.data
      }));
      this.startGame();
    }
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
        across1 = this.state.data[Math.floor(5000*Math.random())].word;
        across3 = this.state.data[Math.floor(5000*Math.random())].word;
        let regExp1 = this.convertStrInfoToRegex(across1[0], across3[0]);
        let regExp2 = this.convertStrInfoToRegex(across1[2], across3[2]);
        let regExp3 = this.convertStrInfoToRegex(across1[4], across3[4]);
        down1Array = this.state.data.filter(word => word.word.match(regExp1));
        down2Array = this.state.data.filter(word => word.word.match(regExp2));
        down3Array = this.state.data.filter(word => word.word.match(regExp3));
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
        down1 = down1Array[indx1].word;
        down2 = down2Array[indx2].word;
        down3 = down3Array[indx3].word;
        let regExpAttemptStr = `${down1[2]}.${down2[2]}.${down3[2]}`
        let regExpAttempt = new RegExp(regExpAttemptStr, 'i');
        let potentialMatches = this.state.data.filter(word => word.word.match(regExpAttempt));
        if (potentialMatches.length > 0) {
          console.log(potentialMatches);
          const indx = Math.floor(potentialMatches.length*Math.random());
          across2 = potentialMatches[indx].word;
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
    let definitionArray = await Promise.all(wordArray.map(async (word) => {
      let resp = await getWordDef(word);
      return resp;
    }));
    this.setState(prevState => ({
      ...prevState,
      words: {across: [
          {word: wordArray[0],
          definition: definitionArray[0]},
        {
          word: wordArray[1],
          defintion: definitionArray[1]},
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
    }))
  }


  handleChange(ev) {
    const {name, value} = ev.target;
    this.setState(prevState => ({
      ...prevState,
      formValue: {
        ...prevState.formValue,
        [name]: value
      }
    }));
  }

  handleFocus(ev) {
    if (document.querySelector('.selected')) {
      document.querySelector('.selected').className='space';
    }
    ev.target.className = 'selected';
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
        currentDefinition: this.state.words.down[selector]
      }))
    } else if (((x === "1") || (x === "3"))) {
      document.querySelectorAll(`[data-y = '${y}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(y)/2;
      console.log(this.state.words.across[selector]);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'across',
        currentDefinition: this.state.words.across[selector]
      }))
    } else if (((x === "0") || (x === "2") || ( x=== "4")) && ((y === "0") || (y === "2") || (y === "4"))  && this.state.toggleDirection === 'down') {
      document.querySelectorAll(`[data-y = '${y}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(y)/2;
      console.log(this.state.words.across[selector]);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'across',
        currentDefinition: this.state.words.across[selector]
      }))
    } else if (((x === "0") || (x === "2") || ( x=== "4")) && ((y === "0") || (y === "2") || (y === "4")) && this.state.toggleDirection === 'across') {
      document.querySelectorAll(`[data-x = '${x}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(x)/2;
      console.log(this.state.words.down[selector]);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'down',
        currentDefinition: this.state.words.down[selector]
      }))
    } else if (((x === "0") || (x === "2") || ( x=== "4")) && ((y === "1") || (y === "3"))) {
      document.querySelectorAll(`[data-x = '${x}']`).forEach(element => element.className = 'rowHighlight');
      const selector = parseInt(x)/2;
      console.log(this.state.words.down[selector]);
      this.setState(prevState => ({
        ...prevState,
        toggleDirection: 'down',
        currentDefinition: this.state.words.down[selector]
      }))
    }
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

  render() {
    return (
      <div>

      <form>
        <div className="container" onClick={this.handleClick}>

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

          <div className="space" data-x="1" data-y="1">

          </div>

          <div className="space" data-x="2" data-y="1">
            <input className="space" type='text' data-x="2" data-y="1" value={this.state.positions[1][2].letter} onFocus={this.handleFocus}></input>
          </div>

          <div className="space" data-x="3" data-y="1">

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

          <div className="space" data-x="1" data-y="3">

          </div>

          <div className="space" data-x="2" data-y="3">
            <input className="space" type='text' data-x="2" data-y="3" value={this.state.positions[3][2].letter} onFocus={this.handleFocus}></input>
          </div>

          <div className="space" data-x="3" data-y="3">

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
      )
    }
}

export default Gameboard;
