const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()
const multer = require('multer')
const sharp = require('sharp')

const upload = multer({
    limits: {
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload a jgp/jpeg/png file.'))
        }
        cb(undefined, true)
    }
})

//LOGIN
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password) // MODEL METHOD
        const token = await user.generateAuthToken() // INSTANCE METHOD
        //////////////////////// MODIFIED ///////////////////////////
        req.headers.authorization = 'Bearer ' + token;
        console.log(req.header('Authorization'));
        /////////////////////////////////////////////////////////////
        res.send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send()
    }
})

//SIGNUP
router.post('/users', async (req, res) => {
    // console.log(req.body)
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken() // INSTANCE METHOD
        //////////////////////// MODIFIED ///////////////////////////
        req.headers.authorization = 'Bearer ' + token;
        console.log(req.header('Authorization'));
        /////////////////////////////////////////////////////////////
        res.status(201).send({
            user,
            token
        })
    } catch (error) {
        res.status(400).send(error)
    }

})

//Logout from current session/device
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })

        await req.user.save()

        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//Logout from all sessions/devices
router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})

//PROFILE
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//GET PROFILE BY id
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch (error) {
//         res.status(500).send()
//     }
// })

router.patch('/users/me', async (req, res) => {

    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    //isValidOperation is true only when all the items in updates are present in allowedUpdates
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(404).send({
            error: 'Invalid Updates!'
        })
    }

    try {
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        //     new: true, //will give us the updated user
        //     runValidators: true //will run the validations on the updates
        // })
        //Following 3 lines of code replaces the above section. This is done so that mongoose doesn't bypass the middleware.
        //const user = await User.findById(req.params.id)
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()

        // if (!user) {
        //     return res.status(404).send()
        // }
        res.send(req.user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send()
        // }
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send()
    }
})

//CREATE AND UPDATE AVATAR == PROFILE PIC
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

//DELETE AVATAR == PROFILE PIC
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//GET AVATAR == PROFILE PIC
router.get('/users/:id/avatar', auth, async (req, res) => {
    try {
        if (!req.user.avatar) {
            throw new Error('Avatar does not exist.')
        }
        res.set('Content-Type', 'image/jpg')
        res.send(req.user.avatar)
    } catch (error) {
        res.status(404).send({
            error: error.message
        })
    }
})

module.exports = router
