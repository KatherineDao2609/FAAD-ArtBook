// Express is a framework for building APIs and web apps
// See also: https://expressjs.com/
import express from 'express'  
const app = express()

// CORS middleware add CORS headers to our endpoints 
// This will allow us to use the API on any domain. 
// See also: https://www.npmjs.com/package/cors
// Tell our Express app to add CORS headers
import cors from 'cors'
app.use(cors())

// serve up the frontend (documentation)
app.use(express.static( 'public'))
// Enable express to parse JSON data
app.use(express.json()) 

// Our API is defined in separate modules to keep things tidy.
// Let's import our API endpoints and activate them.
// Note that the '/api' prefix is important here:

// Here are the basic CRUD endpoints 
import { crudEndpoints } from './api/crud.js'
app.use('/api', crudEndpoints)

// Here is an endpoitn for handling file uploads. 
import { uploadEndpoint } from './api/upload.js'
app.use('/api', uploadEndpoint)
 
// Express starts listening   
app.listen(process.env.PORT,() => console.log("Express is Live."))
