
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')


const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })



let authors = [
  {
    name: 'Robert Martin',
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963
  },
  {
    name: 'Fyodor Dostoevsky',
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821
  },
  { 
    name: 'Joshua Kerievsky', // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
  },
  { 
    name: 'Sandi Metz', // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
  },
]

/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conección con el libro
*/

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ['agile', 'patterns', 'design']
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring']
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'patterns']
  },  
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ['refactoring', 'design']
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'crime']
  },
  {
    title: 'The Demon ',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ['classic', 'revolution']
  },
]

/*
  you can remove the placeholder query once your first one has been implemented  
*/


const typeDefs = `

  type Author {
    name: String!
    born: Int
    bookCount: Int
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]
    id: ID!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Query {
    dummy: Int
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]! 
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]
    ): Book!

    addAuthor(
      name: String!
      born: Int
    ): Author

    editAuthor(
      name: String!
      setBornTo: Int
    ): Author

    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }


`

const authorsWithBookCount = () => {
  
  //const bookCount = books.filter(b => b.author === args.name).length
  for(const author of authors) {
    author.bookCount = books.filter(b => b.author === author.name).length;
  }
  return authors
} 

const _addAuthor = (root, args) => {
  const author = { ...args, id: uuid() }
  //console.log(authors)

  authors = authors.concat(author)
  return author
}



const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => await Book.countDocuments({}) ,
    authorCount: async () => await Author.countDocuments({}),
    allBooks: async (root, args, context) => {
      if (Object.keys(args).length === 0 ) {
        return  await Book.find({})
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {

        throw new GraphQLError(`author doesn't exist`, {
          extensions: {
            code: 'BAD_AUTHOR_INPUT',
          }
        })
      } 
      
      let book = await Book.find({author: author._id}).populate('author')
      book.author = author
      //console.log(book)
      return book
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Mutation: {
    addBook: async (root, args, context) => {
     
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      let author = await Author.findOne({ name: args.author })

      if (!author) {
        author = new Author({ name: args.author, bookCount: 1 })
        try {
          await author.save()
          
        } catch (error) {
          throw new GraphQLError(`Saving author failed`, {
            extensions: {
              code: 'BAD_AUTHOR_INPUT',
              invalidArgs: args.name,
              error
  
            }
          })
        }
      } else {
        author.bookCount += 1
        await author.save()
      }

      let book = new Book({
        title: args.title,
        published: args.published,
        genres: args.genres,
        author: author
      })

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError(`Saving book failed`, {
          extensions: {
            code: 'BAD_BOOK_INPUT',
            invalidArgs: args.title,
            error

          }
        })
      }
      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          }
        })
      }

      const author = await Author.findOneAndUpdate(args.author, { name: args.author, born: args.setBornTo},{ new: true } ) 
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError(`Editing author failed`, {
          extensions: {
            code: 'BAD_AUTHOR_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      }
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.name,
              error
            }
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'thisissecret123' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })        
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, process.env.SECRET) }
    },
  }
}



const server = new ApolloServer({
  typeDefs,
  resolvers
})

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.SECRET
      )
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})


/*

const oldresolvers = {
  Query: {
    dummy: () => console.log(authors, books),
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) =>  {

      const bookGenres    = books.filter(book => Object.values(args).some(x =>  book.genres.includes(x)))
      const bookAuthors   = books.filter(book => Object.values(args).some(x =>  book.author.includes(x)))
      const argKey = Object.keys(args)

      if ((argKey.includes("author")) && (argKey.includes("genre"))) {
        const filteredArray = bookGenres.filter(value => bookAuthors.includes(value))
        return filteredArray
      }
      
      if ((argKey.includes("author") )) {
        return bookAuthors
      }

      if ((argKey.includes("genre"))) { 
        return bookGenres
      }

      return books
    },
    allAuthors: authorsWithBookCount
  },
  Mutation: {
    addAuthor: _addAuthor,
    addBook:  (root, args) => {

      if (!(authors.find(a => a.name === args.author))) {
        _addAuthor(null,{ name: args.author })
        
      }
      const book = { ...args, id: uuid() }
      
      books = books.concat(book)
      return book
    },
    editAuthor: (root, args) => {
      if (!args.setBornTo) return null
      const author = authors.find(a => a.name === args.name)
      //console.log(author)
      if (!author) {
        return null
      }
      
      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map(a => a.name === args.name ? updatedAuthor : a)
      return updatedAuthor
    }   
  }
}

*/