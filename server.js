const express = require('express')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 21624

app.use(express.json());
app.use(cors());

const qrCodeService = require('./services/qrcode');
const barCodeService = require('./services/barcode');
const multidataService = require('./services/multidata');
const mlService = require('./services/ml');
const imageToVideoService = require('./services/imageToVideo');

app.get('/', (req, res) => {
  res.send('MinhaStack Services');
});

app.post('/qrcode', qrCodeService);
app.post('/barcode', barCodeService);
app.post('/multidata', multidataService);
app.post('/ml', mlService);
app.post('/imageToVideo', imageToVideoService);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) 
})