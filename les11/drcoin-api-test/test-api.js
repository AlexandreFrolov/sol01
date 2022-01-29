import fetch from 'node-fetch';


// curl -X GET -H "Content-Type:application/json" http://127.0.0.1:3000/totalSupply

var req = {
    account: "0x41402ABbb04Fd1567886765ee6c4B75388cdFfC8"
}

async function main() {

  let response = await fetch('http://127.0.0.1:3000/balanceOf', { method: 'POST', body: JSON.stringify(req), headers: { 'Content-Type': 'application/json' } });
  let data = await response.json();
  console.log(data);

  response = await fetch('http://127.0.0.1:3000/name');
  data = await response.json();
  console.log(data);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


