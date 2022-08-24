const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const initialSupply = 100000;
const tokenName = "CuyToken";
const tokenSymbol = "CUY";

describe("Cuy token tests", function() {
  let cuyTokenV1;
  let deployer;

  describe("V1 tests", function () {
    before(async function() {
      const availableSigners = await ethers.getSigners();
      deployer = availableSigners[0];

      const CuyToken = await ethers.getContractFactory("CuyTokenV1");

      cuyTokenV1 = await upgrades.deployProxy(CuyToken, [initialSupply], { kind: "uups" });
      await cuyTokenV1.deployed();
    });

    it('Should be named CuyToken', async function() {
      const fetchedTokenName = await cuyTokenV1.name();
      expect(fetchedTokenName).to.be.equal(tokenName);
    });

    it('Should have symbol "CUY"', async function() {
      const fetchedTokenSymbol = await cuyTokenV1.symbol();
      expect(fetchedTokenSymbol).to.be.equal(tokenSymbol);
    });

    it('Should have totalSupply passed in during deployment', async function() {
      const [ fetchedTotalSupply, decimals ] = await Promise.all([
        cuyTokenV1.totalSupply(),
        cuyTokenV1.decimals(),
      ]);
      const expectedTotalSupply = ethers.BigNumber.from(initialSupply).mul(ethers.BigNumber.from(10).pow(decimals));
      expect(fetchedTotalSupply.eq(expectedTotalSupply)).to.be.true;
    });

    it('Should run into an error when executing a function that does not exist', async function () {
      expect(() => cuyTokenV1.mint(deployer.address, ethers.BigNumber.from(10).pow(18))).to.throw();
    });
  });

});