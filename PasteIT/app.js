const express = require('express')
const expressHandlebars = require('express-handlebars')
const expressSession = require('express-session')
const httpStatus = require('http-status-codes')
const csrf = require('csurf')
const csrfProtection = csrf()
const connectSqlite3 = require('connect-sqlite3')
const SQLiteStore = connectSqlite3(expressSession)
const authRouter = require('./routers/auth-router')
const pasteRouter = require('./routers/paste-router')
const faqRouter = require('./routers/faq-router')
const guestbookRouter = require('./routers/guestbook-router')
const app = express()
const employees = require('./employees').employees

app.use(express.urlencoded({
	extended: false
}))

app.engine('hbs', expressHandlebars({
	defaultLayout: 'main.hbs'
}))

app.use(expressSession({
	secret: "asdsasdadsasdasdasds",
	store: new SQLiteStore({ db: "session-db.db" }),
	saveUninitialized: false,
	resave: false,
}))

app.use(function (request, response, next) {
	response.locals.session = request.session
	next()
})

app.use(csrfProtection)

app.get('/form', csrfProtection, function (request, response) {
	res.render('send', { csrfToken: request.csrfToken() })
})

app.use('/auth', authRouter)
app.use('/pastes', pasteRouter)
app.use('/faqs', faqRouter)
app.use('/guestbook', guestbookRouter)

app.get('/', function (request, response) {
	response.render('start.hbs')
})

app.get('/about', function (request, response) {
	response.render('about.hbs')
})

app.get('/contact', function (request, response) {
	const model = {
		employees
	}
	response.render('contact.hbs', model)
})

app.get('/account_management', function (request, response) {
	response.render('account_management.hbs')
})

app.get('*', function (request, response) {
	response.sendStatus(httpStatus.StatusCodes.NOT_FOUND)
})

app.listen(8080)