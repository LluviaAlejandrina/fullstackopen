const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const middleware = require('../utils/middleware')

/* const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
 */

blogsRouter.get('/', async (request, response) => {
 const blogs = await Blog.find({}).populate('user',  { username: 1, name: 1 })
  response.json(blogs)

})



blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url) {
    response.status(400).end()
  } else {
    const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
    })


    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)

  }

})


blogsRouter.delete('/:id',middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user


  blogToDelete = await Blog.findById(request.params.id)
  if (!blogToDelete) {
    return response.status(404).end()
  }

   if ( user.id.toString() !== blogToDelete.user.toString()){
    return response.status(403).json({ error: 'Unauthorized action..' })
   }

   await blogToDelete.deleteOne()
    response.status(204).end()

})

blogsRouter.put('/:id', async (request, response ) => {
  const {title,author,url,likes} = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
        return response.status(404).end()
  }else {
    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes


    const updatedBlog = await blog.save()
    response.json(updatedBlog)
  }

})

module.exports = blogsRouter
