import React from 'react'

const PersonForm = ({addToPersons, newName, handleNameChange, newNumber, handleNumberChange}) => (
    <form onSubmit={addToPersons}>
        <div>  name: <input value={newName} onChange={handleNameChange}/> </div>
        <div>  number: <input value={newNumber} onChange={handleNumberChange}/> </div>
        <div> <button type="submit">add</button> </div>
    </form>
)
    


export default PersonForm