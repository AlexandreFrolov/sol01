const ethereumButton = document.querySelector('.enableEthereumButton');
const newNftButton = document.querySelector('.newNftButton');
const newNftResult = document.querySelector('.newNftResult');
const tokenID = document.querySelector('.token');
const tokenIDButton = document.querySelector('.tokenIDButton');
const tokenIDResult = document.querySelector('.tokenIDResult');
const tokenID2 = document.querySelector('.tokenID2');
const tokenIdApprove = document.querySelector('.tokenIdApprove');
const approveButton = document.querySelector('.approveButton');
const approveResult = document.querySelector('.approveResult');
const sendDrNftResult = document.querySelector('.sendDrNftResult');
const sendDrNftButton = document.querySelector('.sendDrNftButton');
const showAccount = document.querySelector('.showAccount');
const chainID = document.querySelector('.chainID');
const toAddrInput = document.querySelector('.toAddr');
const sendToAddrInput = document.querySelector('.sendToAddr');
const uriInput = document.querySelector('.uri');
const addressInput = document.querySelector('.address');
const playArea = document.getElementById('playArea');
playArea.style.display = 'none';

const contractAddress = '0x177B55b7274Ef561FD421b191E40001433F3834d';
const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function mint(address toAddress, string memory newTokenURI) external returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256 balance)",
  "function tokenURI(uint256 tokenId) public view returns (string memory)",
  "function ownerOf(uint256 tokenId) external view returns (address owner)",
  "function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable",
  "function approve(address _approved, uint256 _tokenId) external payable",
  "function getApproved(uint256 _tokenId) external view returns (address)",
  "event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)"
];

let provider;
let signer;
let erc721;
let erc721_rw;
let accounts = [];

if (typeof window.ethereum !== 'undefined') {
  document.getElementById('metamask_ok').innerHTML = 'да';
  console.log('MetaMask установлен!');
  init();
}
else {
  const ethDiv = document.getElementById('ethereumDiv');
  ethDiv.style.display = 'none';
  console.error('MetaMask не установлен!');
}

function init() {
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  erc721 = new ethers.Contract(contractAddress, abi, provider);
  erc721_rw = new ethers.Contract(contractAddress, abi, signer);
  erc721_rw.on("Transfer", (from, to, tokenID) => {
    newNftResult.innerHTML = 'Получен токен NFT с идентификатором: '
      + tokenID + '<br>Аккаунт: ' + to;
    newNftResult.style.color='green';
  });
  ethereum.on('accountsChanged', function (accounts) {
    window.location.reload();
  });
  ethereumButton.addEventListener('click', () => {
    getAccount();
  });
  newNftButton.addEventListener('click', () => {
    newNft();
  });
  tokenIDButton.addEventListener('click', () => {
    getTokenInfo();
  });
  approveButton.addEventListener('click', () => {
    approveAccount();
  });
  sendDrNftButton.addEventListener('click', () => {
    sendTokens();
  });
}

async function approveAccount() {
  try
  {
    approveResult.innerHTML = 'Отправляем транзакцию...';
    approveResult.style.color='green';
    let tokenID = document.getElementById('tokenIdApprove').value;
    let approveToAddr = document.getElementById('approveToAddr').value;
    let tx = await erc721_rw.approve(approveToAddr, tokenID);
    await tx.wait();
    let addr = await erc721_rw.getApproved(tokenID);
    approveResult.innerHTML = 'Разрешено передать токен: ' + tokenID + ' на адрес: ' + addr;
    approveResult.style.color='green';
  }
  catch(error) {
    console.log("Error approveAccount");
    console.log(error);
    approveResult.innerHTML = 'Адрес: ' + address + ', URI: ' + uri + '<br>Произошла ошибка: ' + error.message;
    approveResult.style.color='red';
  }
}

async function newNft() {
  try
  {
    newNftResult.innerHTML = 'Отправляем транзакцию mint...';
    newNftResult.style.color='green';
    let address = document.getElementById('address').value;
    let uri = document.getElementById('uri').value;
    let tx = await erc721_rw.mint(address, uri);
    await tx.wait();
  }
  catch(error) {
    console.log("Error newNft");
    console.log(error);
    newNftResult.innerHTML = 'Адрес: ' + address + ', URI: ' + uri + '<br>Произошла ошибка: ' + error.message;
    newNftResult.style.color='red';
  }
}

async function getTokenInfo() {
  try {
    const idToken = document.getElementById('tokenID').value;
    erc721 = new ethers.Contract(contractAddress, abi, provider);
    erc721_rw = new ethers.Contract(contractAddress, abi, signer);
    let tokenOwner=await erc721.ownerOf(idToken);
    let tokenURI=await erc721.tokenURI(idToken);
    tokenIDResult.innerHTML = 'Владелец: ' + tokenOwner +
      '<br>URI: ' + tokenURI;
    tokenIDResult.style.color='green';
  }
  catch(error) {
    console.log("Error getTokenInfo");
    console.log(error);
    tokenIDResult.innerHTML = 'Произошла ошибка: ' + error.message;
    tokenIDResult.style.color='red';
  }
}

async function getAccount() {
  let chainId;
  let netName;
  let netColor;
  let drcoinBalance;
  try {
    erc721 = new ethers.Contract(contractAddress, abi, provider);
    erc721_rw = new ethers.Contract(contractAddress, abi, signer);
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    showAccount.innerHTML = 'Ваш аккаунт: ' + accounts[0];
    chainId = await ethereum.request({ method: 'eth_chainId' });
    if(chainId == '0x4') {
      netName = 'Rinkeby testnet';
      netColor = "#821010";
    }
    else if (chainId == '0x1') {
      netName ='Ethereum Mainnet';
      netColor = "green";
    }
    else if (chainId == '0x3') {
      netName = 'Ropsten testnet';
      netColor = "#c40e51";
    }
    else {
      netName = 'Other';
      netColor = "blue";
    }
    let drNftBalance=await erc721.balanceOf(accounts[0]);
    let tokenOwner=await erc721.tokenURI(10);
    let netInfo = 'Chain ID: ' + chainId + ' ---> ' + netName +
    '<br>Баланс аккаунта: ' + drNftBalance + ' токенов DRNFT';
    playArea.style.display = 'block';
    chainID.innerHTML = netInfo;
    chainID.style.color=netColor;
  }
  catch(error) {
    console.log("Error getAccount");
    console.log(error);
    chainID.innerHTML = 'Chain ID: ' + chainId + '<br>Произошла ошибка: ' + error.message;
    chainID.style.color='red';
  }
}

async function sendTokens() {
  try
  {
    sendDrNftResult.innerHTML = 'Отправляем транзакцию safeTransferFrom...';
    sendDrNftResult.style.color='green';
    const toAddress = document.getElementById('sendToAddr').value;
    const tokenId = document.getElementById('tokenId2').value;
    let tx1 = await erc721_rw.safeTransferFrom(signer.getAddress(), toAddress, tokenId);
    await tx1.wait();
    let tokenOwner=await erc721.ownerOf(tokenId);
    let tokenURI=await erc721.tokenURI(tokenId);
    sendDrNftResult.innerHTML = 'Аккаунт: ' + tokenOwner +
      ' получил токен: ' + tokenId + '<br>URI: ' + tokenURI;
    sendDrNftResult.style.color='green';
  }
  catch(error) {
    console.log(error);
    sendDrNftResult.innerHTML = 'Ошибка. Код: ' + error.code + '. ' + error.message;;
    sendDrNftResult.style.color='red';
  }
}



