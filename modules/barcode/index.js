module.exports = async (req, res) => {
    try{
        let services = require('../../services')
        let content = req.body.content;
        let returnData = {};
        
        if(!content){
            returnData = services.internalCodes.getCodeObject("BARCODE0001");
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
            const JsBarcode = require('jsbarcode');
            const { DOMImplementation, XMLSerializer } = require('xmldom');
            const xmlSerializer = new XMLSerializer();
            const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
             
            JsBarcode(svgNode, content, {
                xmlDocument: document,
            });

            const svgText = xmlSerializer.serializeToString(svgNode);
            const svg64 = encodeURIComponent(svgText);
            const b64Start = 'data:image/svg+xml;charset=utf-8,';
            const b64 = b64Start + svg64;
            
            resolve({
                base64Image: b64
            })
        } catch(e){
            console.log(e.message)
            reject(e.message);
        }
    });
}