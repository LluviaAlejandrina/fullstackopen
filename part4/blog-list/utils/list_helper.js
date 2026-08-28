const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
     const sum = (sum, singleblog) =>{
        return  sum + singleblog.likes
     }

     return blogs.length === 0
     ? 0
     : blogs.reduce(sum,0)

}

/*  another way with lodash:
const totalLikes = (blogs) => {
  return _.sumBy(blogs, 'likes')
} */

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return 0

    let favorite = blogs[0]
    for ( const blog of blogs ){
        if (blog.likes > favorite.likes){
            favorite = blog
        }
    }
    return favorite
}



/* another way with reduce :
 const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, currentBlog) => {
    return currentBlog.likes > favorite.likes
      ? currentBlog
      : favorite
  })
} */

const mostBlogs = (blogs) => {
 const grouped = _.groupBy(blogs,'author') // returns an object  see below

/*  example {
  'Robert C. Martin': [
    { title: 'A', author: 'Robert C. Martin' },
    { title: 'B', author: 'Robert C. Martin' },
    { title: 'C', author: 'Robert C. Martin' }
  ],
  'Edsger W. Dijkstra': [
    { title: 'D', author: 'Edsger W. Dijkstra' }
  ]
} */

  const authors = _.map(grouped, (blogs, author) => ({
    author,
    blogs: blogs.length
  })) //   this lodash map works with  objs aswell,   returns an array, see  below example:

  /* example [
  {
    author: 'Robert C. Martin',
    blogs: 3
  },
  {
    author: 'Edsger W. Dijkstra',
    blogs: 1
  }
  ] */

  return blogs.length === 0
  ? 0
  : _.maxBy(authors,'blogs') // returns the  value  in the array with the maximum number of blogs
}

 const mostLikes = (blogs) => {
   const grouped = _.groupBy(blogs, 'author')
    const authors = _.map(grouped, (blogs,author) => ({
      author,
      likes:  _.sumBy(blogs,'likes')
    }))

  return blogs.length === 0
  ? 0
  : _.maxBy(authors,'likes')
 }


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
