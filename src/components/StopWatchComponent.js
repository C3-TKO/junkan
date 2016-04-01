'use strict';

import React from 'react';
import LinearProgress from 'material-ui/lib/linear-progress';

require('styles//StopWatch.scss');

class StopWatchComponent extends React.Component {


  constructor(props) {
    super(props);

    this.state = {
      completed: 0,
    };
  }

  componentDidMount() {
    this.timer = setTimeout(() => this.progress(5), 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  progress(completed) {
    if (completed > 100) {
      this.setState({completed: 100});
    } else {
      this.setState({completed});
      const diff = Math.random() * 10;
      this.timer = setTimeout(() => this.progress(completed + diff), 1000);
    }
  }

  render() {
    return (
      <div className="stopwatch-component">
        <LinearProgress mode="determinate" value={this.state.completed} />
      </div>
    );
  }
}

StopWatchComponent.displayName = 'StopWatchComponent';

export default StopWatchComponent;
