const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { url: 1, title: 1, author: 1, id: 1,  })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const existingUser = await User.findOne({ username })
    if (existingUser) {
      return response.status(400).json({
        error: 'username must be unique'
    })
  }

  if (!password) {
    return response.status(400).json({
      error: 'password must exist'
  })
  }

  if (password.length < 3) {
    return response.status(400).json({
      error: `User validation failed: password: ${password} is shorter than the minimum allowed length (3).`
    })
  }

  //console.log(password)

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter
