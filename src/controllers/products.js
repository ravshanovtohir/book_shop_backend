import errors from '../utils/error.js'
import path from 'path'
import fs from 'fs'

const GET = async(req, res, next) => {
    try {
        const products = await req.models.Product.findAll()

        return res
            .status(201)
            .json({
                status: 200,
                products: products
            })

    } catch (error) {
        console.log(error);
        return next(new errors.InternalServerError(500, error.message))
    }
}

const POST = async(req, res, next) => {
    try {

        const products = await req.models.Product.findAll()
        const categories = await req.models.Category.findAll()

        console.log(req.userData.user_is_admin);

        if (!req.userData.user_is_admin) {
            return next(
                new errors.AuthorizationError(400, 'You are not allowed to add a Product')
            )
        }

        let { product_name, product_author, product_price, short_description, long_description, product_category } = req.body
        let { file, book } = req.files

        console.log(file);


        const category = categories.find(cat => cat.category_name == product_category)

        // console.log(
        //     product_name, product_author, product_price, short_description, long_description, product_category);

        if (!product_price || product_price == 0 ||
            !short_description || short_description.length > 50 || short_description.length < 5 ||
            !long_description || long_description.length > 500 || long_description.length < 5
        ) {
            return next(
                new errors.ValidationError(400, 'Invalid Input product price or descriptions!')
            )
        }

        if (!product_name ||
            product_name.length > 50 || product_name.length < 1
        ) {
            return next(
                new errors.ValidationError(400, 'Invalid product name')
            )
        }

        if (!product_author ||
            product_author.length > 50 || product_author.length < 1
        ) {
            return next(
                new errors.ValidationError(400, 'Invalid product author')
            )
        }


        if (!file) {
            return next(
                new errors.ValidationError(400, 'File is required')
            )
        }

        if (!book) {
            return next(
                new errors.ValidationError(400, 'Book is required')
            )
        }

        if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) {
            return next(
                new errors.AuthorizationError(400, 'Invalid mime type for books image')
            )
        }


        if (!['application/msword', 'application/pdf', "application/powerpoint"].includes(book.mimetype)) {
            return next(
                new errors.AuthorizationError(400, 'Invalid mime type for books file')
            )
        }



        if (file.size > 50 * 1024 * 1024) {
            return next(
                new errors.ValidationError(400, 'File is too large')
            )
        }

        if (book.size > 100 * 1024 * 1024) {
            return next(
                new errors.ValidationError(400, 'Book is too large')
            )
        }


        const fileName = Date.now() + file.name.replace(/\s/g, "")
        const bookName = Date.now() + book.name.replace(/\s/g, "")
        const filePath = path.join(process.cwd(), 'uploads', fileName)
        const bookPath = path.join(process.cwd(), 'uploads', bookName)

        file.mv(filePath)
        file.mv(bookPath)

        const product = products.find(product => product.product_name == product_name)

        console.log(product);

        if (product) {
            return next(
                new errors.ValidationError(400, 'The Product already exists')
            )
        }


        let newProduct = await req.models.Product.create({
            category_id: category.category_id,
            product_name,
            product_author,
            product_price,
            short_description,
            long_description,
            product_img: fileName,
            product_files_name: bookName
        })
        console.log(newProduct);

        return res
            .status(201)
            .json({
                status: 201,
                message: 'The product successfully added!',
                category: newProduct
            })




    } catch (error) {
        console.log(error);
        return next(new errors.InternalServerError(500, error.message))
    }
}

const DELETE = async(req, res, next) => {
    try {

        let { product_id } = req.body

        const products = await req.models.Product.findAll()

        if (!req.userData.user_is_admin) {
            return next(
                new errors.AuthorizationError(400, 'You are not allowed to delete a Product')
            )
        }

        if (!product_id || product_id == 0) {
            return next(
                new errors.ValidationError(400, 'Invalid product ID')
            )
        }

        const product = products.find(product => product.product_id == product_id)

        if (product) {
            fs.unlink(path.join(process.cwd(), 'uploads', product.product_img), (err) => {
                if (err) {
                    console.log(err);
                }
            })

            fs.unlink(path.join(process.cwd(), 'uploads', product.product_files_name), (err) => {
                if (err) {
                    console.log(err);
                }
            })

            let deletedProduct = await req.models.Product.destroy({
                where: {
                    product_id
                }
            })

            return res
                .status(200)
                .json({
                    status: 200,
                    message: 'The Product successfully deleted!'
                })
        } else {
            return next(
                new errors.ValidationError(400, 'The Category does not exist')
            )
        }

        console.log(products);

    } catch (error) {
        console.log(error);
        return next(new errors.InternalServerError(500, error.message))
    }
}

const PUT = async(req, res, next) => {
    try {
        const allProducts = await req.models.Product.findAll()
        let { product_id, category_id, product_name, product_price, short_description, long_description } = req.body

        if (!req.userData.user_is_admin) {
            return next(
                new errors.ValidationError(400, 'You are not allowed to updated a category')
            )
        }

        if (!product_id || product_id == 0) {
            return next(
                new errors.ValidationError(400, 'Invalid product ID')
            )
        }

        const product = allProducts.find(product => product.product_id == product_id)

        if (product) {
            let updatedProduct = await req.models.Product.update({
                product_name: product_name ? product_name : product.product_name,
                product_price: product_price ? product_price : product.product_price,
                short_description: short_description ? short_description : product.short_description,
                long_description: long_description ? long_description : product.long_description,
                category_id: category_id ? category_id : product.category_id
            }, {
                where: {
                    product_id,
                },
                returning: true
            })
            return res
                .status(200)
                .json({
                    status: 200,
                    message: 'The product successfully updated!',
                    data: updatedProduct
                })
        } else {
            return next(
                new errors.AuthorizationError(400, 'The product does not exist')
            )
        }

    } catch (error) {
        console.log(error);
        return next(new errors.InternalServerError(500, error.message))
    }
}

const DOWNLOAD = async(req, res, next) => {
    try {

        const { videoPath } = req.params
        res.download(path.join(process.cwd(), 'uploads', videoPath))

    } catch (error) {
        console.log(error);
        return next(new errors.InternalServerError(500, error.message))

    }
}

export default {
    GET,
    POST,
    DELETE,
    PUT,
    DOWNLOAD
}

// let { category_id, product_name, product_price, short_description, long_description } = req.body
//         let { file } = req.files
//         console.log(file);