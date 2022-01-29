const ethereumButton = document.querySelector('.enableEthereumButton');
const sendEthButton = document.querySelector('.sendEthButton');
const sendEtherResult = document.querySelector('.sendEtherResult');
const sendDrCoinResult = document.querySelector('.sendDrCoinResult');
const sendDrCoinButton = document.querySelector('.sendDrCoinButton');
const showAccount = document.querySelector('.showAccount');
const chainID = document.querySelector('.chainID');
const toAddrInput = document.querySelector('.toAddr');
const sendToAddrInput = document.querySelector('.sendToAddr');
const amountInput = document.querySelector('.amount');
const amountEtherInput = document.querySelector('.amountEther');
const playArea = document.getElementById('playArea');
playArea.style.display = 'none';

const contractAddress = '0x43bD7A453161071De46EA0E96573C16581CB9FAd';
const account1 = '0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8';
const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint amount)"
];

let provider;
let signer;
let erc20;
let erc20_rw;
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

  erc20 = new ethers.Contract(contractAddress, abi, provider);
  erc20_rw = new ethers.Contract(contractAddress, abi, signer);

  ethereum.on('accountsChanged', function (accounts) {
    window.location.reload();
  });

  ethereumButton.addEventListener('click', () => {
    getAccount();
  });

  sendEthButton.addEventListener('click', () => {
    sendEther();
  });

  sendDrCoinButton.addEventListener('click', () => {
    sendTokens();
  });
}

async function sendEther() {
  sendEtherResult.innerHTML = 'Отправляем транзакцию...';
  sendEtherResult.style.color='green';

  let tEthervalue = document.getElementById('amountEther').value;
  let toAddress = document.getElementById('toAddr').value;

  const txHash = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [
      {
        from: accounts[0],
        to: toAddress,
        value: ethers.utils.hexlify(parseInt(tEthervalue)),
        gasPrice: '0x09184e72a000',
        gas: '0x2710',
      },
    ],
  })
  .then(function(txHash) {
     sendEtherResult.innerHTML = 'Хеш транзакции: ' + txHash + '<br>Ожидайте...';
     awaitTx(txHash);
   })
  .catch((error) => {
    console.error;
    sendEtherResult.innerHTML = 'Ошибка. Код: ' + error.code + '. ' + error.message;
    sendEtherResult.style.color='red';
   });
}

async function awaitTx(txHash) {
  provider.getTransaction(txHash).then(function(transaction) {
    getReceipt(transaction, txHash)
  });
}

async function getReceipt(transaction, txHash) {
  const receipt = await transaction.wait();
  if(receipt.status) {
    sendEtherResult.innerHTML = 'Отправлено ' + transaction.value.toString() + ' Wei<br><br>Отправитель: ' + receipt.from + '<br>Получатель: ' + receipt.from;
    sendEtherResult.style.color='green';
  }
  else {
    sendEtherResult.innerHTML = 'Ошибка при отправке с адреса: ' + receipt.from + ' на адрес: ' + receipt.from;
    sendEtherResult.style.color='red';
  }
}

async function getAccount() {
  let chainId;
  let netName;
  let netColor;
  let drcoinBalance;

  try {
    erc20 = new ethers.Contract(contractAddress, abi, provider);
    erc20_rw = new ethers.Contract(contractAddress, abi, signer);

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
    let balance = await provider.getBalance(accounts[0]);
    let accBalance = ethers.utils.formatEther(balance);

    drcoinBalance=await erc20.balanceOf(accounts[0]);

    let mostRecentlyMinedBlock = await provider.getBlockNumber();
    let gasPrice = await provider.getGasPrice();
    gasPrice = ethers.utils.formatUnits(gasPrice, "gwei");

    let netInfo = 'Chain ID: ' + chainId + ' ---> ' + netName + '<br>Gas Price: ' + gasPrice +
    ' gwei<br>Последний добытый блок: ' + mostRecentlyMinedBlock + '<br><br>Баланс аккаунта в Ether: ' + accBalance + ' Ether';
    if(chainId == '0x4') {
      netInfo = netInfo + '<br>Баланс аккаунта в DRCOIN: ' + drcoinBalance + ' DRCOIN';
    }

    playArea.style.display = 'block';
    chainID.innerHTML = netInfo;
    chainID.style.color=netColor;
  }
  catch(ex) {
    console.log("Error getAccount");
    console.log(error);
    chainID.innerHTML = 'Chain ID: ' + chainId + '<br>Произошла ошибка: ' + error.message;
    chainID.style.color='red';
  }
}

async function sendTokens() {
  try
  {
    const toAddress = document.getElementById('sendToAddr').value;
    const tvalue = document.getElementById('amount').value;

    let trLog='';
    const tokenName=await erc20.name();
    const symbol=await erc20.symbol();
    trLog = trLog + 'Передача токенов ' + tokenName + ' (' + symbol + ')' + '<br><br>Балансы аккаунтов до передачи:<br><br>';

    let balanceOld=await erc20.balanceOf(account1);
    let srcOldBalance=await erc20_rw.balanceOf(signer.getAddress());

    trLog = trLog + 'Отправитель: ' + srcOldBalance.toString() + ' DRCOIN <br>Получатель: ' + balanceOld.toString() + ' DRCOIN';
    sendDrCoinResult.innerHTML = trLog;
    sendDrCoinResult.style.color='green';

    let tx = await erc20_rw.transfer(toAddress, tvalue);
    await tx.wait();

    let srcNewBalance = await erc20_rw.balanceOf(signer.getAddress());
    let dstNewBalance=await erc20.balanceOf(account1);

    trLog = trLog + '<br><br>Балансы аккаунтов после передачи ' + tvalue + ' токенов DRCOIN:<br><br>';
    trLog = trLog + 'Отправитель: ' + srcNewBalance.toString() + ' DRCOIN <br>Получатель: ' + dstNewBalance.toString() + ' DRCOIN';

    sendDrCoinResult.innerHTML = trLog;
    sendDrCoinResult.style.color='green';
  }
  catch(error) {
    console.log(error);
    sendDrCoinResult.innerHTML = 'Ошибка. Код: ' + error.code + '. ' + error.message;;
    sendDrCoinResult.style.color='red';
  }
}



