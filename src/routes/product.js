import books from '../controllers/products.js'
import checkToken from '../middlewares/checkToken.js'
import { Router } from 'express'

const router = Router()

router.get('/products', checkToken, books.GET)
router.post('/addproduct', checkToken, books.POST)
router.delete('/deleteProduct', checkToken, books.DELETE)
router.put('/putproduct', checkToken, books.PUT)
router.get('/download/books/:videoPath', books.DOWNLOAD)


export default router