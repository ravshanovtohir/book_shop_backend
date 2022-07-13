import errors from '../utils/error.js'

const GET = async(req, res, next) => {
    try {
        const categories = await req.models.Category.findAll()
        console.log(categories);
        return res
            .status(201)
            .json({
                status: 200,
                categories: categories
            })

    } catch (error) {
        console.log(error);
        return next(new errors.InternalServerError(500, error.message))
    }
}

const POST = async(req, res, next) => {
    try {
        const categories = await req.models.Category.findAll()

        if (!req.userData.user_is_admin) {
            return next(
                new errors.AuthorizationError(400, 'You are not allowed to add a Product')
            )
        }

        let { category_name } = req.body

        const category = categories.find(cat => cat.category_name == category_name)

        if (category) {
            return next(new errors.AuthorizationError(400, "This category already exists"))
        }

        let newCategory = await req.models.Category.create({
            category_name
        })
        console.log(newCategory);

        return res
            .status(201)
            .json({
                status: 201,
                message: 'The category successfully added!',
                category: newCategory
            })




    } catch (error) {
        console.log(error);
        return next(new errors.InternalServerError(500, error.message))
    }
}

export default {
    GET,
    POST,
    // DELETE,
    // PUT,
    // DOWNLOAD
}