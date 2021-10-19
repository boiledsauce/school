const express = require('express')
const router = express.Router()
const validator = require('../validators').validator
const bcrypt = require('bcryptjs')
const csrf = require('csurf')
const csrfProtection = csrf()

const WRONG_USERNAME_OR_PASSWORD = "Wrong username or password"

const adminLoginDetails = {
  username: "admin",
  password: "$2a$10$YaZeUUZbHJm.A6eROE6wHOwElXi7DzK9fl8GSjbta0EKR.qq7Hxiq",

  isValidLogin(userInput, passInput) {
    return userInput == this.username && bcrypt.compareSync(passInput, this.password)
  }
}

router.get('/login', csrfProtection, function (request, response) {
  if (request.session.isLoggedIn) {
    response.redirect('/account_management')
  }
  else {

  
  response.render('login.hbs', { csrfToken: request.csrfToken() })
}
})

router.post('/login', csrfProtection, function (request, response) {
  const username = request.body.username
  const password = request.body.password

  const validationErrors = validator.login.getError(username, password);

  const model = {
    validationErrors,
    csrfToken: request.csrfToken()
  }

  if (!validator.hasError(validationErrors)) {
    if (adminLoginDetails.isValidLogin(username, password)) {
      request.session.isLoggedIn = true
      response.redirect('/account_management')
    }
    else {
      model.validationErrors.push(WRONG_USERNAME_OR_PASSWORD)
      response.render('login.hbs', model)
    }
  }
})

module.exports = router