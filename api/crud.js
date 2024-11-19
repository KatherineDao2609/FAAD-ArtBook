// This module defines a set of CRUD endpoints for Items
// NOTE: image file uploads are handled separately.


import {mongoReady} from '../database.js'

// Import the Item schema
import {Item} from "../models/ItemModel.js"  

// Import Express so we can make API endpoints
import express from 'express' 
// active the express Router
const api = express.Router()   

// Import filesystem functionality for use in the DELETE endpoint
import {deleteFile} from "../filesystem.js"  

// CREATE ITEM (ENDPOINT)
// this endpoint looks for JSON data in the body of the request and saves a new item to MongoDB
api.post('/item', mongoReady, async (req, res) => { 
  console.log()
  try{
    delete req.body._id // don't include the _id on a new item (Mongo will create it automatically)
    const item = await Item.create(req.body)
    res.send(item) 
  }
  catch(err){
    res.status(500).send(err)
  }
})


// READ ITEMS (ENDPOINT)
api.get('/items', mongoReady, async (req, res) => {  
  try{
    // a empty filter means "find everything"
    let filter = {}   
    // let's adjust sorting based on user input.
    let sort = {} 
    if (req.query.sort == "birthDate"){
      sort.birthDate = "ascending"
    }
    if (req.query.sort == "name"){
      sort.name = "descending"
    } 
    const items = await Item.find(filter).sort(sort)  
    res.send(items)
  }
  catch(err){
    res.status(500).send(err)
  } 
})


// READ SINGLE ITEM (ENDPOINT)  
api.get('/item/:id', mongoReady, async (req, res) => {  
  try{
    const filter = {_id: req.params.id}
    const item = await Item.findOne(filter)  
    res.send(item)
  }
  catch(err){
    res.status(500).send(err)
  } 
}) 

//UPDATE ITEM (ENDPOINT)
api.put('/item/:id', mongoReady, async (req, res) => {    
  try{
    const filter = {_id: req.params.id}
    const update = req.body
    const options = {returnDocument :'after'}   // default is 'before'   
    const item = await Item.findOneAndReplace(filter, update, options) 
    res.send(item)
  }
  catch(err){
    res.status(500).send(err)
  } 
}) 

// DELETE ITEM (ENDPOINT)
api.delete('/item/:id', mongoReady, async (req, res) => {
  try{
    const filter = {_id:req.params.id} 
    // remove item from database
    const item = await Item.findOneAndDelete(filter)  
    // delete corresponding image from filesystem
    const status = (item.fileName) ? 
      await deleteFile(item.fileName) : 
      "Item has no fileName. Delete operation has been skipped."
    res.send({status})   
  }
  catch(err){  
    console.log(err)
    res.status(500).send(err) 
  }
})


export { api as crudEndpoints }

 