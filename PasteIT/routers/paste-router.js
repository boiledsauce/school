const express = require('express')
const router = express.Router()
const validator = require('../validators').validator
const errorType = require('../errorType').errorType
const db = require('../database')
const paginationHelpers = require('../pagination-helpers')
const timeUtil = require('../time_util')
const paginate = require('express-paginate')
const csrf = require('csurf')
const csrfProtection = csrf()


const LIMIT_QUERY_PER_PAGE = 10
const MAX_RESULTS = 10 // unused - implemented pagination with only the help of the first parameter
router.use(paginate.middleware(LIMIT_QUERY_PER_PAGE, MAX_RESULTS))

router.get('/search', function (request, response) {

    const searchString = request.query.search
    const searchDateStrings = timeUtil.getEachDateStringFromString(searchString)
    const secondDateExists = timeUtil.secondDateExist(searchDateStrings)

    const searchInUnixTime = timeUtil.getUnixTimeFromDateStr(searchDateStrings.first)
    let searchInUnixTimeCompare = timeUtil.getCurUnixTime()

    if (secondDateExists) {
        searchInUnixTimeCompare = timeUtil.getUnixTimeFromDateStr(searchDateStrings.second)
    }

    if (timeUtil.isADateStringError(searchInUnixTime)) {
        const model = {
            errors: [searchInUnixTime],
            pastes: []
        }

        if (secondDateExists && timeUtil.isADateStringError(searchInUnixTimeCompare)) {
            model.errors.push(searchInUnixTimeCompare)
        }
        response.render('pastes.hbs', model)
        return
    }

    db.getAllPastesByDate(searchInUnixTime, searchInUnixTimeCompare, function (error, pastes) {
        if (error) {
            const model = {
                hasDatabaseError: true,
                pastes: []
            }
            response.render('pastes.hbs', model)
        }
        else {
            const model =
            {
                hasDatabaseError: false,
                pastes
            }
            response.render('pastes.hbs', model)
        }
    })
})

router.get('/', csrfProtection, function (request, response) {
    const currentPageNumber = request.query.page
    const limitOfResultsPerPage = request.query.limit
    const resultStartIx = paginationHelpers.getFirstPasteIxFromPage(currentPageNumber, limitOfResultsPerPage)
    const resultEndPlusOneIx = paginationHelpers.getLastPasteIxPlusOneFromPage(limitOfResultsPerPage, limitOfResultsPerPage)

    db.getPastesFromIdRange(resultStartIx, resultEndPlusOneIx, function (error, pastes, lastRowId) {

        if (error) {
            const model =
            {
                hasDatabaseError: true,
                error,
                pastes: [],
                csrfToken: request.csrfToken()
            }
            response.render('pastes.hbs', model)
        }
        else {
            const pasteAmountRetrievedFromDb = pastes.length
            const morePagesExist = paginationHelpers.hasMorePages(pasteAmountRetrievedFromDb, limitOfResultsPerPage)
            const nextPage = paginationHelpers.getNextPageNumber(currentPageNumber)
            const prevPage = paginationHelpers.getPreviousPageNumber(currentPageNumber)
            // all pastes that should be rendered in the view (10 results not 11)
            pastes = paginationHelpers.getAllPastesButTheLast(pastes)

            const model = {
                hasDatabaseError: false,
                pastes,
                nextPage,
                prevPage,
                morePagesExist,
                csrfToken: request.csrfToken()
            }
            response.render('pastes.hbs', model)
        }
    })
})

router.post('/create', csrfProtection, function (request, response) {

    const textContent = request.body.paste
    const nameOfText = request.body.name
    const unixTimeStamp = timeUtil.getCurUnixTime()
    const errors = validator.paste.getError(textContent, nameOfText)

    if (!validator.hasError(errors)) {
        const values = [nameOfText, textContent, unixTimeStamp]

        db.createPaste(nameOfText, textContent, unixTimeStamp, function (error, pasteID) {
            if (error) {
                errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
                const model =
                {
                    errors,
                    csrfToken: request.csrfToken()
                }

                response.render('create-paste.hbs', model)
            }
            else {
                const id = pasteID
                response.redirect('/pastes/' + id)
            }
        })
    }
    else {
        const model =
        {
            errors,
            csrfToken: request.csrfToken()
        }
        response.render('create-paste.hbs', model)
    }
})

