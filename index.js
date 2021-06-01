#!/usr/bin/env node
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { S3Client, PutObjectCommand, PutObjectAclCommand } = require("@aws-sdk/client-s3");
const getFiles = require('./getFilesRecusive');
const fs = require('fs');
const path = require('path');

const args = Array.from(process.argv.slice(2));
const localDir = args[args.indexOf('--local-dir')+1];
const bucketName = args[args.indexOf('--bucket-name')+1];
const maxAge = args.indexOf('--max-age')!==-1?args[args.indexOf('--max-age')+1]:undefined;

if(!localDir || !bucketName){ throw new Error('required parameters not specified: --local-dir || --bucket-name '); }

const provider = defaultProvider({
    configFilepath: path.join(__dirname, '../../', 'aws.config.json')
});

console.log(path.join(__dirname, '../../'));
const client = new S3Client({ credentialDefaultProvider: provider });
  
const run = async () => {
    console.log('Files are about to upload into AWS S3');
    for await (const f of getFiles(path.join(__dirname, '../../', localDir))) {
        const Key = f.slice(f.match(localDir).index+localDir.length+1);
        client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key,
            Body: fileStream = fs.createReadStream(f),
            ACL: 'public-read',
            CacheControl: maxAge?`max-age=${maxAge}`:undefined

        })).then(()=>{
            process.stdout.clearLine(); 
            process.stdout.cursorTo(0); 
            process.stdout.write(`file: ${f}`);
        });
    }
};

process.on('beforeExit', (code) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0); 
})
run();
