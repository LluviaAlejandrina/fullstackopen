import { useEffect, useState } from 'react'
import axios from 'axios'
import personsService from './services/persons'
import Notification from './components/Notification'

const Person = ({name,number,deleteEvent}) => {

return (
  <li>
    {name} {number}  <button onClick={deleteEvent}>delete</button>
  </li>

)

}

const Filter = ({filteredName, handleFilter}) =>{
  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with: <input value={filteredName} onChange={handleFilter}/></div>
    </div>

  )
}
const AddContact =({newName,newNumber,handleInputName,handleInputNumber,addName}) =>{
  return (
    <div>
      <h2>New contact</h2>
      <form onSubmit={addName}>
        <div>name: <input value={newName} onChange ={handleInputName}/></div>
        <div>number: <input value={newNumber} type="text" onChange={handleInputNumber} /></div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>

  )
}

const List = ({contactsToShow,deleteEvent}) => {
  return (
    <div>
      <h2>Numbers</h2>
      <ul>
        {contactsToShow.map( person => <Person key= {person.id} name = {person.name} number={person.number} deleteEvent={ ()=> deleteEvent(person.id)} />)}
      </ul>

    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filteredName, setFilteredname] = useState('')
  const [ notification, setNotification] = useState(null)

  useEffect(()=> {
    console.log('effect here!')
    personsService
    .getAll()
    .then(initialList => {
      setPersons(initialList)
    })
  },[])

  const addName = (event) => {
    event.preventDefault()
    console.log(event)
     // check if array contains name
    if (persons.some(person=> person.name.toLowerCase() === newName.toLowerCase())){
      //  display warning
      console.log( 'exists!')
       if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        //get id and new obj
        const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
        console.log(person)
        const updatedPerson = {...person, number: newNumber}
        console.log(person.id)
        personsService.update(person.id,updatedPerson )
        .then(updatedObjPerson => {
          setPersons(persons.map( person => person.id === updatedObjPerson.id ? updatedObjPerson : person))
          setNotification({
            message: `Updated ${updatedObjPerson.name}'s number`,
            type: 'success'
          })
          setTimeout(()=> setNotification(null), 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch (error => {
          setNotification({
            message: `${updatedPerson.name} was already removed from server!`,
            type: 'success'
          })
          setTimeout(()=> setNotification(null), 5000)
          setPersons(persons.filter(person => person.id !== updatedPerson.id))

        })
      }

    } else {
      const personObj = {
      name : newName,
      number: newNumber
    }

    personsService
    .create(personObj)
    .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))

      setNotification({
       message: `Added ${returnedPerson.name} successfully`,
        type: 'success'
      })
      setTimeout(() => setNotification(null), 5000)

      setNewName('')
      setNewNumber('')
    })
    .catch(error=> {
      // this is the way to access the error message
      console.log(error.response.data.error)
      setNotification({
        message: error.response.data.error,
        type: 'error'
      })
          setTimeout(()=> setNotification(null), 5000)
    })

    }
  }

  const deleteName = (id) => {
    const person = persons.find(person => person.id === id)

    if (window.confirm(`delete ${person.name}?`)) {
      personsService
      .deletePerson(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
    }

  }

  const handleInputName = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)

  }
  const handleInputNumber =(event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    setFilteredname(event.target.value)
  }

  const contactsToShow = filteredName === ''
  ? persons
  : persons.filter(person => person.name.toLowerCase().includes(filteredName.toLowerCase()))
  //If input is empty → show all, If input has text → filter automatically
  //the input value itself controls what is shown.You don’t need a second boolean state.

  return (
    <div>
      <Notification message={notification}  />
      <Filter filteredName={filteredName} handleFilter={handleFilter} />
      <AddContact
      newName={newName} handleInputName={handleInputName}
      newNumber={newNumber} handleInputNumber={handleInputNumber}
      addName={addName}
      />
      <List  contactsToShow={contactsToShow} deleteEvent={deleteName}/>
    </div>
  )
}

export default App
