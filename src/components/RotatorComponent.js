'use strict';

import React from 'react';
import IframeComponent from './IframeComponent';
import ControlsComponent from './ControlsComponent'
import StopWatchComponent from './StopWatchComponent';

require('styles//Rotator.scss');

class RotatorComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pointer: 0,
      isPlaying: false,
      timeout: undefined
    };
  }

  play = () => {
    clearTimeout(this.state.timeout);
    const timeout = setTimeout(() => this.next(), this.props.slides[this.state.pointer].duration);

    this.setState({
      isPlaying: true,
      timeout: timeout
    });
  }

  stop = () => {
    clearTimeout(this.state.timeout);
    this.setState({
      isPlaying: false,
      timeout: undefined
    })
  }

  next = () => {
    let nextPointer = this.state.pointer
    if(++nextPointer >= this.props.slides.length) {
      this.setState({pointer: 0})
    }
    else {
      this.setState({pointer: nextPointer})
    }

    if (this.state.isPlaying) {
      this.play();
    }
  }

  previous = () => {
    let nextPointer = this.state.pointer
    if(--nextPointer < 0) {
      this.setState({pointer: this.props.slides.length - 1})
    }
    else {
      this.setState({pointer: nextPointer})
    }

    if (this.state.isPlaying) {
      this.play();
    }
  }

  render() {
    return (
      <div className="rotator-component">
        <IframeComponent url={this.props.slides[this.state.pointer].url}/>
        <ControlsComponent
          slides={this.props.slides}
          isPlaying={this.state.isPlaying}
          play={this.play.bind(this)}
          stop={this.stop.bind(this)}
          next={this.next.bind(this)}
          previous={this.previous.bind(this)}
        />
        <StopWatchComponent
          isPlaying={this.state.isPlaying}
          timeout={this.state.timeout}
          duration={this.props.slides[this.state.pointer].duration}
        />
      </div>
    );
  }
}

RotatorComponent.displayName = 'RotatorComponent';
RotatorComponent.propTypes = {
  slides: React.PropTypes.array.isRequired
};

export default RotatorComponent;