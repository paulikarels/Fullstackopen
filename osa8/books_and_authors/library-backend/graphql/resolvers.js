const Author = require('../models/author')
const Book = require('../models/book')
const User = require('../models/user')
const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const jwt = require('jsonwebtoken')

const resolvers = {
  Query: {
    dummy: () => 0,
    bookCount: async () => await Book.countDocuments({}) ,
    authorCount: async () => await Author.countDocuments({}),
    allBooks: async (root, args, context) => {

      if (Object.keys(args).length === 0 ) {
        const books = await Book.find({}).populate('author')
        return  books
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

      return book
    },
    allAuthors: async (root, args) => {

      const authors = await Author.find({})
      return authors
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

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

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

      const author = await Author.findOneAndUpdate({name: args.name}, { name: args.name, born: args.setBornTo},{ new: true } ) 

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


    

  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}


module.exports = resolvers