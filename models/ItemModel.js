import mongoose from 'mongoose'
  
// To make your own Schema, check the documentation Here:
// https://mongoosejs.com/docs/guide.html#definition
// You can also try a Schema Generator like this one:
// https://bender.sheridanc.on.ca/system-design/schema-generator 

const schema = new mongoose.Schema({ 
  "program": { "type": "String", required: true },
  "year": { "type": "String",required: true },
  "workTitle": { "type": "String", required: true },
  "studentName": { "type": "String" },
  "fileName": { "type": "String" }
  
}) 

const Item = mongoose.model('Items', schema);
  

export { Item };