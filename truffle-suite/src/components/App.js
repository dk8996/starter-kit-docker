import React, { Component } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import Navbar from './Navbar';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { account: '', ethBalance: 0 };
  }

  componentDidMount() {
    this._asyncRequest = this.loadWeb3().then(() => {
        this._asyncRequest = null
        this.loadBlockchainData()
      }
    );

  }
  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance})
    console.log(ethBalance)
  }

  async loadWeb3() {
    const provider = await detectEthereumProvider();
    if (provider) {
      // Set the provider for web3 lib. provider here is the same as windows.ethereum
      window.web3 = new Web3(provider);
      // enable the provider, this will open up the MetaMask wallet and ask the user to unlock
      provider.enable()
    } else {
      console.log('Please install MetaMask!');
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  render() {
    return (
      <div>
        <Navbar />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>
                <h1>Hello World</h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
