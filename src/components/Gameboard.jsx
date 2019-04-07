import React, {Component} from 'react';

class Gameboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      formValue: {
        searchWord: "",
      }
    }
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.setState({
      data: this.props.data
    });
    if (this.state.data !== []) {
      //this.startGame();
    }
  }


  /*startGame() {
    let startIndx = Math.floor(5000*Math.random());
    for (let i=0)
    let startIndx = Math.floor(5*Math.random());
    let
  }*/


  handleChange(ev) {
    const {name, value} = ev.target;
    this.setState(prevState => ({
      ...prevState,
      formValue: {
        ...prevState.formValue,
        [name]: value
      }
    }));
    console.log(this.state.data.filter(word => (word.word === value)));
  }

  convertArrInfoToRegex(array) {
    let newRegExpString = "";
    for (let i=0; i<5; i++) {
      if (array[i] === "") {
        newRegExpString += "*"
      } else {
        newRegExpString += array[i];
      }
    }
    let newRegEx = new RegExp(newRegExpString, 'i');
    return newRegEx;
  }

  render() {
    return (
      <div>
        <input name="searchWord" value={this.state.formValue.searchWord} onChange={this.handleChange}></input>
        <div className="container">
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          <div className="space"></div>
          </div>
        </div>
      )
    }
}

export default Gameboard;
