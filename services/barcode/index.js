module.exports = async (req, res) => {
    try{
        let core = require('../../core')
        let content = req.body.content;
        let returnData = {};
        
        if(!content){
            returnData = core.internalCodes.getCodeObject("BARCODE0001");
        }

        if(content){
            returnData = await generateBarCode(content);
        }

        res.send(returnData)
    } catch(e){
        res.send({
            error: e.message
        });
    }
}

async function generateBarCode(content){
    return new Promise((resolve, reject) => {
        try{
            var JsBarcode = require('jsbarcode');
 
            // Canvas v2
            var { createCanvas } = require("canvas");
            
            // Canvas v2
            var canvas = createCanvas();
            
            JsBarcode(canvas, content);
            resolve({
                base64Image: canvas.toDataURL()
            })
        } catch(e){
            reject(e.message);
        }
    });
}