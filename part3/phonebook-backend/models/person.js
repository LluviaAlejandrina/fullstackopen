const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('conecting to...', url)
mongoose.connect(url,{family:4})

.then(result => {
    console.log("connected to mongodb!")
})
.catch( error => {
    console.log("error connecting to mongobd :( :", error.message)
})


const personSchema = new mongoose.Schema({
    name:{
      type: String,
      minLength: 5,
      required: true
    },
    number: {
        type: String,
        minLength: 8,
        required: true,
        validate: {
            validator: function(v) {
                return /^\d{2,3}-\d+$/.test(v)
            },
            message: props => `${props.value} is not a valid phone number`
        }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString()
        delete returnedObj._id
        delete returnedObj.__v
    }
})


module.exports = mongoose.model('Person', personSchema)
