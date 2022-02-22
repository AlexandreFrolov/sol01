import fetch from 'node-fetch';

var req = {
    account: "0x2b4218Cc6D8fd1691395DC5223E201a56BbEc512"
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
  }
);


