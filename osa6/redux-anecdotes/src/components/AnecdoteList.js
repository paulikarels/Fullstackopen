import { useSelector, useDispatch } from 'react-redux'
import { voteHandler  } from '../reducers/anecdoteReducer'
import { notificationWithTimeout } from '../reducers/notificationReducer'

const AcecdotesList = () => {
	
	const dispatch = useDispatch()

	const anecdotes = useSelector(({ filter, anecdotes }) => {
    return  anecdotes.filter(test => test.content.toLowerCase().includes(filter.toLowerCase()))
  })

	const handleVote =  (anecdote) => {
		//const updatedAnecdote =  anecdoteService.update(anecdote)
		dispatch(voteHandler(anecdote))
		dispatch(notificationWithTimeout(`You voted '${anecdote.content}'`))
	} 

	//const anecdotes = useSelector(state => state.anecdotes)
	return (
		<div>  
			{anecdotes
				.sort((a,b) => b.votes -  a.votes )
				.map(anecdote =>
					<div key={anecdote.id}>
						<div>
						{anecdote.content}
						</div>
						<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote)}>vote</button>
						</div>
					</div>
					)}
		</div>
	)
}

export default AcecdotesList