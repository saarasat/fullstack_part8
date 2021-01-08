const { PubSub } = require('apollo-server')
const { v1: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')
const { AuthenticationError } = require('apollo-server')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const pubsub = new PubSub()

const PASSWORD = 'PASSWORD'
const JWT_SECRET = 'TOP_SECRET'

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = args.genre ?
        await Book.find({ genres: { $in: [args.genre] }}).populate('author')
        : await Book.find({}).populate('author')
      return books
    },
    allAuthors: async () => {
      const authors = await Author.find({}).populate('books')
      for (author of authors) {
        author.bookCount = author.books.length
      }
      return authors
    },
  },
  /*
  Author: {
    bookCount: async (root, args) => {
      const books = await Book.find({ author: { $in: [root._id]}})
      if (books) return books.length
      else return 0
    }
  },*/
  Mutation: {
    createUser: (root, args) => {
      const user = new User({ username: args.username })

      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== PASSWORD) {
        throw new UserInputError("wrong credentials")
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET)}
    },
    addBook: async (root, args, context) => {
      const authorName = args.author;
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      let author = await Author.findOne({ name: authorName })

      if (!author) {
        author = new Author({ name: authorName })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args
          })
        }
      }
      const book = new Book({ ...args, author, id: uuid() })
      author.books.push(book.id)
      try {
        await book.save()
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not auhenticated")
      }
      const author = await Author.findOne({ name: args.name })
      
      if (!author) return null
      author.born = args.born
      return author.save()
    }
  }, 
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers