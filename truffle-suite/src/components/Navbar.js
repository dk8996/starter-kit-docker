import React, { Component } from 'react';



class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { account: '', ethBalance: 0 };
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="/"
            rel="noopener noreferrer"
          >
            EthSwap
          </a>
        </nav>
      </div>
    );
  }
}

export default Navbar;
