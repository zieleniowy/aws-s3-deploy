# s3-deploy-script
This module was developed to fasten deployment of static hosted websites into amazon s3 buckets.

## install

`
npm install s3-deploy-script --save-dev
`

Make sure you add --save-dev switch to prevent this module from being loaded into production. It'd be just a waste of resources.

## settings




First of all you need to add this module as a script into your **package.json**.
`
...
"scripts": {
    ...
    "deploy": "s3-deploy  --local-dir /public --bucket-name next-aws-deploy --max-age 86400
    ...
}
...
`

(you can name it "deploy" as shown in the example or give it any other name you want)
There are 3 switches:  
- **--local-dir** - REQUIRED - directory path in which are your build files located (typically: "/public" or "/out")
- **--bucket-name** - REQUIRED - name of your s3 bucket into which you want to upload your files
- **--max-age** - OPTIONAL - max-age setting of Cache-Control header of your files. (how many seconds your files can be stored at the cache). Althought it's not necessery, it's strongly recommended to set this for performance reason. 

Then you need to create a file called **aws.config.json**
{ "accessKeyId": "YOUR_USER_ACCESS_KEY", "secretAccessKey": "YOUR_USER_SECRET_ACCESS_KEY", "region": "YOUR_S3_BUCKET_REGION" }
this is file you may be familiar with because this json schema is fetched from aws documentation.

### warning
Keep in mind you need to set appropriate privileges for user whose accesskeys you're filling in **aws.config.json** to manage
a s3 bucket you're provided in **package.json**. To manage users and roles type IAM in aws page search bar.



## usage
If you well configured your **package.json** and **aws.config.json** files you can simply execute **npm deploy** in your terminal.
