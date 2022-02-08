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

    this.state = {
      account: '',
      ethBalance: '0',
      token: {},
      tokenBalance: '0',
      ethSwap: {},
      loading: true
    };
  }

  sendApproveToken(tokenAmount) {
    console.log(`EthSwap Address: ${this.state.ethSwap.options.address}`)
    console.log(`TokenAmount: ${tokenAmount}`)
    console.log(`from: ${this.state.account}`)

    return this.state.token.methods.approve(this.state.ethSwap.options.address, tokenAmount)
      .send({ from: this.state.account }).on('error', (error) => {
        this.setState({ loading: false })
        window.alert('Failed approval transaction, please try again.')
        console.log('Failed approval transaction, please try again.')
      }
      )
  }
  sendSellTokens(tokenAmount) {
    return this.state.ethSwap.methods.sellTokens(tokenAmount)
      .send({ from: this.state.account }).on('error', (error) => {
        this.setState({ loading: false })
        window.alert('Failed swap token transaction, please try again.')
        console.log('Failed swap token transaction, please try again.')
      }
      )
  }

  sendBuyTokens(etherAmount) {
    return this.state.ethSwap.methods.buyTokens()
      .send({ value: etherAmount, from: this.state.account }).on('error', (error) => {
        this.setState({ loading: false })
        window.alert('Failed swap token transaction, please try again.')
        console.log('Failed swap token transaction, please try again.')
      })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true });
    try {
      this.sendApproveToken(tokenAmount).then((receipt) => {
        this.sendSellTokens(tokenAmount).then((receipt) => {
          //update the balances in the UI
          this.loadBlockchainData(this.state.account)
          this.setState({ loading: false })
        })
      })
    } catch (error) {
      this.setState({ loading: false })
      window.alert('Failed transaction, please try again.')
      console.log('Failed transaction, please try again.')
    }
  }

  buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.sendBuyTokens(etherAmount).then((receipt) => {
      //update the balances in the UI
      this.loadBlockchainData(this.state.account)
      this.setState({ loading: false })
    })
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
    this.setState({ account })
    const ethBalance = await web3.eth.getBalance(this.state.account)
    this.setState({ ethBalance })
    console.log(this.state)
    const networkId = await web3.eth.net.getId()

    //Load Token
    const tokenData = Token.networks[networkId]
    if (tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      console.log(tokenBalance.toString())
      this.setState({ tokenBalance: tokenBalance.toString() })
    } else {
      window.alert('Token contract not deployed on detected network.')
    }

    //Load EthSwap
    const ethSwapData = EthSwap.networks[networkId]
    if (ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ ethSwap })
    } else {
      window.alert('EthSwap contract not deployed on detected network.');
    }
    this.setState({loading:false})
  }

  async loadWeb3() {
    const provider = await detectEthereumProvider();
    if (provider) {
      // Set the provider for web3 lib. provider here is the same as windows.ethereum
      window.web3 = new Web3(provider);
      //Update account when account is changed
      provider.on('accountsChanged', (accounts) => { this.handleAccountsChanged(accounts) });

      // enable the provider, this will open up the MetaMask wallet and ask the user to unlock
      provider.request({ method: 'eth_requestAccounts' }).then((accounts) => {
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
    let content
    if (this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
      ethBalance = {this.state.ethBalance} 
      tokenBalance = {this.state.tokenBalance}
      buyTokens = {this.buyTokens}
      sellTokens = {this.sellTokens}
      />
    }
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
