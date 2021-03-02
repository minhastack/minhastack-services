module.exports = async (req, res) => {
    try{
        let core = require('../../core')
        let content = req.body.content;
        let audio = req.body.audio || [];
        let imageTimeOnScreen = req.body.imageTimeOnScreen || 5;
        let returnData = {};
        
        if(!content){
            returnData = core.internalCodes.getCodeObject("BARCODE0001");
        }

        if(content){
            returnData = await generateVideo(content, audio, imageTimeOnScreen);
        }

        res.send(returnData)
    } catch(e){
        res.send({
            error: e.message
        });
    }
}

async function generateVideo(content, audio=[], imageTimeOnScreen=5){
    return new Promise(async (resolve, reject) => {
        try{
            let imagesData = [];
            let audioData = [];
            let uploadedImagesInfo = [];
            let uploadedAudioData = [];
            content.map(function(contentBase64){
                let uploadedData = uploadBase64Image(contentBase64);
                uploadedImagesInfo.push(uploadedData);
                console.log(`New image: ${uploadedData.fileAddress}`);

                imagesData.push({
                    path: uploadedData.fileAddress
                });
            })
            
            audio.map(function(contentBase64){
                let uploadedData = uploadBase64Image(contentBase64);
                uploadedAudioData.push(uploadedData);
                console.log(`New audio: ${uploadedData.fileAddress}`);
                audioData.push(uploadedData.fileAddress);
            })

            const videoshow = require('videoshow');
            
            var videoOptions = {
                fps: 12,
                loop: imageTimeOnScreen, // seconds
                transition: true,
                transitionDuration: 1, // seconds
                videoBitrate: 512,
                videoCodec: 'libx265',
                size: '640x?',
                audioBitrate: '128k',
                audioChannels: 2,
                outputOptions: '-crf 28',
                format: 'mp4'
            }
            
            let newFileAddress = genereateFileAddress( 'mp4');
            let videoShowElement = videoshow(imagesData, videoOptions);

            if(audioData.length > 0){
                videoShowElement.audio(audioData[0])
            }

            videoShowElement
            .save(newFileAddress.fileAddress)
            .on('start', function (command) {
                console.log('ffmpeg process started:', command)
            })
            .on('error', function (err, stdout, stderr) {
                console.error('Error:', err)
                console.error('ffmpeg stderr:', stderr)
                throw new Error(stderr);
            })
            .on('end', function (output) {
                console.error('Video created in:', output)
                
                let base64Video = readAsBase64(output);
                
                imagesData.map((imageAddress) => {
                    removeFile(imageAddress.path);
                });
                
                audioData.map((audioAddress) => {
                    removeFile(audioAddress);
                });

                removeFile(output);
                
                resolve({
                    base64Video
                })
            })
            
        } catch(e){
            console.log(e.message)
            reject(e.message);
        }
    });
}

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
  
    return response;
}

let uploadBase64Image = function(imgB64Data){
    const mime = require('mime-types');
    var decodedImg = decodeBase64Image(imgB64Data);
    var imageBuffer = decodedImg.data;
    var type = decodedImg.type;
    var extension = mime.extension(type);
    const {fileAddress, fileName } = genereateFileAddress(extension);

    try{
        fs.writeFileSync(fileAddress, imageBuffer, 'utf8');
    } catch(err){
        console.error(err)
    }

    return {
        fileName,
        type,
        extension,
        fileAddress
    }
}

let genereateFileAddress = (extension) => {
    const { v4 } = require('uuid');
    var fileName = v4() + "." + extension;
    let fileAddress = __dirname + "/tmp/uploads/" + fileName;
    return {fileAddress, fileName};
}

const fs = require('fs');
let readAsBase64 = (address) => {
    const contents = fs.readFileSync(address, {encoding: 'base64'});
    return contents;
}

let removeFile = (address) => {
    return fs.unlinkSync(address);
}