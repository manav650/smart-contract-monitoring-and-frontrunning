// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Reentrant is Ownable, Pausable{
    mapping(address => uint) public balances;

    event Withdraw(address indexed account, uint amount);

    function deposit() public payable whenNotPaused {
        require(msg.value > 0);
        balances[_msgSender()] += msg.value;
    }

    function withdraw() public payable whenNotPaused{
        uint amount = balances[_msgSender()];
        require(amount > 0, "Not enough balance to withdraw");
        (bool sent, ) = _msgSender().call{value: amount}("");
        require(sent, "Failed to send Ether");
        balances[_msgSender()] = 0;

        emit Withdraw(_msgSender(), amount);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}
