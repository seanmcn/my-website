import React from 'react';
import './darkModeToggle.scss';

export default class DarkModeToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      darkMode: false,
    };
  }

  toggleDarkMode = () => {
    const { darkMode } = this.state;
    this.setState({
      darkMode: !darkMode,
    });
  }

  render() {
    const { darkMode } = this.state;
    return (
      <div className="navbar-item">
        <button onClick={this.toggleDarkMode} type="button" className="button darkModeToggleButton">
          <span className="icon">
            <i
              className={`fa fa-lightbulb ${darkMode ? 'darkModeOnBulb' : 'darkModeOffBulb'}`}
            />
          </span>
        </button>
      </div>
    );
  }
}
