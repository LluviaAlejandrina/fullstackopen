const mongoose = require ('mongoose')

 /* WHEN DOING CONDITIONALS It’s safer to:
whitelist valid inputs instead of trying to catch all invalid ones */

if (process.argv.length !== 3 && process.argv.length !== 5 ){
    console.log("please provide name and number")
    process.exit(1)
}


const password = process.argv[2]

const url =  `mongodb+srv://FSOlearning:${password}@cluster0.gblzoep.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`


mongoose.set('strictQuery',false)

mongoose.connect(url,{family : 4})

const personSchema = new mongoose.Schema({
    name : String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)



if (process.argv.length === 3){

console.log("Phonebook: ")
  Person.find({}).then(result => {
  result.forEach(p => {
    console.log(`${p.name} ${p.number}`)
  })
  mongoose.connection.close()
})
} else {

  const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})


person.save().then(result => {
  console.log(`Added ${person.name} number ${person.number} to phonebook`)
  mongoose.connection.close()
})
}
