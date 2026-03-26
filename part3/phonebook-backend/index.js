const express = require ('express')
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
    response.json(persons)
})

app.get('/api/info',(request,response) => {
    response.send(
        `<h3>Phonebook has info for ${persons.length} people</h3>
        <p>${new Date()}</p>`
    )
})

app.get('/api/persons/:id', (request,response) => {
  const id = request.params.id
  const person = persons.find( p => p.id === id)

  if ( person){
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id',(request,response) => {
 const id = request.params.id
 persons = persons.filter(p => p.id !== id)
 response.status(204).end()

})

app.post('/api/persons',(request,response) => {
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

    const person = {
      "id": generateId(),
      "name": body.name,
      "number": body.number
    }

    persons = persons.concat(person)
    response.status(201).json(person)

  }
})


const PORT =  process.env.PORT || 3001
app.listen(PORT)
console.log(`server running on port 3001 ${PORT}`)
