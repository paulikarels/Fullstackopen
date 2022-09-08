import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  // eslint-disable-next-line
  const [ message, setErrorMessage] = useState({ message: null, style: "success"})
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      failureMessage('wrong username or password')
    }
  }

  const handleLogout = async (event) => {

    event.preventDefault()
    window.localStorage.removeItem('loggedNoteappUser')
  }

  const addBlog = async (blogObject) => {
    // console.log(22222)
    blogFormRef.current.toggleVisibility()
    await blogService.create(blogObject)
    const update = await blogService.getAll()
    setBlogs(update)
    successMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
  }

  const updateBlog = async (id, blogObject) => {

    await blogService.update(id, blogObject)
    const update = await blogService.getAll()
    setBlogs(update)
  }

  const deleteBlog = async (id) => {

    await blogService.deleteBlog(id)
    const update = await blogService.getAll()
    setBlogs(update)
  }



  const loginForm = () => (
    //<Togglable buttonLabel='login'>
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleLogin={handleLogin}
    />
    //</Togglable>
  )

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog}  />
    </Togglable>
  )

  const successMessage = (value) => {
    setErrorMessage(
      { message: value, style: 'success' }
    )
    setTimeout(() => {
      setErrorMessage({ message: null })
    }, 5000)
  }

  const failureMessage = (value) => {
    setErrorMessage(
      { message: value, style: 'error' }
    )
    setTimeout(() => {
      setErrorMessage({ message: null })
    }, 5000)
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <div>

        <Notification message={message.message} className={message.style}/>
        {loginForm()}

      </div>
    )
  }
  //<Notification message={errorMessage} />
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message.message} className={message.style}/>
      <p>{user.name} logged in  <button onClick={handleLogout}>logout</button> </p> <br/>


      {blogForm()}
      {blogs
        .sort((a,b) => b.likes -  a.likes )
        .map(blog =>
          <Blog key={blog.id} blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}/>
        )}

    </div>
  )
}

export default App
