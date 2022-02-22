const { expect } = require("chai");
const { ethers } = require("hardhat");


describe('Doctor NFT testing...', function() {

  const zeroAddress = '0x0000000000000000000000000000000000000000';
  let owner, bob, jane, sara;

  let accounts;
  let DrNFT;
  let myDrNFT;

  beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    DrNFT = await ethers.getContractFactory("DrNFT");
    myDrNFT = await DrNFT.deploy();
    await myDrNFT.deployed();
    [ owner, bob, jane, sara] = await ethers.getSigners();
  });

  async function mint_bob() {
    const baseURITx = await myDrNFT.connect(owner).setBaseURI("https://cloudflare-ipfs.com/ipfs/");
    await baseURITx.wait();
    const mintTx = await myDrNFT.connect(owner).mint(bob.address, "QmXV2CC8e5iFDX8dwNWj9Lkde2Hb7S3ZAgXQFJtw4DcxLS");
    await mintTx.wait();
  }

  it("Should return the token name 'Doctor NFT' and symbol 'DNFT'", async function () {
      expect(await myDrNFT.name()).to.equal("Doctor NFT");
      expect(await myDrNFT.symbol()).to.equal("DRNFT");
  });

  it('correctly checks all the supported interfaces', async function() {
    expect(await myDrNFT.supportsInterface('0x80ac58cd')).to.equal(true);
    expect(await myDrNFT.supportsInterface('0x5b5e139f')).to.equal(true);
    expect(await myDrNFT.supportsInterface('0x780e9d63')).to.equal(true);
    expect(await myDrNFT.supportsInterface('0x4f558e79')).to.equal(false);
  });

  it('correctly mints a NFT', async function() {
    await mint_bob();
    expect(await myDrNFT.balanceOf(bob.address)).to.equal(1);
    expect(await myDrNFT.tokenURI(1)).to.equal("https://cloudflare-ipfs.com/ipfs/QmXV2CC8e5iFDX8dwNWj9Lkde2Hb7S3ZAgXQFJtw4DcxLS");
  });

  it('returns correct balanceOf', async function() {
    await mint_bob();
    await mint_bob();
    expect(await myDrNFT.balanceOf(bob.address)).to.equal(2);
    expect(await myDrNFT.tokenURI(1)).to.equal("https://cloudflare-ipfs.com/ipfs/QmXV2CC8e5iFDX8dwNWj9Lkde2Hb7S3ZAgXQFJtw4DcxLS");
    expect(await myDrNFT.tokenURI(2)).to.equal("https://cloudflare-ipfs.com/ipfs/QmXV2CC8e5iFDX8dwNWj9Lkde2Hb7S3ZAgXQFJtw4DcxLS");
  });

  it('throws when trying to get count of NFTs owned by 0x0 address', async function() {
    await expect(myDrNFT.balanceOf(zeroAddress)).to.be.revertedWith('ERC721: balance query for the zero address');
  });

  it('finds the correct owner of NFToken id', async function() {
    await mint_bob();
    expect(await myDrNFT.ownerOf(1)).to.equal(bob.address);
  });

  it('throws when trying to find owner od non-existing NFT id', async function() {
    await expect(myDrNFT.ownerOf(1)).to.be.revertedWith('ERC721: owner query for nonexistent token');
  });

  it('correctly approves account', async function() {
    await mint_bob();
    expect(await myDrNFT.connect(bob).approve(sara.address, 1)).to.emit(myDrNFT, 'Approval');
    expect(await myDrNFT.getApproved(1)).to.equal(sara.address);
  });

  it('correctly cancels approval', async function() {
    await mint_bob();
    await myDrNFT.connect(bob).approve(sara.address, 1);
    await myDrNFT.connect(bob).approve(zeroAddress, 1);
    expect(await myDrNFT.getApproved(1)).to.equal(zeroAddress);
  });

  it('throws when trying to get approval of non-existing NFT id', async function() {
    await expect(myDrNFT.getApproved(1)).to.be.revertedWith('ERC721: approved query for nonexistent token');
  });

  it('throws when trying to approve NFT ID from a third party', async function() {
    await mint_bob();
    await expect(myDrNFT.connect(sara).approve(sara.address, 1)).to.be.revertedWith('ERC721: approve caller is not owner nor approved for all');
  });

  it('correctly sets an operator', async function() {
    await mint_bob();
    expect(await myDrNFT.connect(bob).setApprovalForAll(sara.address, true)).to.emit(myDrNFT, 'ApprovalForAll');
    expect(await myDrNFT.isApprovedForAll(bob.address, sara.address)).to.equal(true);
  });

  it('correctly sets then cancels an operator', async function() {
    await mint_bob();
    await myDrNFT.connect(bob).setApprovalForAll(sara.address, true);
    await myDrNFT.connect(bob).setApprovalForAll(sara.address, false);
    expect(await myDrNFT.isApprovedForAll(bob.address, sara.address)).to.equal(false);
  });

  it('correctly transfers NFT from owner', async function() {
    await mint_bob();
    expect(await myDrNFT.connect(bob).transferFrom(bob.address, sara.address, 1)).to.emit(myDrNFT, 'Transfer');
    expect(await myDrNFT.balanceOf(bob.address)).to.equal(0);
    expect(await myDrNFT.balanceOf(sara.address)).to.equal(1);
    expect(await myDrNFT.ownerOf(1)).to.equal(sara.address);
  });

  it('correctly transfers NFT from approved address', async function() {
    await mint_bob();
    await myDrNFT.connect(bob).approve(sara.address, 1);
    await myDrNFT.connect(sara).transferFrom(bob.address, jane.address, 1);
    expect(await myDrNFT.balanceOf(bob.address)).to.equal(0);
    expect(await myDrNFT.balanceOf(jane.address)).to.equal(1);
    expect(await myDrNFT.ownerOf(1)).to.equal(jane.address);
  });

  it('correctly transfers NFT as operator', async function() {
    await mint_bob();
    await myDrNFT.connect(bob).setApprovalForAll(sara.address, true);
    await myDrNFT.connect(sara).transferFrom(bob.address, jane.address, 1);
    expect(await myDrNFT.balanceOf(bob.address)).to.equal(0);
    expect(await myDrNFT.balanceOf(jane.address)).to.equal(1);
    expect(await myDrNFT.ownerOf(1)).to.equal(jane.address);
  });

  it('throws when trying to transfer NFT as an address that is not owner, approved or operator', async function() {
    await mint_bob();
    await expect(myDrNFT.connect(sara).transferFrom(bob.address, jane.address, 1)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');
  });

  it('throws when trying to transfer NFT to a zero address', async function() {
    await mint_bob();
    await expect(myDrNFT.connect(bob).transferFrom(bob.address, zeroAddress, 1)).to.be.revertedWith('ERC721: transfer to the zero address');
  });

  it('throws when trying to transfer an invalid NFT', async function() {
    await expect(myDrNFT.connect(bob).transferFrom(bob.address, sara.address, 1)).to.be.revertedWith('ERC721: operator query for nonexistent token');
  });

  it('throws when trying to transfer an invalid NFT', async function() {
    await expect(myDrNFT.connect(bob).transferFrom(bob.address, sara.address, 1)).to.be.revertedWith('ERC721: operator query for nonexistent token');
  });

  it('correctly safe transfers NFT from owner', async function() {
    await mint_bob();
    expect(await myDrNFT.connect(bob)['safeTransferFrom(address,address,uint256)'](bob.address, sara.address, 1)).to.emit(myDrNFT, 'Transfer');
  //   https://stackoverflow.com/questions/68289806/no-safetransferfrom-function-in-ethers-js-contract-instance
  // https://docs.ethers.io/v5/single-page/#/v5/migration/web3/-%23-migration-from-web3-js--contracts--overloaded-functions
  // for ambiguous functions (two functions with the same
  // name), the signature must also be specified

    expect(await myDrNFT.balanceOf(bob.address)).to.equal(0);
    expect(await myDrNFT.balanceOf(sara.address)).to.equal(1);
    expect(await myDrNFT.ownerOf(1)).to.equal(sara.address);
  });

  it('throws when trying to safe transfers NFT to a smart contract', async function() {
    await mint_bob();
    await myDrNFT.connect(bob).approve(sara.address, 1);
    await myDrNFT.connect(sara).transferFrom(bob.address, myDrNFT.address, 1);
    await expect(myDrNFT.connect(bob)['safeTransferFrom(address,address,uint256)'](bob.address, myDrNFT.address, 1)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');
  });

  it('correctly safe transfers NFT to smart contract that can receive NFTs', async function() {
    await mint_bob();
    await myDrNFT.connect(bob).approve(sara.address, 1);
    await myDrNFT.connect(sara).transferFrom(bob.address, myDrNFT.address, 1);
    expect(await myDrNFT.balanceOf(bob.address)).to.equal(0);
    expect(await myDrNFT.balanceOf(myDrNFT.address)).to.equal(1);
    expect(await myDrNFT.ownerOf(1)).to.equal(myDrNFT.address);
  });

  it('correctly burns a NFT', async function() {
    await mint_bob();
    expect(await myDrNFT.connect(bob).burn(1)).to.emit(myDrNFT, 'Transfer');
    expect(await myDrNFT.balanceOf(bob.address)).to.equal(0);
    await expect(myDrNFT.ownerOf(1)).to.be.revertedWith('ERC721: owner query for nonexistent token');
  });

  it('throws when trying to burn non existent NFT', async function() {
    await expect(myDrNFT.connect(owner).burn(1)).to.be.revertedWith('ERC721: operator query for nonexistent token');
  });

  it("Should return total supply of tokens", async function () {
    await mint_bob();
    await mint_bob();
    await mint_bob();
    expect(await myDrNFT.connect(bob)['totalSupply()']()).to.equal(3);
  });

  it("Should return token by index", async function () {
    await mint_bob();
    await mint_bob();
    await mint_bob();
    expect(await myDrNFT.connect(bob).tokenByIndex(0)).to.equal(1);
    expect(await myDrNFT.connect(bob).tokenByIndex(1)).to.equal(2);
    expect(await myDrNFT.connect(bob).tokenByIndex(2)).to.equal(3);
  });

  it('throws when trying to get token by non-existing index', async function() {
    await mint_bob();
    await expect(myDrNFT.tokenByIndex(1)).to.be.revertedWith('ERC721Enumerable: global index out of bounds');
  });

  it('returns the correct token of owner by index', async function() {
    await mint_bob();
    await mint_bob();
    await mint_bob();
    expect(await myDrNFT.tokenOfOwnerByIndex(bob.address, 1)).to.equal(2);
  });

  it('throws when trying to get token of owner by non-existing index', async function() {
    await mint_bob();
    await expect(myDrNFT.tokenOfOwnerByIndex(bob.address, 1)).to.be.revertedWith('ERC721Enumerable: owner index out of bounds');
  });



});


// See https://github.com/nibbstack/erc721/blob/master/src/tests/tokens/nf-token.js