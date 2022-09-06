import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm  from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {

    const user = userEvent.setup()
    const createBlog = jest.fn()
  
    const { container } = render(<BlogForm createBlog={createBlog} />)

    //screen.debug()
    const title = container.querySelector("input[name='title']")
    const author = container.querySelector("input[name='author']")
    const url = container.querySelector("input[name='url']")
    const button = screen.getByText('create')


    await user.type(title, 'This is a test title for ze Blog')
    await user.type(author, 'Testi Tero')
    await user.type(url, 'http://localhost:3003/api/blogs')
    await user.click(button)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('This is a test title for ze Blog')
    expect(createBlog.mock.calls[0][0].author).toBe('Testi Tero')
    expect(createBlog.mock.calls[0][0].url).toBe('http://localhost:3003/api/blogs')

})