import React, { useState } from 'react'

const Button = ({text, handleClick}) => <button onClick={handleClick}>{text}</button>

const Most = ({votes, anecdotes, selected}) => {

  const max = Math.max(...votes)

  return (
    <div> 
      <h1>Anecdote with most votes</h1>
       {anecdotes[votes.indexOf(max)]} <br></br>
      has {max} votes
    </div> 
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  const n = anecdotes.length

  const [selected, setSelected] = useState(0)
  const [vote, setVotes] = useState(new Uint8Array(n))

  const setToSelected = () => {
    const select = Math.floor(Math.random() * (n-0) + 0)
    setSelected(select)
  }

  const setToVoted = () => {
    const copy = [...vote]

    copy[selected] += 1
    setVotes(copy)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]} <br/>
      has {vote[selected]} votes  <br/>
      <Button text={"vote"} handleClick={() => setToVoted()}/>
      <Button text={"next anecdote"} handleClick={() => setToSelected()}/>
      <Most votes={vote} anecdotes={anecdotes} selected={selected}/>
    </div>
  )
}

export default App
