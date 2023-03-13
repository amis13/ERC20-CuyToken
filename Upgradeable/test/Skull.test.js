const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

const initialSupply = 100000;
const tokenName = "Skull";
const tokenSymbol = "SKL";

describe("Skull token test", function() {
  let skullV1;
  let skullV2;
  let deployer;

  describe("V1 tests", function () {
    before(async function() {
      const availableSigners = await ethers.getSigners();
      deployer = availableSigners[0];

      const skull = await ethers.getContractFactory("SkullV1");

      skullV1 = await upgrades.deployProxy(skull, [initialSupply], { kind: "uups" });
      await skullV1.deployed();
    });

    it('Should be named Skull', async function() {
      const fetchedTokenName = await skullV1.name();
      expect(fetchedTokenName).to.be.equal(tokenName);
    });

    it('Should have symbol "SKL"', async function() {
      const fetchedTokenSymbol = await skullV1.symbol();
      expect(fetchedTokenSymbol).to.be.equal(tokenSymbol);
    });

    it('Should have totalSupply passed in during deployment', async function() {
      const [ fetchedTotalSupply, decimals ] = await Promise.all([
        skullV1.totalSupply(),
        skullV1.decimals(),
      ]);
      const expectedTotalSupply = ethers.BigNumber.from(initialSupply).mul(ethers.BigNumber.from(10).pow(decimals));
      expect(fetchedTotalSupply.eq(expectedTotalSupply)).to.be.true;
    });

    it('Should run into an error when executing a function that does not exist', async function () {
      expect(() => skullV1.mint(deployer.address, ethers.BigNumber.from(10).pow(18))).to.throw();
    });
  });

  describe("V2 tests", function () {
    before(async function () {

      userAccount = (await ethers.getSigners())[1];

      const skullV2 = await ethers.getContractFactory("SkullV2");

      skullV2 = await upgrades.upgradeProxy(skullV1.address, skullV2);


      await skullV2.deployed();

    });

    it("Should has the same address, and keep the state as the previous version", async function () {
      const [totalSupplyForNewCongtractVersion, totalSupplyForPreviousVersion] = await Promise.all([
        skullV2.totalSupply(),
        skullV1.totalSupply(),
      ]);
      expect(skullV1.address).to.be.equal(skullV2.address);
      expect(totalSupplyForNewCongtractVersion.eq(totalSupplyForPreviousVersion)).to.be.equal(true);
    });

    it("Should revert when an account other than the owner is trying to mint tokens", async function() {
      const tmpContractRef = await skullV2.connect(userAccount);
      try {
        await tmpContractRef.mint(userAccount.address, ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)));
      } catch (ex) {
        expect(ex.message).to.contain("reverted");
        expect(ex.message).to.contain("Ownable: caller is not the owner");
      }
    });

    it("Should mint tokens when the owner is executing the mint function", async function () {
      const amountToMint = ethers.BigNumber.from(10).pow(ethers.BigNumber.from(18)).mul(ethers.BigNumber.from(10));
      const accountAmountBeforeMint = await skullV2.balanceOf(deployer.address);
      const totalSupplyBeforeMint = await skullV2.totalSupply();
      await skullV2.mint(deployer.address, amountToMint);

      const newAccountAmount = await skullV2.balanceOf(deployer.address);
      const newTotalSupply = await skullV2.totalSupply();
      
      expect(newAccountAmount.eq(accountAmountBeforeMint.add(amountToMint))).to.be.true;
      expect(newTotalSupply.eq(totalSupplyBeforeMint.add(amountToMint))).to.be.true;
    });
  });

});