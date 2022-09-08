import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const object = { content, id: (100000 * Math.random()).toFixed(0),  votes: 0  }
  const response = await axios.post(baseUrl, object)
  return response.data
}

const update = async (anecdote) => {
    const { id } = anecdote
    const update = ({...anecdote, votes: anecdote.votes + 1})
    const response = await axios.patch(`${baseUrl}/${id}`, update)
    return response.data
  }

const exportedObject = {
  getAll,
  createNew,
  update
}

export default exportedObject