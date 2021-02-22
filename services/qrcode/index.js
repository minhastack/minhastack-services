module.exports = async (req, res) => {
    let core = require('../../core')
    let content = req.body.content;
    let returnData = {};
    
    if(!content){
        returnData = core.internalCodes.getCodeObject("QRCODE0001");
    }

    if(content){
        returnData = await generateQrCode(content);
    }

    res.send(returnData)
}

async function generateQrCode(content){
    return new Promise((resolve, reject) => {
        var QRCode = require('qrcode')
        QRCode.toDataURL('I am a pony!', function (err, url) {
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