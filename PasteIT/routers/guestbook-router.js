const express = require('express')
const router = express.Router()
const timeUtil = require('../time_util')
const validator = require('../validators').validator
const errorType = require('../errorType').errorType
const db = require('../database')
const csrf = require('csurf')
const csrfProtection = csrf()

router.get('/', function (request, response) {
    db.getAllGuestBookEntries(function (error, entries) {
        if (error) {
            const model = {
                entries,
                hasDatabaseError: true
            }
        }
        else {
            const model = {
                entries
            }
            response.render('guestbook.hbs', model)
        }
    })
})

router.get('/:id/comments/delete', csrfProtection, function (request, response) {
    const id = request.params.id
    const error = []
    const model = {
        id,
        error,
        csrfToken: request.csrfToken()
    }

    if (!request.session.isLoggedIn) {
        model.error.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    db.getGuestbookCommentById(id, function (error, comment) {
        if (error) {
            model.error.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
        }
        else if (!comment) {
            model.error.push(errorType.sql.CONTENT_DOES_NOT_EXIST)
        }
        response.render('delete-comment.hbs', model)
    })
})

router.post('/:id/comments/delete', csrfProtection, function (request, response) {
    const id = request.params.id
    const error = []

    const model = {
        csrfToken: request.csrfToken(),
        error
    }

    if (!request.session.isLoggedIn) {
        response.sendStatus(errorType.session.SESSION_NOT_AUTHORIZED)
        return
    }

    db.deleteGuestbookCommentById(id, function (error) {
        if (error) {
            response.sendStatus(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
        }
        else {
            response.redirect('/guestbook')
        }
    })
})

router.get('/create', csrfProtection, function (request, response) {
    response.render('create-entry.hbs', { csrfToken: request.csrfToken() })
})

router.post('/create', csrfProtection, function (request, response) {
    const name = request.body.name
    const age = request.body.age
    const email = request.body.email
    const entry = request.body.entry
    const errors = validator.guestbook.getError(name, age, email, entry)
    const model = {
        errors,
        csrfToken: request.csrfToken()
    }

    if (validator.hasError(errors)) {
        response.render('create-entry.hbs', model)
    }
    else {
        db.createGuestbookEntry(entry, name, email, age, function (error) {
            if (error) {
                model.errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
                response.render('create-entry.hbs', model)
            }
            else {
                response.redirect('/guestbook')
            }
        })
    }
})

router.get('/:id/comments/update', csrfProtection, function (request, response) {
    const id = request.params.id
    const errors = []

    if (!request.session.isLoggedIn) {
        errors.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    if (!validator.hasError(errors)) {
        db.getGuestbookCommentById(id, function (error, comment) {
            if (error) {
                errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
            }
            else {
                if (!comment) {
                    errors.push(errorType.sql.CONTENT_DOES_NOT_EXIST)
                    const model = {
                        id,
                        csrfToken: request.csrfToken()
                    }
                    response.render('update-comment.hbs', model)
                }
                else {
                    const model =
                    {
                        id,
                        comment,
                        csrfToken: request.csrfToken()
                    }
                    response.render('update-comment.hbs', model)
                }
            }
        })
    }
    else {
        const model = {
            id,
            errors
        }
        response.render('update-comment.hbs', model)
    }
})

router.get('/:id/update', csrfProtection, function (request, response) {
    const id = request.params.id
    const errors = []
    const model = {
        id,
        errors,
        entry: []
    }

    db.getGuestbookEntryById(id, function (error, entry) {
        if (error) {
            errors.push(error.sql.SERVER_CANT_PROCESS_REQUEST)
            const model =
            {
                id,
                errors,
                entry: [],
                csrfToken: request.csrfToken()
            }

            response.render('update-entry.hbs', model)
        }
        else {
            const model =
            {
                id,
                errors,
                entry,
                csrfToken: request.csrfToken()
            }
            response.render('update-entry.hbs', model)
        }
    })
})

router.post('/:id/comments/update', csrfProtection, function (request, response) {
    const id = request.params.id
    const comment = request.body.comment
    const name = request.body.name
    const age = request.body.age
    const errors = validator.comment.getError(name, age, comment)

    if (!request.session.isLoggedIn) {
        errors.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    if (validator.hasError(errors)) {
        const model = {
            errors,
            id,
            csrfToken: request.csrfToken()
        }
        response.render('update-comment.hbs', model)
    }
    else {
        db.updateGuestbookCommentById(id, comment, name, age, function (error, comments) {
            if (error) {
                errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
                const model = {
                    errors,
                    id,
                    csrfToken: request.csrfToken()
                }
            }
            else {
                response.redirect('/guestbook')
            }
        })
    }
})

router.get('/:id/comments', csrfProtection, function (request, response) {

    const id = request.params.id
    const errors = []

    db.getGuestbookEntryById(id, function (error, entry) {
        if (error) {
            errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
        }
        else {
            if (!entry) {
                errors.push(errorType.sql.CONTENT_DOES_NOT_EXIST)
            }
        }
    })

    const model = {
        id,
        errors,
        csrfToken: request.csrfToken()
    }

    if (!validator.hasError(errors)) {
        db.getAllGuestbookCommentsByEntryId(id, function (error, comments) {
            if (error) {
                model.errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
                response.render('comments.hbs', model)
            }
            else {
                const model = {
                    id,
                    errors,
                    comments,
                    csrfToken: request.csrfToken()
                }
                response.render('comments.hbs', model)
            }
        })
    }
    else {
        response.render('comments.hbs', model)
    }
})

router.get('/:id/comments/create', csrfProtection, function (request, response) {
    const id = request.params.id

    const model = {
        id,
        csrfToken: request.csrfToken()
    }

    response.render('create-comment.hbs', model)
})

router.post('/:id/comments/create', csrfProtection, function (request, response) {

    const id = request.params.id
    const comment = request.body.comment
    const name = request.body.name
    const age = request.body.age

    const errors = validator.comment.getError(name, age, comment)
    if (validator.hasError(errors)) {
        const model =
        {
            id,
            errors,
            csrfToken: request.csrfToken()
        }
        response.render('create-comment.hbs', model)
    }
    else {
        db.createGuestbookCommentOnEntryId(id, comment, name, age, function (error, comments) {
            if (error) {
                errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
                const model = {
                    id,
                    comment,
                    name,
                    age,
                    csrfToken: request.csrfToken()
                }

                response.render('create-comment.hbs', model)
            }
            else {
                response.redirect('/guestbook/' + id + '/comments')
            }
        })
    }
})

router.get('/:id/delete', csrfProtection, function (request, response) {
    const id = request.params.id
    const model = {
        id,
        csrfToken: request.csrfToken()
    }
    response.render('delete-entry.hbs', model)
})

router.post('/:id/delete', csrfProtection, function (request, response) {
    const errors = []

    if (!request.session.isLoggedIn) {
        errors.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    const id = request.params.id

    if (!validator.hasError(errors)) {
        db.deleteGuestbookEntryById(id, function (error) {
            if (error) {
                errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
                const model = {
                    id,
                    csrfToken: request.csrfToken(),
                    errors
                }
                response.render('delete-entry.hbs', model)

            }
            else {
                response.redirect('/guestbook')
            }
        })
    }
    else {
        const model = {
            id,
            csrfToken: request.csrfToken(),
            errors
        }
        response.render('delete-entry.hbs', model)
    }
})

router.post('/:id/update', csrfProtection, function (request, response) {
    const id = request.params.id
    const entry = request.body.entry
    const name = request.body.name
    const age = request.body.age
    const email = request.body.email
    const errors = validator.guestbook.getError(name, age, email, entry)

    if (!request.session.isLoggedIn) {
        errors.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    if (validator.hasError(errors)) {
        const model = {
            errors,
            id,
            csrfToken: request.csrfToken()
        }

        response.render('update-entry.hbs', model)
    }
    else {
        db.updateGuestbookEntry(entry, name, email, age, id, function (error) {
            if (error) {
                model.errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
                const model = {
                    errors,
                    id,
                    csrfToken: request.csrfToken()
                }
                response.render('update-entry.hbs', model)
            }
            else {
                response.redirect('/guestbook')
            }
        })
    }
})

module.exports = router
