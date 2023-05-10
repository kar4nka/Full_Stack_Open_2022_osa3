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
  .catch(error => next(error))
})

app.get('/api/persons/:id', (request,response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.get('/info', (request,response) => {
  Person.countDocuments({})
  .then(result => (
    response.send(`
    <p>Phonebook has info for ${result} people</p>
    <p>${Date()}</p>
    `))
  )
})


app.delete('/api/persons/:id', (request,response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
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
    console.log('person saved!')
    response.json(person)
  })  
  .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true, runValidators: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


/* Error handling */
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)




const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
