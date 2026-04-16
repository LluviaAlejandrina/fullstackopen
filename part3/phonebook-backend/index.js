const express = require ('express')
require ('dotenv').config()
const Person = require ('./models/person')


const morgan = require ('morgan')
const cors = require ('cors')

//Create a custom Morgan token
morgan.token('body', (req)=> {
  return JSON.stringify(req.body) //Morgan expects a string,
})

const app = express()
app.use (express.json())
app.use(cors({origin: 'http://localhost:5173'})) // only my phonebook front end can access my backend

//Add :body to the format string
// Morgan needs req.body, and that only exists after JSON parsing.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('dist')) // look into the dist folder first ( serve the front end files)

let persons =[
    {
      "id": "1",
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": "2",
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": "3",
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": "4",
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]

// generate a  random  number  between 1 and 10000
const generateId = () => {
  return Math.floor(Math.random() * 10000)
}

app.get ('/api/persons', (request,response) => {
  Person.find({}).then(people => response.json(people))

})

app.get('/api/info',(request,response) => {
  Person.countDocuments({}).then(count =>{
    response.send(
        `<h3>Phonebook has info for ${count} people</h3>
        <p>${new Date()}</p>`
    )
  })

})

app.get('/api/persons/:id', (request,response,next) => {
  Person.findById(request.params.id).then(person => response.json(person))
  .catch(error => next(error))
  /*  this was before mongo..const id = request.params.id
  const person = persons.find( p => p.id === id)

  if ( person){
    response.json(person)
  } else {
    response.status(404).end()
  } */
})

app.delete('/api/persons/:id',(request,response) => {
  Person.findByIdAndDelete(request.params.id).then(result =>{
    response.status(204).end()
  })
  .catch(error => next(error))

 /* const id = request.params.id
 persons = persons.filter(p => p.id !== id)
 response.status(204).end() */

})

app.post('/api/persons',(request,response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
     return response.status(400).json({
      error: 'please provide  name or number of person'
    })

  }

  if (persons.some( person => person.name.toLowerCase() === body.name.toLowerCase())){
    return response.status(400).json({
      error: 'name of person must be unique'
    })
  } else {

    const person = new Person(
      {
      "name": body.name,
      "number": body.number
    }
    )

    person.save()
    .then(savedPerson => response.status(201).json(savedPerson))
    .catch(error=> next(error))
  }
})

app.put('/api/persons/:id',(request,response,next) => {
  const {name, number} = request.body

  Person.findById(request.params.id)
  .then( person =>{
    if(!person){
      return response.status(404).end()
    }

    person.name = name
    person.number = number

    return  person.save().then(updatedPerson =>{
      response.json(updatedPerson)
    })
  })
  .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if( error.name === 'ValidationError'){
    return response.status(400).send({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT =  process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port 3001 ${PORT}`)
