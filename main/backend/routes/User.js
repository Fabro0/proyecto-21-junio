const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const passportConfig = require('../passport');
const JWT = require('jsonwebtoken');
const UserNew = require('../models/User');
const Todo = require('../models/Todo');
const User = require('../models/User');



userRouter.get('/tool', async (req, res) => {
    const users = await UserNew.find()
    res.json(users)
})

userRouter.post('/registerNew', (req, res) => {
    const { dni, companyID, role, username } = req.body;
    UserNew.findOne({ dni }, (err, user) => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        if (user)
            res.status(400).json({ message: { msgBody: "Username is already taken", msgError: true } });
        else {
            const newUser = new UserNew({ username, dni, companyID, role });
            newUser.save(err => {
                if (err) {
                    res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
                    console.log(err)
                    console.log('uwu')
                }
                else
                    res.status(201).json({ message: { msgBody: "Account successfully created", msgError: false } });
            });
        }
    });
});

userRouter.get('/users/:compid', async (req, res) => {
    const id = req.params.compid;
    const users = await UserNew.find({ companyID: id })
    res.json(users)
})
userRouter.get('/delete/:_id', async (req, res) => {
    const id = req.params._id;
    const users = await UserNew.deleteOne({ "_id": id })
    res.json(users)
})



const signToken = userID => {
    return JWT.sign({
        iss: "NoobCoder",
        sub: userID
    }, "NoobCoder", { expiresIn: "1h" });
}

userRouter.put('/register', async (req, res) => {
    const { username, password, dni, companyID, mail } = req.body;
    const user_ = await UserNew.find({ companyID: companyID, dni: dni, createdAccount: false })


    if (user_.length !== 0 && user_ !== []) {
        await UserNew.findOne({ dni: dni }, function (err, doc) {
            if (err) return false;
            doc.password = password;
            doc.username = username;
            doc.mail = mail;
            doc.createdAccount = true;
            doc.save()
        })

        res.json({ message: { msgBody: "todo ok", msgError: false } })

    } else {
        res.json({ message: { msgBody: "error", msgError: true } });
    }

});

userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const { _id, username, role, dni, companyID, mail } = req.user;
        const token = signToken(_id);

        res.cookie('access_token', token, { httpOnly: true, sameSite: true });
        res.status(200).json({ isAuthenticated: true, user: { username, role, dni, companyID, mail } });

    }

});

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.clearCookie('access_token');
    res.json({ user: { username: "", role: "", dni: "", companyID: "", mail: "" }, success: true });
});

userRouter.post('/todo', passport.authenticate('jwt', { session: false }), (req, res) => {
    const todo = new Todo(req.body);
    todo.save(err => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        else {
            req.user.todos.push(todo);
            req.user.save(err => {
                if (err)
                    res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
                else
                    res.status(200).json({ message: { msgBody: "Successfully created todo", msgError: false } });
            });
        }
    })
});

userRouter.get('/todos', passport.authenticate('jwt', { session: false }), (req, res) => {
    UserNew.findById({ _id: req.user._id }).populate('todos').exec((err, document) => {
        if (err)
            res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
        else {
            res.status(200).json({ todos: document.todos, authenticated: true });
        }
    });
});

userRouter.get('/admin', passport.authenticate('jwt', { session: false }), (req, res) => {
    if (req.user.role === 'admin') {
        res.status(200).json({ message: { msgBody: 'You are an admin', msgError: false } });
    }
    else
        res.status(403).json({ message: { msgBody: "You're not an admin,go away", msgError: true } });
});

userRouter.get('/authenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { username, role, dni, companyID, mail } = req.user;
    res.status(200).json({ isAuthenticated: true, user: { username, role, dni, modeloEntrenado: false, companyID, mail } });
});





module.exports = userRouter;