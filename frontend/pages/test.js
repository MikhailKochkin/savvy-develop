import React, { Component } from "react";

class test extends Component {
  state = {
    data: ["Один.", "Один. Два.", "Один. Два. Три.", "Один. Два. Три. Четыре."],
    newData: [],
    step: 0
  };

  append = async () => {
    // not allowed AND not working
    const res = await this.setState(state => {
      const list = state.newData.push(this.state.data[this.state.step]);
      return {
        list
      };
    });
    const res2 = await this.setState(prevState => ({
      step: prevState.step + 1
    }));
  };

  pop = async () => {
    // not allowed AND not working
    const res = await this.setState(state => {
      const list = state.newData.pop();
      return {
        list
      };
    });
    const res2 = await this.setState(prevState => ({
      step: prevState.step - 1
    }));
  };

  pop = e => {
    const res = this.setState(prevState => ({ step: prevState.step - 1 }));
  };

  render() {
    // let newData = this.state.data;
    return (
      <>
        <div className="target">{this.state.newData}</div>
        <button onClick={this.pop}>Prev</button>
        <button onClick={this.append}>Next</button>
      </>
    );
  }
}

export default test;
