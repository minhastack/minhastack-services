module.exports = async (req, res) => {
    let services = require('../../services')
    let content = req.body.content;
    let returnData = {};
    
    if(!content){
        returnData = services.internalCodes.getCodeObject("QRCODE0001");
    }

    if(content){
        returnData = await generateQrCode(content);
    }

    res.send(returnData)
}

async function generateQrCode(content){
    return new Promise((resolve, reject) => {
        var QRCode = require('qrcode')
        QRCode.toDataURL(content, function (err, url) {
            if(url){
                resolve({
                    base64Image: url
                })
            } else if(err) {
                reject({
                    error: err
                })
            }
        })
    });
}