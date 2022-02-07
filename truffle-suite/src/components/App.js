import React, { Component } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import Token from '../abis/Token.json';
import EthSwap from '../abis/EthSwap.json';
import Navbar from './Navbar';
import Main from './Main';
import './App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { account: '', ethBalance: '0', toke: {}, tokenBalance: '0', ethSwap: {} };
  }

  componentDidMount() {
    this._asyncRequest = this.loadWeb3().then(() => {
        this._asyncRequest = null
      }
    );

  }
  componentWillUnmount() {
    if (this._asyncRequest) {
      this._asyncRequest.cancel();
    }
  }

  async handleAccountsChanged(accounts) {
    console.log("Call handleAccountsChanged")
    if (accounts.length === 0) {
       // MetaMask is locked or the user has not connected any accounts
       console.log('Please connect to MetaMask.')
       this.setState({account: 'Please connect to MetaMask.'})
       this.setState({ethBalance: ''})
    } else if (accounts[0] !== this.state.account) {
      //load Blockchain Data
      await this.loadBlockchainData(accounts[0])
    }

  }

  async loadBlockchainData(account) {
    const web3 = window.web3
    this.setState({account})
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ethBalance})
    console.log(this.state)
    const networkId = await web3.eth.net.getId()

    //Load Token
    const tokenData = Token.networks[networkId]
    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({token})
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      console.log(tokenBalance.toString())
      this.setState({tokenBalance: tokenBalance.toString()})
    } else {
      window.alert('Token contract not deployed on detected network.')
    }

    //Load EthSwap
    const ethSwapData = EthSwap.networks[networkId]
    if(ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ethSwap})
    } else {
      window.alert('EthSwap contract not deployed on detected network.');
    }
  }

  async loadWeb3() {
    const provider = await detectEthereumProvider();
    if (provider) {
      // Set the provider for web3 lib. provider here is the same as windows.ethereum
      window.web3 = new Web3(provider);
      //Update account when account is changed
      provider.on('accountsChanged', (accounts) => {this.handleAccountsChanged(accounts)});

      // enable the provider, this will open up the MetaMask wallet and ask the user to unlock
      provider.request({ method: 'eth_requestAccounts' }).then((accounts) =>{
            this.handleAccountsChanged(accounts)
          }
        ).catch((error) => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          window.alert('Please connect to MetaMask.');
          console.log('Please connect to MetaMask.');
        } else {
          console.error(error);
        }
      });
    } else {
      console.log('Please install MetaMask!');
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
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
                <Main/>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
