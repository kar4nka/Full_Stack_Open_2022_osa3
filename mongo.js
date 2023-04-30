const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.jp3a8jm.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', noteSchema)


if(process.argv.length>3){
  const person = new Person({
    name: name,
    number: number,
  })
  
  person.save().then(result => {
    console.log('saved!')
    mongoose.connection.close()
  })
}else{
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}