router.post('/:id/delete', csrfProtection, function (request, response) {
    const id = request.params.id
    if (!request.session.isLoggedIn) {
        const errors = []
        const model =
        {
            id,
            errors,
            csrfToken: request.csrfToken()
        }

        model.errors.push(errorType.session.SESSION_NOT_AUTHORIZED)
        response.render('delete-paste.hbs', model)
        return
    }

    db.deletePasteById(id, function (error) {
        if (error) {
            errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
            const model =
            {
                errors,
                csrfToken: request.csrfToken()
            }
            response.render('delete-paste.hbs', model)
        }
        else {
            response.redirect('/pastes')
        }
    })
})

router.post('/:id/update', csrfProtection, function (request, response) {

    const id = request.params.id
    const pasteName = request.body.name
    const post = request.body.post
    const errors = validator.paste.getError(post, pasteName)

    if (!request.session.isLoggedIn) {
        errors.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    if (!validator.hasError(errors)) {
        db.updatePasteById(post, pasteName, id, function (error) {
            if (error) {
                const model = {
                    errors: errorType.sql.SERVER_CANT_PROCESS_REQUEST,
                    post: [],
                    id,
                    pasteName,
                    csrfToken: request.csrfToken()
                }
                response.render('update-paste.hbs', model)
            }
            else {
                response.redirect('/pastes/' + id)
            }
        })
    }
    else {
        const model = {
            errors,
            post,
            id,
            pasteName,
            csrfToken: request.csrfToken()
        }
        response.render('update-paste.hbs', model)
    }
})

router.get('/:id/update', csrfProtection, function (request, response) {

    const id = request.params.id
    const error = []
    const paste = null

    const model = {
        id,
        error,
        paste,
        csrfToken: request.csrfToken()
    }

    if (!request.session.isLoggedIn) {
        model.error.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    db.getPasteById(id, function (error, paste) {
        if (error) {
            model.error.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
        }
        else if (!paste) {
            model.error.push(errorType.sql.CONTENT_DOES_NOT_EXIST)
        }
        else {
            model.paste = paste
        }
        response.render('update-paste.hbs', model)
    })
})

router.get('/:id/update', csrfProtection, function (request, response) {

    const id = request.params.id
    const error = []
    const paste = null

    const model = {
        id,
        error,
        paste,
        csrfToken: request.csrfToken()
    }

    if (!request.session.isLoggedIn) {
        model.error.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    db.getPasteById(id, function (error, paste) {
        if (error) {
            model.error.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
        }
        else if (!paste) {
            model.error.push(errorType.sql.CONTENT_DOES_NOT_EXIST)
        }
        else {
            model.paste = paste
        }

        response.render('update-paste.hbs', model)
    })
})

router.get('/:id/delete', csrfProtection, function (request, response) {
    const id = request.params.id
    const errors = []

    const model =
    {
        id,
        errors,
        csrfToken: request.csrfToken()
    }

    if (!request.session.isLoggedIn) {
        model.errors.push(errorType.session.SESSION_NOT_AUTHORIZED)
    }

    if (!validator.hasError(errors)) {
        db.getPasteById(id, function (error, row) {
            if (error) {
                model.errors.push(errorType.sql.SERVER_CANT_PROCESS_REQUEST)
            }
            else if (!row) {
                model.errors.push(errorType.sql.CONTENT_DOES_NOT_EXIST)
            }
            response.render('delete-paste.hbs', model)
        })
    }
    else {
        response.render('delete-paste.hbs', model)
    }
})

router.get('/create', csrfProtection, function (request, response) {
    response.render('create-paste.hbs', { csrfToken: request.csrfToken() })
})

router.get('/:id', csrfProtection, function (request, response) {
    const id = request.params.id

    db.getPasteById(id, function (error, paste) {
        if (error) {
            const model = {
                error: errorType.sql.SERVER_CANT_PROCESS_REQUEST,
                paste: []
            }
            response.render('paste.hbs', model)
        }
        else {
            const model = {
                paste
            }
            response.render('paste.hbs', model)
        }
    })
})

module.exports = router