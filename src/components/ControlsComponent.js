'use strict';

import React from 'react';

require('styles//Controls.scss');

class ControlsComponent extends React.Component {

  renderStopButton() {
    if (this.props.slides.isPlaying) {
      return <button id="stop">Stop</button>
    }

    return <button id="stop" style={{display: 'none'}}>Stop</button>

  }

  renderPlayButton() {
    if (this.props.slides.isPlaying) {
      return <button id="play" style={{display: 'none'}}>Play</button>
    }

    return <button id="play">Play</button>
  }

  render() {
    return (
      <div className="controls-component">
          <button id="previous">Previous</button>
          {this.renderStopButton()}
          {this.renderPlayButton()}
          <button id="next">Next</button>
      </div>
    );
  }
}

ControlsComponent.displayName = 'ControlsComponent';

ControlsComponent.propTypes = {
  slides:      React.PropTypes.object.isRequired,
  onPrevious : React.PropTypes.func,
  onStop :     React.PropTypes.func,
  onPlay :     React.PropTypes.func,
  onNext :     React.PropTypes.func
};

export default ControlsComponent;
