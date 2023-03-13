const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const initialSupply = 100000;
const tokenName = "CuyToken";
const tokenSymbol = "CUY";

describe("Cuy token tests", function() {
  let cuyTokenV1;
  let cuyTokenV2;
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

  describe("V2 tests", function () {
    before(async function () {

      userAccount = (await ethers.getSigners())[1];

      const CuyTokenV2 = await ethers.getContractFactory("CuyTokenV2");

      cuyTokenV2 = await upgrades.upgradeProxy(cuyTokenV1.address, CuyTokenV2);


      await cuyTokenV2.deployed();

    });

    it("Should has the same address, and keep the state as the previous version", async function () {
      const [totalSupplyForNewCongtractVersion, totalSupplyForPreviousVersion] = await Promise.all([
        cuyTokenV2.totalSupply(),
        cuyTokenV1.totalSupply(),
      ]);
      expect(cuyTokenV1.address).to.be.equal(cuyTokenV2.address);
      expect(totalSupplyForNewCongtractVersion.eq(totalSupplyForPreviousVersion)).to.be.equal(true);
    });

    it("Should revert when an account other than the owner is trying to mint tokens", async function() {
      const tmpContractRef = await cuyTokenV2.connect(userAccount);
      try {
        await tmpContractRef.mint(userAccount.address, ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)));
      } catch (ex) {
        expect(ex.message).to.contain("reverted");
        expect(ex.message).to.contain("Ownable: caller is not the owner");
      }
    });

    it("Should mint tokens when the owner is executing the mint function", async function () {
      const amountToMint = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)).mul(ethers.BigNumber.from(10));
      const accountAmountBeforeMint = await cuyTokenV2.balanceOf(deployer.address);
      const totalSupplyBeforeMint = await cuyTokenV2.totalSupply();
      await cuyTokenV2.mint(deployer.address, amountToMint);

      const newAccountAmount = await cuyTokenV2.balanceOf(deployer.address);
      const newTotalSupply = await cuyTokenV2.totalSupply();
      
      expect(newAccountAmount.eq(accountAmountBeforeMint.add(amountToMint))).to.be.true;
      expect(newTotalSupply.eq(totalSupplyBeforeMint.add(amountToMint))).to.be.true;
    });
  });

});