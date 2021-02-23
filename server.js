const express = require('express')
const cors = require('cors')

const app = express()
const port = 21624

app.use(express.json());
app.use(cors());

const qrCodeService = require('./services/qrcode');
const barCodeService = require('./services/barcode');

app.get('/', (req, res) => {
  res.send('MinhaStack Services');
});

app.post('/qrcode', qrCodeService);
app.post('/barcode', barCodeService);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) 
})