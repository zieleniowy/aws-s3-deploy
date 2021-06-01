const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const getFiles = require('./getFilesRecusive');
const fs = require('fs');

const localDir = process.argv[2];
const bucketName = process.argv[3];



const provider = defaultProvider({
    configFilepath: './aws.config.json'
});

const client = new S3Client({ credentialDefaultProvider: provider });
  
const run = async () => {
    console.log('Files are about to upload into AWS S3');
    for await (const f of getFiles('./out')) {
        client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: f.slice(f.match('/out/').index+5),
            Body: fileStream = fs.createReadStream(f)
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
