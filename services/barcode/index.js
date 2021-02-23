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
    return new Promise(async (resolve, reject) => {
        try{
            const svgToImg = require("svg-to-img");
            const JsBarcode = require('jsbarcode');
            const { DOMImplementation, XMLSerializer } = require('xmldom');
            const xmlSerializer = new XMLSerializer();
            const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
             
            JsBarcode(svgNode, content, {
                xmlDocument: document,
            });

            const svgText = xmlSerializer.serializeToString(svgNode);
            const pngBase64 = await svgToImg.from(svgText).toJpeg({ encoding: "base64" })

            resolve({
                base64Image: pngBase64
            })
        } catch(e){
            console.log(e.message)
            reject(e.message);
        }
    });
}