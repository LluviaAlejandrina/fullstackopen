const {test,after,beforeEach,describe} = require ('node:test')
const mongoose = require ('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const { assignIn } = require('lodash')
const bcrypt = require('bcrypt')
const User = require('../models/user')


const api = supertest(app)
let token
let testUser

beforeEach( async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    testUser = new User({
    username: 'root',
    name: 'Michael',
    passwordHash
    })

    await testUser.save()
    const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'sekret'
    })

    token = loginResponse.body.token
    const blogs = helper.initialBlogs.map(blog => ({
    ...blog,
    user: testUser._id
    }))

    await Blog.insertMany(blogs)
})



test('blogs are returned as json', async() => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)

})

test('property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const sampleBlog = response.body[0]
    assert.strictEqual('id' in sampleBlog, true)
    assert.strictEqual('_id' in sampleBlog, false)

})

test('a valid blog can be added', async () => {
    const newBlog= {
        title: "a blog can be added",
        author: "Lluvi",
        url: "http://www.ablog-canbeadded.com",
        likes: 1,
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map( blog => blog.title)
    assert(titles.includes('a blog can be added'))

})

test('if a note has no likes, likes property will default to 0', async () => {
    const newBlog = {
        title: "blog without likes",
        author: "Lluvi",
        url: "http://www.nolikes.com",
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()

    const savedBlog = blogsAtEnd.find(b => b.title === "blog without likes" )
    assert.strictEqual(savedBlog.likes, 0)

})

test('no blog without title or url is added', async() => {
    const newBlog ={
        author: "Lluvi"
    }

    await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('adding a blog fails with 401 if token is not provided', async () => {
  const newBlog = {
    title: 'unauthorized blog',
    author: 'Lluvi',
    url: 'http://www.unauthorized.com',
    likes: 1
  }

  const blogsAtStart = await helper.blogsInDb()

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(
    blogsAtEnd.length,
    blogsAtStart.length
  )
})


describe('deletion of a blog', () => {
    test('a blog can be deleted', async()=> {
        const blogsAtStart =  await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        const ids = blogsAtEnd.map(b => b.id)
        assert(!ids.includes(blogToDelete.id))

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length -1)
    })

})

describe('update likes of a blog', () => {
    test('change likes of a blog', async ()  => {
        const blogsAtStart =  await helper.blogsInDb()
        const blogToChange = blogsAtStart[0]
        blogToChange.likes = 123

        await api
        .put(`/api/blogs/${blogToChange.id}`)
        .send(blogToChange)
        .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        const changedBlog = blogsAtEnd.find(b => b.id === blogToChange.id)
        console.log(changedBlog)

        assert.strictEqual(changedBlog.likes, 123)

    })
})


describe('when there is initially one user in db', () => {
    beforeEach( async() => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret',10)
        const user = new User({ username: 'root', name: 'Michael', passwordHash })
        await user.save()

    })

    test('creation succeeds  with a  fresh  username', async() => {
        const usersAtStart= await helper.usersInDb()

      const newUser = {
        username: 'mlukai',
        name : 'Matti Lukai',
        password: 'salainen'
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })


    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart= await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

    })

    test('creation fails if username is shorter than 3 chars', async() => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: 'ab',
            name: 'Short Username',
            password: 'salainen'
        }

        const result =await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        assert(result.body.error)
        assert.strictEqual(usersAtEnd.length,usersAtStart.length)

    })

    test('creation fails if username is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      name: 'Missing Username',
      password: 'salainen'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error)

    assert.strictEqual(
      usersAtEnd.length,
      usersAtStart.length
    )
  })

  test('creation fails if password is shorter than 3 characters', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'shortpassword',
      name: 'Short Password',
      password: 'ab'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(
      result.body.error,
      'password must be at least 3 chars long'
    )

    assert.strictEqual(
      usersAtEnd.length,
      usersAtStart.length
    )
  })

   test('creation fails if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'nopassword',
      name: 'Missing Password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert.strictEqual(
      result.body.error,
      'password must be at least 3 chars long'
    )

    assert.strictEqual(
      usersAtEnd.length,
      usersAtStart.length
    )
  })


})


after( async () => {
    await mongoose.connection.close()
})
