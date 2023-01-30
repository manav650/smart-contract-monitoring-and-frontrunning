const Web3 = require('web3');

// Connect to the Ethereum network
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545/'));

// The address of the smart contract
const contractAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';

// The address of the owner of the contract
const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// The ABI of the smart contract
const fs = require('fs');
var abiFile = fs.readFileSync('./artifacts/contracts/Reentrant.sol/Reentrant.json');
var contractABI = JSON.parse(abiFile)["abi"];

// Create a contract object
const contract = new web3.eth.Contract(contractABI, contractAddress);

// The name of the function to monitor
const functionSignature = web3.eth.abi.encodeFunctionSignature('withdraw()');

// Function to notify when a matching transaction is detected
const notify = (transaction) => {
    console.log(`Transaction detected: ${transaction.hash}`);
    // Send a counter transaction with a higher gas price
    // The data to be passed to the function
    const functionData = contract.methods.pause().encodeABI();

    // The parameters of the transaction
    const txParams = {
      from: web3.utils.toChecksumAddress(ownerAddress),
      to: contractAddress,
      data: functionData,
      gas: 1000000,
      gasPrice: 100
    };

    // Execute the function
    web3.eth.sendTransaction(txParams)
      .on('transactionHash', (hash) => {
        console.log(`Counter transaction sent: ${hash}`);
      })
      .on('receipt', (receipt) => {
        console.log(`Transaction receipt: ${JSON.stringify(receipt)}`);
      })
      .on('error', (error) => {
        console.error(`Error: ${error}`);
      });
};

// Monitor the mempool
web3.eth.subscribe('pendingTransactions', (error, transactionHash) => {
  if (error) {
    console.error(`Error: ${error}`);
    return;
  }
  web3.eth.getTransaction(transactionHash, (error, transaction) => {
    if (error) {
      console.error(`Error: ${error}`);
      return;
    }
    if (transaction.to === contractAddress) {
      const input = transaction.input;
      if (input.startsWith(functionSignature)) {
        notify(transaction);
      }
    }
  });
});
