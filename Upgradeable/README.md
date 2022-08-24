# ERC20-CuyToken

## Converting our erc-20 token to an updatable contract using OpenZeppelin contracts

### Step by step to create our project

01. Run the command `npm init`
02. Run the command `npm install --save-dev hardhat`
03. Run the command `npx hardhat`
04. Create an empty project
05. Create a folder named contracts
06. Run the command `npm install @openzeppelin/contracts-upgradeable`
07. Run the command `npm install @openzeppelin/hardhat-upgrades`
08. edit hardhat.config.js file and add `require("@openzeppelin/hardhat-upgrades");`
09. Create a file named CuyTokenV1.sol in contracts folder
10. Run the command `npx hardhat compile`
11. Create a folder named test
12. Run the command `npm install --save-dev chai`
13. Run the command `npm install --save-dev ethers`
14. Create a file named CuyToken.test.js in test folder
15. Run the command `npx hardhat test`
16. Create a file named CuyTokenV2.sol in contracts folder
17. Edit a file named CuyToken.test.js in test folder
15. Run the command `npx hardhat test`

### How to run this code?

01. Clone or download the repository.
02. Run the command `npm install`.
03. To run the tests run the command `npx hardhat test`