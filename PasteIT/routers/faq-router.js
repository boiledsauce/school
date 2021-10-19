const express = require('express')
const router = express.Router()
const validator = require('../validators').validator
const errorType = require('../errorType').errorType
const db = require('../database')
const csrf = require('csurf')
const csrfProtection = csrf()

router.get('/', function (request, response) {
    db.getAllFaqs(function (error, faqs) {
        if (error) {
            const model =
            {
                hasDatabaseError: true,
                error,
                faqs: [],
                csrfToken: request.csrfToken()
            }

            response.render('faqs.hbs', model)
        }
        else {
            const model =
            {
                hasDatabaseError: false,
                faqs,
                csrfToken: request.csrfToken()
            }
            response.render('faqs.hbs', model)
        }
    })
})

router.get('/create', function (request, response) {
    response.render('create-faq.hbs', { csrfToken: request.csrfToken() })
})

router.post('/create', function (request, response) {
    const question = request.body.question
    const answer = request.body.answer
    const errors = validator.faq.getError(question, answer)

    if (!request.session.isLoggedIn) {
        errors.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    if (!validator.hasError(errors)) {
        db.createFaq(question, answer, function (error) {
            if (error) {
                errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
                const model =
                {
                    errors,
                    csrfToken: request.csrfToken()
                }
                response.render('create-faq.hbs', model)
            }
            else {
                const model = {
                    errors: [],
                    csrfToken: request.csrfToken()
                }
                response.redirect('/faqs')
            }
        })
    }
    else {
        const model =
        {
            errors,
            csrfToken: request.csrfToken()
        }
        response.render('create-faq.hbs', model)
    }
})

router.get('/:id/update', csrfProtection, function (request, response) {

    const id = request.params.id
    const errors = []
    const faq = null

    const model =
    {
        id,
        errors,
        faq,
        csrfToken: request.csrfToken()
    }

    if (!request.session.isLoggedIn) {
        model.error.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    db.getFaqById(id, function (error, faq) {
        if (error) {
            model.errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
        }
        else if (!faq) {
            model.errors.push(errorType.sql.CONTENT_DOES_NOT_EXIST)
        }
        else {
            model.faq = faq
        }
        response.render('update-faq.hbs', model)
    })
})

router.post('/:id/update', function (request, response) {

    const id = request.params.id
    const question = request.body.question
    const answer = request.body.answer

    const errors = validator.faq.getError(question, answer)

    if (!request.session.isLoggedIn) {
        errors.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    if (!validator.hasError(errors)) {
        db.updateFaqById(question, answer, id, function (error) {
            if (error) {
                errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
                const model = {
                    errors,
                    id,
                    csrfToken: request.csrfToken()
                }
                response.render('update-faq.hbs', model)
            }
            else {
                response.redirect('/faqs')
            }
        })
    }
    else {
        const model = {
            errors,
            question,
            answer,
            csrfToken: request.csrfToken(),
            id
        }
        response.render('update-faq.hbs', model)
    }

})

router.get('/:id/delete', function (request, response) {
    const id = request.params.id
    const error = []

    const model = {
        id,
        error,
        csrfToken: request.csrfToken()
    }

    db.getFaqById(id, function (error, faq) {
        if (error) {
            model.error.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
        }
        else if (!faq) {
            model.error.push(errorType.sql.CONTENT_DOES_NOT_EXIST)
        }

        response.render('delete-faq.hbs', model)
    })
})

router.post('/:id/delete', csrfProtection, function (request, response) {
    const id = request.params.id

    if (!request.session.isLoggedIn) {
        const error = []
        const model = {
            error,
            id,
            csrfToken: request.csrfToken()
        }

        error.push(errorType.session.SESSION_NOT_AUTHORIZED)
        response.render('delete-faq.hbs', model)
    }
    else {
        db.deleteFaqById(id, function (error) {
            if (error) {
                const model = {
                    errors,
                    csrfToken: request.csrfToken()
                }
                response.render('delete.hbs', model)
            }
            else {
                response.redirect('/faqs')
            }
        })
    }
})

module.exports = router