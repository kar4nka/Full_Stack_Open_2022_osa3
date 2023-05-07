const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const Schema = new mongoose.Schema({
  name: String,
  number: String
}, { versionKey: false })

// Duplicate the ID field.
Schema.virtual('id').get(function(){
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
Schema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id
    delete ret.__v
  }
});


module.exports = mongoose.model('Person', Schema)