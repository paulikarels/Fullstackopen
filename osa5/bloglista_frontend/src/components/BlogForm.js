import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const handleTitleChange = (event) => {
    setTitle(event.target.value)
  }
  const handleAuthorChange = (event) => {
    setAuthor(event.target.value)
  }
  const handleUrlChange = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    //console.log(11111)
    createBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')

  }

  return (

    <form onSubmit={addBlog}>

      <h2>create new</h2>
      <p>title: < input value={title}  name='title' onChange={handleTitleChange}/> </p>
      <p>author: <input value={author} name='author' onChange={handleAuthorChange}/> </p>
      <p>url: <input value={url} name='url' onChange={handleUrlChange}/> </p>
      <button type="submit">create</button>
    </form>
  )


}

export default  BlogForm