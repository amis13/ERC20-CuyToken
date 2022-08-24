const { expect } = require("chai");
const { ethers } = require("hardhat");

const initialSupply = 100000;
const tokenName = "CuyToken";
const tokenSymbol = "CUY";

describe("Cuy token tests", function() {
  before(async function() {
    const availableSigners = await ethers.getSigners();
    this.deployer = availableSigners[0];

    const CuyToken = await ethers.getContractFactory("CuyToken");
    this.cuyToken = await CuyToken.deploy(tokenName, tokenSymbol, initialSupply);
    await this.cuyToken.deployed();
  });

  it('Should be named CuyToken', async function() {
    const fetchedTokenName = await this.cuyToken.name();
    expect(fetchedTokenName).to.be.equal(tokenName);
  });

  it('Should have symbol "CUY"', async function() {
    const fetchedTokenSymbol = await this.cuyToken.symbol();
    expect(fetchedTokenSymbol).to.be.equal(tokenSymbol);
  });

  it('Should have totalSupply passed in during deploying', async function() {
    const [ fetchedTotalSupply, decimals ] = await Promise.all([
      this.cuyToken.totalSupply(),
      this.cuyToken.decimals(),
    ]);
    const expectedTotalSupply = ethers.BigNumber.from(initialSupply).mul(ethers.BigNumber.from(10).pow(decimals));
    expect(fetchedTotalSupply.eq(expectedTotalSupply)).to.be.true;
  });


});