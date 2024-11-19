// This file defines an express endpoint for uploading an image file.
// it includes a feature for resizing the image to fit a given dimension.
// Uploads are stored in the Replit filesystem (not in the database)
// NOTE: Image Metadata and captions ARE saved in MongoDB but are handled elsewhere

//=============
// CONFIGURATION 
// The uploaded image will be resized to fit the following dimensions
const maxWidth = 800
const maxHeight = 800
// set the folder where uploads will be stored. (e.g. /public/uploads )
// see also: https://nodejs.org/api/path.html#pathjoinpaths
// NOTE: "cwd" stands for "Current Working Directory"
const uploadsFolder =  path.join( process.cwd(), 'public', 'uploads') 

// ====================
// IMPORT LIBRARIES
// Import Express so we can make API endpoints
import express from 'express' 
// activate the express Router
const api = express.Router()  
// Import "busboy" library to  handle our "luggage" e.g. (file uploads)
// https://www.npmjs.com/package/busboy
import busboy from 'busboy'
// Import "sharp" library to resize images
// https://www.npmjs.com/package/sharp
import sharp from 'sharp'
// Import "fs" (filesystem) library to help save/store image files on Replit
import fs from 'fs'
// Import the "path" library to help construct file and folder paths
import path from 'path'

//===================
// FILE UPLOAD (API ENDPOINT)
// listen for a POST request with a file attachment.
// NOTE: the encoding of this request should be "multipart/form-data"
api.post("/upload", async (req, res) => {
  // Check to ensure the uploads folder exists (if not, then create it)
  if (!fs.existsSync(uploadsFolder)) fs.mkdirSync(uploadsFolder, { recursive: true })
  // Setup busboy to handle file uploads; pass along request headers to busboy
  const bb = busboy({ headers: req.headers })
  // the code below runs whenever busboy receives an uploaded file 
  bb.on('file', (name, file, info) => { 
    // Get the original file extension (e.g. .png, .jpg, etc.)
    const fileExt = path.extname(info.filename)
    // Generate a unique numeric file name for the upload. e.g. 1699020244125.jpg
    // NOTE: this is based on the current timestamp and prevents overwriting existing files.
    info.newFileName = new Date().getTime() + fileExt
    // Define a place to store the original image temporarily
    const tempPath = path.join(uploadsFolder, 'temp_' + info.newFileName)
    // Define a destination path for the final resized image
    const destPath = path.join(uploadsFolder, info.newFileName)
    // define a stream to save the uploaded image data to its temporary location
    // https://mdn.io/Streams_API/Concepts
    const stream = fs.createWriteStream(tempPath)
    // when the data stream is finished writing, the "close" event will fire below
    stream.on('close', async () => { 
      // at this point the full resolution image has been saved to a temporary location.
      try {
        // svg files do not need to be resized.
        if (info.mimeType.startsWith("image/svg") ){
          // in this case rename the temporary file to use the destination path.
          await fs.promises.rename(tempPath, destPath) 
        }
        // non vector images should be resized to fit
        else{
          // Resize the temporary image to fit maxWidth and maxHeight
          await sharp(tempPath)
            // to retain metadata,  including rotation info, uncomment the following line. 
            // .withMetadata()
            .resize(maxWidth, maxHeight, {
              fit: "inside",  // preserve aspect ratio
              withoutEnlargement: true  // don't enlarge 
            }) 
            .toFile(destPath) // output the result to the final destination
          // Delete (unlink) the temporary file from the filesystem
          await fs.promises.unlink(tempPath)
        } 
        // Finished! Now send details about the upload back to the frontend.
        res.send(info) 
      } catch (error) {
        // if anything goes wrong, log the issue to the console.
        console.error( error)
        res.status(500).send(error)
      }
    })
    // send the uploaded data to the above stream for saving
    file.pipe(stream)
  }) 
  // send the incoming request to busboy for processing
  req.pipe(bb)
})


// Export the file upload endpoint
// NOTE: see index.js for the corresponding import and activation
export { api as uploadEndpoint }
