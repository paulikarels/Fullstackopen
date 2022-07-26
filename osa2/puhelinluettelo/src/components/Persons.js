import React from 'react'

const Persons = ({personsToShow, doSomethingDeleting}) => (
    <div> 
        {personsToShow.map(note =>
        <div key={note.name}> 
          {note.name} {note.number} <button onClick={() => doSomethingDeleting(note.id, note.name)}>delete</button>
        </div> 
      )}
    </div>
)

export default Persons