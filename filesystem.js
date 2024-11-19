// This module defines and exports "deleteFile" a function to delete a file.
// When deleting items from Mongo, we may also need to delete a corresponding image file from the disk.

// Import "fs" (filesystem) library 
import fs from 'fs'
// Import the "path" library to help construct file and folder paths
import path from 'path'

// DELETE FILE 
// given the full path to a file, (e.g. an uploaded image file)
// delete the file from the filesystem. 
const deleteFile = async (fileName) => {  
  // Adjust the fileName to points to the full path of the file 
  // (e.g. in the uploads folder)
  // the result is something  like ""/public/uploads/1699046915848.jpg"
  fileName = path.join(process.cwd(), 'public', 'uploads', fileName)  
  // First check if the file exists by getting "statistics" from it
  try{   
    await fs.promises.stat(fileName)  
  }
  // if the file does not exist, let the user know
  catch (e){    
    return 'File does not exist.' 
  }  
  // Now try to delete (unlink) the file
  try{
    await fs.promises.unlink(fileName) 
    return 'File deleted.'
  }
  // if the delete process failed, let the user know
  catch (e){  
    console.log(e) 
    return 'Unable to delete file.' 
  }   
}

export { deleteFile }