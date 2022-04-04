module.exports = async (req, res) => {
    try{
        let services = require('../../services')
        let selectedField = req.body.selectedField;
        let allData = req.body.allData;
        let returnData = {};
        
        if(!selectedField){
            returnData = services.internalCodes.getCodeObject("QRCODE0001");
        }
        
        if(!allData){
            returnData = services.internalCodes.getCodeObject("QRCODE0001");
        }

        if(selectedField && allData){
            returnData = await generateNewRows({
                selectedField,
                allData
            });
        }

        res.send(returnData)
    } catch(e){
        res.send({
            error: e
        });
    }
}

async function generateNewRows({selectedField, allData}){
    return new Promise((resolve, reject) => {
        try {
            const brain = require('brain.js');

            let samples = [];
            let allSamplesData = [];
            let allRunData = [];
            let element = [];
            let fieldDataLength = allData.filter((dataElement) => {
                let isValid = selectedField in dataElement && !isNaN(Number(dataElement[selectedField]));
                
                if(isValid){
                    element.push(dataElement[selectedField]);
                    allSamplesData.push(dataElement[selectedField]);

                    if(element.length == 2) {
                        samples.push(element);
                        element = [];
                    }
                }

                return isValid;
            }).length;

            let basePeriod = 15;
            let period = fieldDataLength > basePeriod ? ((fieldDataLength % basePeriod) || basePeriod) : fieldDataLength;
            
            let runSamples = [];
            for(let itemKey = (allSamplesData.length % 2); itemKey < period; itemKey += 2){
                runSamples.push([
                    allSamplesData[allSamplesData.length - (period - itemKey)],
                    allSamplesData[allSamplesData.length - (period - itemKey - 1)]
                ]);

                allRunData.push(allSamplesData[allSamplesData.length - (period - itemKey)]);
                allRunData.push(allSamplesData[allSamplesData.length - (period - itemKey - 1)]);
            }

            const net = new brain.recurrent.LSTMTimeStep({
                inputSize: 2,
                hiddenLayers: [10],
                outputSize: 2
            });

            net.train(samples);
            
            console.log({
                samples,
                runSamples
            })

            let tableData = [];
            let runData = runSamples;
            
            for(let i = 0; i < 15; i ++){
                let result = net.run(runData);
                console.log(result);
                tableData.push(result[1]);

                samples.splice(0,1);
                samples.push([result[0], result[1]]);

                runData.push([result[0], result[1]]);
                net.train(samples);
            }
            
            resolve({
                tableData
            })
        } catch(e) {
            reject({
                error: e.message
            })
        }
    });
}