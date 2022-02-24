import * as fs from 'fs';
import * as path from 'path';
import { create, globSource } from 'ipfs-http-client'

const ipfs = create('http://192.168.0.71:5001');

const addFile = async (fileName, filePath) => {
  const file = fs.readFileSync(filePath);
  const filesAdded = await ipfs.add(
    {
      path: fileName, content: file
    },
    {
      progress: (len) => console.log("Загрузка файла в IPFS..." + len)
    });
  return filesAdded;
};

const addFolder = async (folderName) => {
  for await (const file of ipfs.addAll(globSource(folderName, '**/*'))) {
    console.log(file)
  }
};

const { cid } = await ipfs.add('Hello, IPFS world!')
console.log('Hello, IPFS world!');
console.log(cid);

const fSnailJson='/home/developer/sol01/les14/snail.json';
const fSnailJpg='/home/developer/sol01/les14/snail.jpg';
const fDir='/home/developer/sol01/les14/images';

const fileHash = await addFile("snail.json", fSnailJson);
console.log(fileHash);
const fileHash1 = await addFile("snail.jpg", fSnailJpg);
console.log(fileHash1);
await addFolder(fDir);

const rmFile = async(path) => {
  fs.access(path, fs.F_OK, (err) => {
    if (err == null) {
      fs.unlink(path, (err) => {
        if (err) console.log(err);
        else console.log("Удален файл: " + path);
      });
    }
  })
};

const getFile = async(cid, path) => {
  await rmFile(path);
  const stream = ipfs.cat(cid)
  let data = ''
  for await (const chunk of stream) {
    await fs.appendFileSync(path, chunk, function(error){
       if(error) throw error;
    });
  }
  console.log("Прочитан файл: " + cid + ", записан в файл: " + path);
};

await getFile('QmXV2CC8e5iFDX8dwNWj9Lkde2Hb7S3ZAgXQFJtw4DcxLS', "snail-1.json");
await getFile('Qmb6197JpQD4vX1Zbs9qN1Zazzv2dXizHZ5MhxyahDZh43', "20180610_104610-1.jpg");
