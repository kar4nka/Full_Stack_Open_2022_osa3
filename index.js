const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
morgan.token('postobject', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postobject'))

app.get('/api/persons/', (request,response) => {
  Person.find({}).then(result => {
    response.json(result)
  })
})


app.get('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => id === person.id)

  if(person){
    response.json(person)
  }else{
    response.status(404).end()
  }
})


app.get('/info', (request,response) => {
  response.send(`
  <p>Phonebook has info for ${persons.length} people</p>
  <p>${Date()}</p>
  `)
})


app.delete('/api/persons/:id', (request,response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }/*else if (persons.filter(person => person.name === body.name).length > 0){
    return response.status(400).json({
      error: 'name must be unique'
    })
  } "Tässä vaiheessa voit olla välittämättä siitä, onko tietokannassa jo henkilöä, jolla on sama nimi kuin lisättävällä (Mongodb tehtävä)*/

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(result => {
    console.log('note saved!')
  })  
  response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
