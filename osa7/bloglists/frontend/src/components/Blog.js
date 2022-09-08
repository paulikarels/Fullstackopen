import React, { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {

  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = (event) => {
    event.preventDefault()
    //console.log(blog)
    //const { id, author, url, title } = blog
    const { id  } = blog
    /*
    const updatedBlog = {
      user: blog.user?.id || blog.user,
      likes: blog.likes + 1,
      title,
      author,
      url,
    }
    */
    const likes = blog.likes + 1
    const updatedBlog = { ...blog, likes }

    updateBlog(id, updatedBlog)
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      const { id  } = blog
      deleteBlog(id)
    }
  }
  const divStyle = {
    color: 'black',
    fontStyle: 'italic',
    fontSize: 16
  }

  const extendBlog   = (
    <div style={divStyle}>
      <div>
        {blog.url}
      </div>
      <div>
        likes {blog.likes} <button onClick={addLike} id='like'> like</button>
      </div>
      <div>
        {(blog.user?.name)}
      </div>
      <div>
        {(blog.user?.name === user.name) ? <button onClick={removeBlog} id='delete'> remove</button> :  ''}
      </div>
    </div>
  )

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style={blogStyle} className='blog'>
      <div >
        <span> {blog.title} {blog.author} </span>
        <button onClick={toggleVisibility} >view</button>
      </div>
      {visible ? extendBlog :  ''}
    </div>

  )

}

export default Blog