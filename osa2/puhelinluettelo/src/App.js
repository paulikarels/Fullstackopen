import React, { useState, useEffect } from 'react'
import './index.css'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personService from './services/persons'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState('')
  const [newFilter, setFilter] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [ message, setErrorMessage] = useState({ message: null, style: "success"})

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const addToPersons = (event) => {
    event.preventDefault()
    const name_exist = persons.find(etsi => etsi.name === newName)
    if (name_exist) {
      if (name_exist.number !== newNumber) {
        if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
          const changedPerson = {...name_exist, number: newNumber}

          personService
            .update(name_exist.id, changedPerson)
            .then(() => {
              personService
                .getAll()
                .then(response => setPersons(response))
                setNewName('')
                setNumber('')
                setErrorMessage(
                  { message: `${newName} data updated`, style: "success" }
                )
                setTimeout(() => {
                  setErrorMessage({ message: null })
                }, 5000)
            })
            .catch(error => {
              setErrorMessage(
                { message: `Information of ${newName} has already been removed from server.`, style: "error" }
              )
              setTimeout(() => {
                setErrorMessage({ message: null })
              }, 5000)                
            })
        }
      } else {
        window.alert(`${newName} is already added to phonebook`); 
      }
    } else {
      const noteObject = {
        name: newName,
        number: newNumber
      }
      
      personService
        .create(noteObject)
        .then(returnedNote => {
          setPersons(persons.concat(returnedNote))
          setNewName('')
          setNumber('')
          setErrorMessage(
            { message: `Added ${newName}`, style: "success" }
          )
          setTimeout(() => {
            setErrorMessage({ message: null })
          }, 5000)
        }).catch((error) => {

          setErrorMessage(
            { message: error.response.data.error, style: "error" }
          )
          setTimeout(() => {
            setErrorMessage({ message: null })
          }, 5000)    
        })
    }
    
  }

  const doSomethingDeleting = (id, name) => {

    if (window.confirm(`Delete ${name} ?`)) 
      personService
        .deletePerson(id)
        .then(() => {
          personService.getAll().then(response =>
            setPersons(response))
        })
        setErrorMessage(
          { message: `Deleted ${name}`, style: "success" }
        )
        setTimeout(() => {
          setErrorMessage({ message: null })
        }, 5000)
  }

  const handleNameChange = (event) => {setNewName(event.target.value)}

  const handleNumberChange = (event) => {setNumber(event.target.value)}

  const handleFilterChange = (event) => {setFilter(event.target.value)}
  

  const personsToShow = showAll
  ? persons
  : persons.filter(test => test.name.toUpperCase().includes(newFilter.toUpperCase()))
  

  return (
    <div>
        <Notification message={message.message} className={message.style}/>
        <h2>Phonebook</h2>

        <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

        <h3>Add a new</h3>
        <PersonForm 
          addToPersons={addToPersons} newName={newName} handleNameChange={handleNameChange}
          newNumber={newNumber} handleNumberChange={handleNumberChange}
        />

        <h3>Numbers</h3>

        <Persons personsToShow={personsToShow} doSomethingDeleting={doSomethingDeleting} />
    </div>
  )

}

export default App