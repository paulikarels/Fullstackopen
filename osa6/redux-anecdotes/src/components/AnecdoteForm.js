import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { notificationWithTimeout } from '../reducers/notificationReducer'
import anecdoteService from '../services/anecdotes'
import { connect } from 'react-redux'

const NewAnecdote = () => {
	const dispatch = useDispatch()

	const addAnecdote = async (event) => {
		event.preventDefault()
		const content = event.target.anecdote.value
		event.target.anecdote.value = ''
		const newAnecdote = await anecdoteService.createNew(content)
		dispatch(createAnecdote(newAnecdote))
		dispatch(notificationWithTimeout(`New anecdote added: ${content}`))
	}

	return (
		<div>        
			<h2>create new</h2>
			<form onSubmit={addAnecdote}>
				<div> <input name="anecdote"/>	</div>
				<button type="submit">create</button>
			</form>
		</div>
	)
}

const mapStateToProps = (state) => {
	return {
		anecdotes: state.anecdotes
	}
}

const mapDispatchToProps = {
    NewAnecdote
}

const ConnectedAnecdoteForm = connect(mapStateToProps, mapDispatchToProps)(NewAnecdote)
export default ConnectedAnecdoteForm

