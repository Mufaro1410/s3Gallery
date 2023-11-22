S3Gallery is a simple galley web application that displays images on your S3 bucket.
It allows CRUD (uploading, viewing) operations to the S3 bucket

To install dependencies:
~ npm install

Create S3 bucket from command line with the command below:
Assumption is that you've an aws account and cli configured
~ aws s3 mb s3://$BucketName

Switch off "Block public access" of S3 bucket from management console or
~ aws s3api delete-public-access-block --bucket $BucketName

Create a .env file:
~ BUCKET=$BucketName

To run the application:
~ node server.js $BUCKETNAME
OR
In package.json start script, replace Bucket with your bucket name
~npm run start

Delete S3 bucket from cli:
~ aws s3 rb --force s3://$BucketName