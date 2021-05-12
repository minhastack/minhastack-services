const express = require('express')
const cors = require('cors')

// let REDIS_URL = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
// let workQueue = new Queue('work', REDIS_URL);
// let workers = process.env.WEB_CONCURRENCY || 2;
// let maxJobsPerWorker = 50;

// workQueue.process(maxJobsPerWorker, async (job) => {

// });

const app = express()
const port = process.env.PORT || 21624

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors());

const qrCodeService = require('./services/qrcode');
const barCodeService = require('./services/barcode');
const multidataService = require('./services/multidata');
const mlService = require('./services/ml');
const imageToVideoService = require('./services/imageToVideo');
const pensadorService = require('./services/pensador');

app.get('/', (req, res) => {
  res.send('MinhaStack Services');
});

app.post('/qrcode', qrCodeService);
app.post('/barcode', barCodeService);
app.post('/multidata', multidataService);
app.post('/ml', mlService);
app.post('/imageToVideo', imageToVideoService);
app.get('/pensador', pensadorService);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) 
})