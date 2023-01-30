const Web3 = require('web3');
const nodemailer = require('nodemailer');

// Connect to the Ethereum network
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545/'));

// The address of the smart contract
const contractAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707';

// The ABI of the smart contract
const fs = require('fs');
var abiFile = fs.readFileSync('./artifacts/contracts/Reentrant.sol/Reentrant.json');
var contractABI = JSON.parse(abiFile)["abi"];

// Create a contract object
const contract = new web3.eth.Contract(contractABI, contractAddress);

// The address of the owner of the contract
const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// Email settings
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
    }
});

// Listen for the 'Withdraw' event
contract.events.Withdraw({}, (error, event) => {
    if (error) {
        console.error(`Error: ${error}`);
    } else {
        console.log("Caught Event");
        // Get the address of the caller
        const callerAddress = event.returnValues.account;
        console.log('Caller: ' + callerAddress);
        // Get the amount withdrawn
        const withdrawnAmount = event.returnValues.amount;
        console.log('Caller: ' + withdrawnAmount);
        // Send an email to the owner
        transporter.sendMail({
            from: 'youremail@gmail.com',
            to: 'owner@example.com',
            subject: 'Reentrancy Attack Attempt',
            text: `A withdrawal function has been called by ${callerAddress}`
        }, (error, info) => {
            if (error) {
                console.error(`Error: ${error}`);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
});