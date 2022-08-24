# ERC20-CuyToken

## Converting our erc-20 token to an updatable contract using OpenZeppelin contracts

### Step by step to create our project

01. Run the command `npm init`
02. Run the command `npm install --save-dev hardhat`
03. Run the command `npx hardhat`
04. Create an empty project
05. Create a folder named contracts
06. Run the command `npm install @openzeppelin/contracts-upgradeable`
06. Run the command `npm install @openzeppelin/hardhat-upgrades`
07. edit hardhat.config.js file and add `require("@openzeppelin/hardhat-upgrades");`
08. Create a file named CuyTokenV1.sol in contracts folder
05. Create a folder named test
06. Run the command `npm install --save-dev chai`
06. Run the command `npm install --save-dev ethers`
08. Create a file named CuyToken.test.js in test folder


### How to run this code?

01. Clone or download the repository.
02. Run the command `npm install`.
03. To run the tests run the command `npx hardhat test`