const express = require('express');
const AWS = require('aws-sdk');
const mu = require('mu2-updated');
const uuid = require('uuid');
const multiparty = require('multiparty');
const dotenv = require('dotenv')

dotenv.config()

const app = express()
const s3 = new AWS.S3({
    'region': 'us-east-1'
})

const bucket = process.env.BUCKET
if (!bucket) {
    console.error('Missing S3 bucket.');
    process.exit()
}

// const bucket = process.argv[2]
// if (!bucket || bucket.length < 1) {
//     console.error('Missing S3 bucket. Start with node server.js BUCKETNAME instead.');
//     process.exit()
// }

async function listImages(response) {
    try {
        let data = await s3.listObjects({Bucket: bucket}).promise()
        let stream = mu.compileAndRender(
            'index.html',
            {
                Objects: data.Contents,
                Bucket: bucket
            }
        )
        stream.pipe(response)
    } catch (error) {
        console.error(error);
        response.status(500);
        response.send('Internal server error.');
    }
}

async function uploadImage(image, response) {
    try {
        await s3.putObject({
            Body: image,
            Bucket: bucket,
            Key: uuid.v4(),
            ACL: 'public-read',
            ContentLength: image.byteCount,
            ContentType: image.headers['content-type']
        }).promise()
        response.redirect('/')
    } catch (error) {
        console.error(error);
        response.status(500);
        response.send('Internal server error.');
    }
}

app.get('/', async (request, response) => {
    // console.log(response);
    await listImages(response)
})

app.post('/upload', async (request, response) => {
    let form = new multiparty.Form()
    form.on('part', async (part) => {
        await uploadImage(part, response)
    })
    form.parse(request)
})

const port = process.env.PORT || 8080

app.listen(port, () => console.log('Server started. Open http://localhost:8080 with browser.'))