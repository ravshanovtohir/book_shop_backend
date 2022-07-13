import errors from '../utils/error.js'
import JWT from '../utils/jwt.js'
import sha256 from 'sha256'

const REGISTER = async(req, res, next) => {
    try {
        const users = await req.models.User.findAll()

        let { username, password } = req.body


        username = username.trim()
        password = password.trim()

        if (!username || username.length > 30 || username.length < 4) {
            return next(
                new errors.AuthorizationError(400, 'Invalid username')
            )
        }

        if (!password || password.length > 50 || password.length < 6) {
            return next(
                new errors.AuthorizationError(400, 'Invalid Password length')
            )
        }

        const user = users.find(user => user.user_name == username)

        if (user) {
            return next(
                new errors.AuthorizationError(400, 'The username already exists')
            )
        }

        let newUser = await req.models.User.create({
            user_name: username,
            user_password: sha256(password),
            user_is_admin: false
        })

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']



        return res
            .status(201)
            .json({
                status: 201,
                message: 'The user successfully registered!',
                token: JWT.sign({ agent, ip, username, userId: newUser.user_id, isRoot: newUser.user_is_admin }),
                user: newUser
            })

    } catch (error) {
        console.log(error);
    }
}

const LOGIN = async(req, res, next) => {
    try {
        const users = await req.models.User.findAll()

        let a = users.map(el => el.user_name == "Abror")
        console.log(a);

        let { username, password } = req.body


        console.log(username, password);


        const user = users.find(user => user.user_name == username && user.user_password == sha256(password))
        console.log(users);

        if (!user) {
            return next(
                new errors.AuthorizationError(400, 'Wrong username or password')
            )
        }

        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const agent = req.headers['user-agent']



        return res
            .status(201)
            .json({
                status: 201,
                message: 'The user successfully logged in!',
                token: JWT.sign({ agent, ip, username, userId: user.user_id, isRoot: user.user_is_admin }),
                user: user
            })

    } catch (error) {
        console.log(error);
    }
}

export default {
    REGISTER,
    LOGIN
}