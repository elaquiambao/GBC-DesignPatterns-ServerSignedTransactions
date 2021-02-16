var express = require('express')
var router = express.Router()
const Web3 = require('web3')
const contractAbi = require('./contractAbi.json')
var Tx = require('ethereumjs-tx')
const contractAddress = '0x3B3294DBde2D0fe1b1685c380424E5157F94b419'

function init() {
  var TxObj = Tx.Transaction
  const web3 = new Web3(
    new Web3.providers.HttpProvider('http://localhost:7545'),
  )
  web3.eth.getAccounts(console.log)
  let contractInstance = new web3.eth.Contract(contractAbi, contractAddress)
  console.log('contractInstance')

  const account = '0x686F0A015A27484b816D595bF7a9efd3FdAC067C'
  const privateKey = Buffer.from(
    '780e6ea0cdca4f6cc6ed764bec76b214d8a3fa8e06c10b909705e1cdf103d0fd',
    'hex',
  )
  const _data = contractInstance.methods.set(50).encodeABI()
  console.log(_data)
  var rawTx = {}
  web3.eth.getTransactionCount(account).then((nonce) => {
    rawTx = {
      nonce: nonce,
      gasPrice: '0x20000000000',
      gasLimit: '0x41409',
      to: contractAddress,
      value: 0,
      data: _data,
    }

    var tx = new TxObj(rawTx)
    tx.sign(privateKey)

    var serializedTx = tx.serialize()

    web3.eth
      .sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', console.log)
  })
}
/* GET home page. */
router.get('/', function (req, res, next) {
  init()
  res.render('index', { title: 'Express' })
})

module.exports = router
