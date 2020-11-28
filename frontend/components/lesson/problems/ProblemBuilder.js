import React, { Component } from "react";
import TestBlock from "./blocks/TestBlock";
import Block from "./blocks/Block";
import styled from "styled-components";

const Styles = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  .tree {
    display: inline-block;
  }
`;

const colors = [
  "#0D3B66",
  "#FAF0CA",
  "#F4D35E",
  "#EE964B",
  "#F95738",
  "#5AB1BB",
  "#DA4167",
  "#54DEFD",
  "#9B5DE5",
  "#F15BB5",
  "#FEE440",
  "#00BBF9",
  "#00F5D4",
  "#390099",
  "#9E0059",
  "#FF0054",
  "#FF5400",
  "#FFBD00",
  "#EAE0CC",
  "#FF5733",
  "#FDEDEC",
  "#0D3B66",
  "#FAF0CA",
  "#F4D35E",
  "#EE964B",
  "#F95738",
  "#5AB1BB",
  "#DA4167",
  "#54DEFD",
  "#9B5DE5",
  "#F15BB5",
  "#FEE440",
  "#00BBF9",
  "#00F5D4",
  "#390099",
  "#9E0059",
  "#FF0054",
  "#FF5400",
  "#FFBD00",
  "#EAE0CC",
  "#FF5733",
  "#FDEDEC",
  "#0D3B60",
  "#FAF0C0",
  "#F4D350",
  "#EE9640",
  "#F95730",
  "#5AB1B0",
  "#DA4160",
  "#54DEF0",
  "#9B5DE0",
  "#F15BB0",
  "#FEE441",
  "#00BBF0",
  "#00F5D0",
  "#390090",
  "#9E0050",
  "#FF0050",
  "#FF5401",
  "#FFBD01",
  "#EAE0C0",
  "#FF5731",
  "#FDEDE2",
];

class ProblemBuilder extends Component {
  state = {
    blocks: [],
    tree_blocks: "",
    usedElements: [],
    colorNum: 1,
  };

  getNode = (type, id) => {
    this.props.getNode(type, id);
  };

  generateTree = (el) => {
    let obj = {
      key: colors[this.state.colorNum],
      source_color: "#fff",
      correct: correct,
      el: (
        <TestBlock
          id={el.id ? el.id : "first"}
          type={el.__typename.toLowerCase()}
          newTests={this.props.lesson.newTests}
          quizes={this.props.lesson.quizes}
          notes={this.props.lesson.notes}
          lessonID={this.props.lesson.id}
          value={el ? el : null}
          correct={correct}
          source={source ? source : null}
          getNewBlock={this.handleNewBlock}
          sourceColor={color}
          color={colors[this.state.colorNum]}
          fixed={true}
        />
      ),
      nodes: [],
    };
  };

  object_search = (
    obj,
    value,
    newColor,
    el,
    source,
    color,
    colors,
    correct
  ) => {
    // check the key of an object
    // obj.key - color of the cheked block  , value – color of the source of the new block
    if (obj.key === value) {
      // if it matches, add el to nodes
      if (obj.nodes.find((el) => el.correct == correct) === undefined) {
        obj.nodes.push({
          key: newColor,
          source_color: value,
          correct: correct,
          el: (
            <TestBlock
              id={el.id ? el.id : "first"}
              type={el.__typename.toLowerCase()}
              newTests={this.props.lesson.newTests}
              quizes={this.props.lesson.quizes}
              notes={this.props.lesson.notes}
              lessonID={this.props.lesson.id}
              value={el ? el : null}
              correct={correct}
              source={source ? source : null}
              getNewBlock={this.handleNewBlock}
              sourceColor={color}
              color={colors[this.state.colorNum]}
              fixed={true}
            />
          ),
          nodes: [],
        });
      } else if (obj.nodes.find((el) => el.correct == correct) !== undefined) {
        console.log(4);
        obj.nodes[
          obj.nodes.indexOf(obj.nodes.find((el) => el.correct == correct))
        ].key = colors[this.state.colorNum];
        obj.nodes[
          obj.nodes.indexOf(obj.nodes.find((el) => el.correct == correct))
        ].el = (
          <TestBlock
            id={el.id ? el.id : "first"}
            type={el.__typename.toLowerCase()}
            newTests={this.props.lesson.newTests}
            quizes={this.props.lesson.quizes}
            notes={this.props.lesson.notes}
            lessonID={this.props.lesson.id}
            value={el ? el : null}
            correct={correct}
            source={source ? source : null}
            getNewBlock={this.handleNewBlock}
            sourceColor={color}
            color={colors[this.state.colorNum]}
            fixed={true}
          />
        );
      }
    } else {
      // if it doesn't, get down to its nodes
      if (obj.nodes) {
        // and recurisvely check every node
        obj.nodes.map((n) =>
          this.object_search(
            n,
            value,
            newColor,
            el,
            source,
            color,
            colors,
            correct
          )
        );
      }
    }
    this.setState({ tree_blocks: obj });
  };

  handleNewBlock = async (id, root, color, correct) => {
    let el = this.props.elements.filter((l) => l.id === id)[0];
    let source = this.props.elements.filter((l) => l.id === root)[0];
    if (el) {
      console.log(1);
      const res = await this.object_search(
        this.state.tree_blocks,
        color,
        colors[this.state.colorNum],
        el,
        source,
        color,
        colors,
        correct
      );
      console.log(2);
      this.setState((prevState) => ({
        colorNum: prevState.colorNum + 1,
      }));
    }
    console.log(3);
  };

  open = (obj) => <Block obj={obj} />;

  componentDidMount = () => {
    this.setState({
      tree_blocks: {
        key: colors[0],
        source_color: "#FFF",
        el: (
          <TestBlock
            id="first"
            newTests={this.props.elements.newTests}
            quizes={this.props.elements.quizes}
            notes={this.props.elements.notes}
            getNewBlock={this.handleNewBlock}
            color={colors[0]}
            sourceColor="#FFF"
            lessonID={this.props.lessonID}
            getNode={this.getNode}
          />
        ),
        nodes: [],
      },
    });
  };

  render() {
    return (
      <Styles>
        {/* {console.log(this.state.tree_blocks)} */}
        <div className="tree">
          {/* {this.state.tree_blocks !== "" && this.open(this.state.tree_blocks)} */}
        </div>
      </Styles>
    );
  }
}

export default ProblemBuilder;
