import express from "express"
import { getBooks, addBook, getBookById, getFeaturedBooks, getBestSellers, getBooksByGenre, addToWishlist, removeFromWishlist} from "../controllers/books.controllers"
import { verifyToken } from "../utils/verify-token"

export const bookRouter = express.Router()

bookRouter.use(verifyToken)
bookRouter.get('/', getBooks)
bookRouter.get('/featured', getFeaturedBooks)
bookRouter.get('/bestsellers', getBestSellers)
bookRouter.get('/genre/:genre', getBooksByGenre)
bookRouter.get('/:id', getBookById)
bookRouter.post('/', addBook)
bookRouter.post('/wishlist/:id', verifyToken ,addToWishlist)
bookRouter.delete('/wishlist/:id', verifyToken, removeFromWishlist)