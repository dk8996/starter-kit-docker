const { assert } = require('chai');
const { default: Web3 } = require('web3');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai').use(require('chai-as-promised')).should()

function tokens(n) {
    return web3.utils.toWei(n,'ether')
}

contract('Token',(accounts) => {
    describe('Token deployment', async () => {
        it('contract has a name', async () => {
            let token = await Token.new()
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
    })
})

contract('EthSwap',(accounts) => {
    let deployer = accounts[0]
    let investor = accounts[1]
    let token, ethSwap
    before (async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        await token.transfer(ethSwap.address, tokens('1000000'))
    })

    describe('EthSwap deployment', async () => {
        it('contract has a name', async () => {
            let name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })
        it('contract has tokens', async () => {
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })
    describe('EthSwap buy tokens', async () => {
        let result
        before (async () => {
            result = await ethSwap.buyTokens({ from: investor, value: web3.utils.toWei('1','ether')})
        })

        it('Lets user buy tokens for a fix price (in Eth)', async () => {
            //Check investor toke balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('100'))

            //Check ethSwap balance after purchase
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1','Ether'))

            // Check logs
            const event = result.logs[0].args

            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })

        describe('EthSwap sell tokens', async () => {
        let result
        before (async () => {
            let approveResult = await token.approve(ethSwap.address, tokens('100'), { from: investor})
            result = await ethSwap.sellTokens(tokens('100'),{ from: investor })
        })

        it('Lets user sell tokens for a fix price, get Eth back', async () => {
            //Check investor toke balance after purchase
            let investorBalance = await token.balanceOf(investor)
            assert.equal(investorBalance.toString(), tokens('0'))

            //Check ethSwap balance after purchase
            let ethSwapBalance
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('1000000'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('0','Ether'))

            // Check logs
            const event = result.logs[0].args

            assert.equal(event.account, investor)
            assert.equal(event.token, token.address)
            assert.equal(event.amount.toString(), tokens('100').toString())
            assert.equal(event.rate.toString(), '100')
        })
    })
})