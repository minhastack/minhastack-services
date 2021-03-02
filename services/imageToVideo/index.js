module.exports = async (req, res) => {
    try{
        let core = require('../../core')
        let content = req.body.content;
        let returnData = {};
        
        if(!content){
            returnData = core.internalCodes.getCodeObject("BARCODE0001");
        }

        if(content){
            returnData = await generateVideo(content);
        }

        res.send(returnData)
    } catch(e){
        res.send({
            error: e.message
        });
    }
}

async function generateVideo(content){
    return new Promise(async (resolve, reject) => {
        try{
            let imagesData = [];
            let uploadedImagesInfo = [];
            content.map(function(contentBase64){
                let uploadedData = uploadBase64Image(contentBase64);
                uploadedImagesInfo.push(uploadedData);
                imagesData.push({
                    path: uploadedData.fileAddress
                });
            })

            const videoshow = require('videoshow');
            
            var videoOptions = {
                fps: 25,
                loop: 5, // seconds
                transition: true,
                transitionDuration: 1, // seconds
                videoBitrate: 1024,
                videoCodec: 'libx264',
                size: '640x?',
                audioBitrate: '128k',
                audioChannels: 2,
                format: 'mp4',
                pixelFormat: 'yuv420p'
            }
            
            let newFileAddress = genereateFileAddress( 'mp4');
            videoshow(imagesData, videoOptions)
            .save(newFileAddress)
            .on('start', function (command) {
                console.log('ffmpeg process started:', command)
            })
            .on('error', function (err, stdout, stderr) {
                console.error('Error:', err)
                console.error('ffmpeg stderr:', stderr)
            })
            .on('end', function (output) {
                console.error('Video created in:', output)
            })
            
            let base64Video = readAsBase64(newFileAddress);
            
            console.log(images);
            console.log(newFileAddress)
            images.map((imageAddress) => {
                removeFile(imageAddress);
            });

            removeFile(newFileAddress);

            resolve({
                base64Video
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
    const mime = require('mime');
    var decodedImg = decodeBase64Image(imgB64Data);
    var imageBuffer = decodedImg.data;
    var type = decodedImg.type;
    var extension = mime.getExtension(type);
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