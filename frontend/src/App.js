import { useEffect, useState } from 'react'
import personService from './services/persons'
import './index.css'


const Filter = (props) => {
  return(
    <div>filter shown with: <input onChange={props.handleSearchChange} value={props.value}/></div>
  )
}


const AddPerson = (props) => {
  return(
    <form onSubmit={props.handleSubmit}>
    <div>name: <input onChange={props.handleNameChange} value={props.nameValue}/></div>
    <div>number: <input onChange={props.handleNumberChange} value={props.numberValue}/></div>
    <div><button type="submit">add</button></div>
    </form>
  )
}


const ShowPeople = (props) => {
  return (
    <ul>
      {props.personsToShow.map(person => <li key={person.id}> {person.name} {person.number}
        <button onClick={() => {props.handleDelete(person.id, person.name)}}>Delete</button>
        </li>)}
    </ul>
  )
}

const Notification = ({message, messageError}) => {
  const errorStyle = {
    borderColor: 'red',
    color: 'red',
    fontWeight: 'bold',
  }
  if(message === null){
    return null
  }else if(messageError) {
    return(
      <div style={errorStyle} className='notification'>{message}</div>
    )
  }else{
    return(
      <div className='notification'>{message}</div>
    )
  }
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [message, setMessage] = useState(null)
  const [messageError, setMessageError] = useState(false)


  useEffect(() => {
    personService.getAll()
    .then(allPersons => {
      setPersons(allPersons)
      })}
    ,[])

  const handleSubmit = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if(persons.some(person => person.name === newName) /*Update existing person*/
    && window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
      const id = persons.find(person => person.name === newName).id
      personService.updatePerson(id, personObject).then(response => {
        if(response.data === null){
          setMessageError(true)
          setMessage(`${newName} was not found on the server`)
          setTimeout(()=>setMessage(null),3000)
        }else{
          setPersons(persons.map(person => person.id !== id ? person : response.data))
          setMessageError(false)
          setMessage(`Updated ${newName}`)
          setTimeout(()=>setMessage(null),3000)
          setNewName('')
          setNewNumber('')
        }  
      })
    }
    
    else if (persons.some(person => person.name === newName)){ /*Pressed cancel on prompt*/
      return
    }
    
    else{ /*Create new person*/
      personService.createPerson(personObject)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
      })
      .catch(error => {
        setMessageError(true)
        setMessage(`Error: ${error.response.data.error}`)
        setTimeout(()=>setMessage(null),3000)
        return
      })
      setMessageError(false)
      setMessage(`Created ${newName}`)
      setTimeout(()=>setMessage(null),3000)
      setNewName('')
      setNewNumber('')
    }
  }


  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.deletePerson(id)
      .then(setPersons(persons.filter(p => p.id !== id)))
      setMessage(`Deleted ${name}`)
      setTimeout(()=>setMessage(null),3000)
    }
  }


  const handleNameChange = (event) => {
    event.preventDefault()
    setNewName(event.target.value)
  }


  const handleNumberChange = (event) => {
    event.preventDefault()
    setNewNumber(event.target.value)
  }


  const handleSearchChange = (event) => {
    event.preventDefault()
    setNewSearch(event.target.value)
  }


  const personsToShow = newSearch.length===0
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(newSearch.toLowerCase()))


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleSearchChange={handleSearchChange} value={newSearch}/>

      <h2>Add new</h2>
      <Notification message={message} messageError={messageError}/>
      <AddPerson 
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        nameValue={newName}
        numberValue={newNumber}
      />

      <h2>Numbers</h2>
      <ShowPeople personsToShow={personsToShow} setPersons={setPersons} persons={persons} handleDelete={handleDelete}/>
    </div>
  )

}

export default App
