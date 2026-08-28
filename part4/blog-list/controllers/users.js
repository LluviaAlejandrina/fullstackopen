const bcrypt = require ('bcrypt')
const userRouter = require ('express').Router()
const User = require ('../models/user')
const { request } = require('../app')
const { isNull } = require('lodash')

userRouter.post('/', async(request,response,next) => {
    const { username, name, password} = request.body

    if ( !password || password.length < 3){
        return response.status(400).json({ error: 'password must be at least 3 chars long' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    next(error)
  }
})

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs',  { url: 1, title: 1, author: 1 })
    response.json(users)
})

module.exports = userRouter
