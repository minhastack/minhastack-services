const express = require('express')
const app = express()
const port = 21624

app.use(express.json());

const qrCodeService = require('./services/qrcode');

app.get('/', (req, res) => {
  res.send('MinhaStack Services');
});

app.post('/qrcode', qrCodeService);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) 
})