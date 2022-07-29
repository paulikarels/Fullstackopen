const mongoose = require('mongoose')

// eslint-disable-next-line no-undef
const password = process.argv[2]
// eslint-disable-next-line no-undef
const name = process.argv[3]
// eslint-disable-next-line no-undef
const phonenumber = process.argv[4]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.dxhd1wz.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: phonenumber,
})

// eslint-disable-next-line no-undef
if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    result.forEach(() => {
      console.log(`${name} ${phonenumber}`)
    })
    mongoose.connection.close()
  })
}
// eslint-disable-next-line no-undef
if (process.argv.length === 5) {
  person.save().then(() => {
    console.log(`added ${name} number ${phonenumber} to phonebook`)
    mongoose.connection.close()
  })
}
