const Blog = require ('../models/blog')
const User = require('../models/user')


const initialBlogs = [
    {
    id: "5a422a851b54a676234d17f7",
    title: "first blog",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    id: "5a422aa71b54a676234d17f8",
    title: "second blog",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  }
]

const nonExistingId = async () => {
    const blog =  new  Blog ({
        title: "will remove this soon",
        author: "me",
        url: "https://fake.com/",
        likes: 7,
    })
    await blog.save()
    await blog.deleteOne()
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map( blog => blog.toJSON())
}

usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports ={
    initialBlogs, nonExistingId, blogsInDb,usersInDb
}
