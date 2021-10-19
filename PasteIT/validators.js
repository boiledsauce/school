const validator = {

    hasError(error) {
        const emptyContainerLength = 0
        return error.length > emptyContainerLength
    },

    paste: {
        MIN_PASTE_NAME_LENGTH: 5,
        MAX_PASTE_NAME_LENGTH: 10,
        MIN_PASTE_LENGTH: 10,
        MAX_PASTE_LENGTH: 1000,

        getError(paste, nameOfPaste) {
            const errors = []
            if (paste.length < this.MIN_PASTE_LENGTH) {
                errors.push("The paste has to at least be " + this.MIN_PASTE_LENGTH + " letters long")
            }

            if (paste.length > this.MAX_PASTE_LENGTH) {
                errors.push("The paste has exceeded the limit of" + this.MAX_PASTE_LENGTH + " letters.")
            }

            if (nameOfPaste.length < this.MIN_PASTE_NAME_LENGTH) {
                errors.push("The name of the paste has to be at least " + this.MIN_PASTE_NAME_LENGTH + " letters long")
            }

            if (nameOfPaste.length > this.MAX_PASTE_NAME_LENGTH) {
                errors.push("The name of the paste exceeded the limit of " + this.MAX_PASTE_NAME_LENGTH + " letters.")
            }

            return errors
        }
    },

    login: {
        LOGIN_VALIDATION_ERROR: "You need to be logged in.",
        MIN_USERNAME_LENGTH: 4,
        MAX_USERNAME_LENGTH: 10,
        MIN_PASSWORD_LENGTH: 5,
        MAX_PASSWORD_LENGTH: 10,

        getError(username, password) {
            const errors = []

            if (username.length < this.MIN_USERNAME_LENGTH) {
                errors.push("The name needs to be at least " + this.MIN_USERNAME_LENGTH + " characters.")
            }

            if (password.length < this.MIN_PASSWORD_LENGTH) {
                errors.push("The password needs to be at least " + this.MIN_PASSWORD_LENGTH + " characters.")
            }

            if (username.length > this.MAX_USERNAME_LENGTH) {
                errors.push("The username can not be longer than " + this.MAX_USERNAME_LENGTH + " characters.")
            }

            if (password.length > this.MAX_PASSWORD_LENGTH) {
                errors.push("The password can not be longer than " + this.MAX_PASSWORD_LENGTH + " characters. ")
            }

            return errors
        }
    },

    faq: {
        MIN_QUESTION_LENGTH: 4,
        MAX_QUESTION_LENGTH: 25,
        MIN_ANSWER_LENGTH: 10,
        MAX_ANSWER_LENGTH: 40,

        getError(question, answer) {
            const errors = []

            if (question.length < this.MIN_QUESTION_LENGTH) {
                errors.push("The question needs to be at least " + this.MIN_QUESTION_LENGTH + " characters long.")
            }

            if (question.length > this.MAX_QUESTION_LENGTH) {
                errors.push("The question needs to be at maximum " + this.MAX_QUESTION_LENGTH + " characters.")
            }

            if (answer.length < this.MIN_ANSWER_LENGTH) {
                errors.push("The answer needs to be longer than " + this.MIN_ANSWER_LENGTH + " characters.")
            }

            if (answer.length > this.MAX_ANSWER_LENGTH) {
                errors.push("The answer can not be longer than " + this.MAX_ANSWER_LENGTH + " characters. ")
            }

            return errors
        }
    },

    guestbook: {
        MIN_NAME_LENGTH: 4,
        MAX_NAME_LENGTH: 20,
        MIN_AGE: 10,
        MAX_AGE: 120,
        EMAIL_MIN_LENGTH: 5,
        EMAIL_MAX_LENGTH: 40,
        EMAIL_AT_SYMBOL: '@',
        MIN_ENTRY_LENGTH: 3,
        MAX_ENTRY_LENGTH: 40,



        getError(name, age, email, entry) {
            const errors = []

            if (name.length < this.MIN_NAME_LENGTH) {
                errors.push("The name needs to be at minimum " + this.MIN_NAME_LENGTH + " letters long.")
            }

            if (name.length > this.MAX_NAME_LENGTH) {
                errors.push("The name can be no longer than " + this.MAX_NAME_LENGTH + " letters long.")
            }

            if (isNaN(age)) {
                errors.push("You need to enter a number")
            }
            else {
                if (age < this.MIN_AGE) {
                    errors.push("You are too young to post here. Insert an age above " + this.MIN_AGE + ".")
                }
                if (age > this.MAX_AGE) {
                    errors.push("You inserted an age too old. Insert a valid age under " + this.MAX_AGE + ".")
                }
            }

            // if it has no @ symbol it can not be an email
            if (email.includes(this.EMAIL_AT_SYMBOL)) {
                if (email.length < this.EMAIL_MIN_LENGTH) {
                    errors.push("Your email need to be at least" + this.EMAIL_MIN_LENGTH + "letters long.")
                }
                if (email.length > this.EMAIL_MAX_LENGTH) {
                    errors.push("Your email need to be at least " + this.EMAIL_MAX_LENGTH + ".")
                }
            }
            else {
                errors.push("The email entered is invalid.")
            }

            if (entry.length < this.MIN_ENTRY_LENGTH) {
                errors.push("Your entry needs to be at least " + this.MIN_ENTRY_LENGTH + " characters long.")
            }

            if (entry.length > this.MAX_ENTRY_LENGTH) {
                errors.push("Your entry needs to be at maximum " + this.MAX_ENTRY_LENGTH + " characters long.")
            }

            return errors
        }
    },

    comment: {
        MIN_NAME_LENGTH: 4,
        MAX_NAME_LENGTH: 10,
        MIN_AGE: 10,
        MAX_AGE: 120,
        MIN_COMMENT_LENGTH: 3,
        MAX_COMMENT_LENGTH: 30,



        getError(name, age, comment) {
            const errors = []

            if (name.length < this.MIN_NAME_LENGTH) {
                errors.push("The name needs to be at minimum " + this.MIN_NAME_LENGTH + " letters long.")
            }

            if (name.length > this.MAX_NAME_LENGTH) {
                errors.push("The name can be no longer than " + this.MAX_NAME_LENGTH + " letters long.")
            }

            if (isNaN(age)) {
                errors.push("You need to enter a number")
            }
            else {
                if (age < this.MIN_AGE) {
                    errors.push("You are too young to post here. Insert an age above " + this.MIN_AGE + ".")
                }
                if (age > this.MAX_AGE) {
                    errors.push("You inserted an age too old. Insert a valid age under " + this.MAX_AGE + ".")
                }
            }

            // if it has no @ symbol it can not be an email
            if (comment.length < this.MIN_COMMENT_LENGTH) {
                errors.push("Your comment needs to be at least " + this.MIN_COMMENT_LENGTH + " characters long.")
            }

            if (comment.length > this.MAX_COMMENT_LENGTH) {
                errors.push("Your comment needs to be at maximum " + this.MAX_COMMENT_LENGTH + " characters long.")
            }

            return errors
        }
    },

}

exports.validator = validator

