import email from "../utils/sendMail.js"
import checkToken from '../middlewares/checkToken.js'
import { Router } from 'express'

const router = Router()

router.post('/sendEmail', checkToken, email.POST)
    // router.post('/addcategory', checkToken, category.POST)
    // router.delete('/deleteProduct', checkToken, books.DELETE)
    // router.put('/putproduct', checkToken, books.PUT)
    // router.get('/download/videos/:videoPath', controller.DOWNLOAD)
export default router