module.exports = async (req, res) => {
    let core = require('../../core')
    let content = req.body.content;
    let returnData = {};
    
    if(!content){
        returnData = core.internalCodes.getCodeObject("QRCODE0001");
    }

    if(content){
        returnData = await generateJSONFromSheet(content);
    }

    res.send(returnData)
}

async function generateJSONFromSheet(content){
    return new Promise((resolve, reject) => {
        try {
            var XLSX = require('xlsx')
            var workbook = XLSX.read(content.split('data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,')[1], {type:'base64'});
            var sheet_name_list = workbook.SheetNames;
            var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
            
            resolve({
                sheetData: xlData
            })
        } catch(e) {
            reject({
                error: e
            })
        }
    });
}