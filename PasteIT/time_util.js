const oneSecondInMs = 1000
const LEGAL_JS_DATESTRING = "YYYY-MM-DDTHH:mm:ss"
const LEGAL_JS_DATESTRING_LENGTHS = [4, 7, 10, 13, 16, 19]

exports.getCurUnixTime = function () {
    const currentTimeInMs = new Date().getTime()
    const currentTimeInSeconds = currentTimeInMs / oneSecondInMs

    return Math.round(currentTimeInSeconds)
}

function getUnixTimeFromDate(date) {
    const dateTimeInMs = date.getTime()
    const dateConvertedToSeconds = dateTimeInMs / oneSecondInMs

    return Math.round(dateConvertedToSeconds)
}

function isLegalDateString(dateString, legalStringLengths) {
    for (const legalStringLength of legalStringLengths) {
        // if it has a length that is compatible i.e (YYYY (4 characters) or YYYY-MM (7 characters))
        if (dateString.length == legalStringLength) {
            return true
        }
    }
    return false
}

function isANumber(potentialNumber) {
    return !isNaN(potentialNumber)
}

// When user inputs two dates to compare from the search function - 
// what distinguish those from eachother is ONE space
// Example: 2012-02-23 2015-05-27
exports.getEachDateStringFromString = function (dateString) {

    const firstCharIx = 0
    const spaceChar = ' '
    const lengthOfString = dateString.length
    for (let i = 0; i < lengthOfString; i++) {
        // if it contains a space, it means that we are comparing two input strings
        if (dateString[i] == spaceChar) {
            const firstPart = dateString.substring(firstCharIx, i)
            // skip the space with ++i
            const secondPart = dateString.substring(++i, lengthOfString)
            return { first: firstPart, second: secondPart }
        }
    }
    return { first: dateString }
}

const SINGLE_DATESTRING_IN_CONTAINER = 1
exports.isSingleDateString = function (dateStringContainer) {
    return dateStringContainer.length == SINGLE_DATESTRING_IN_CONTAINER
}

exports.secondDateExist = function (searchDateStrings) {
    const secondObjectKey = "second"
    const secondDateExists = secondObjectKey in searchDateStrings
    return secondDateExists
}

const dateStringErrors = {
    DELIMITER_IS_A_NUMBER: "The separator between the date has to be a delimiter such as '-' or '/'",
    ILLEGAL_STRING_FORMAT: "The string entered has to be of a proper structure. E.g 2020-02-09T20:50"
}


function isIteratorAtDelimiterPos(iterator, delimiterPos) {
    return iterator == delimiterPos
}

function getProperJavaScriptDateFormatDelimiter(javaScriptProperDelimiter) {
    dateStrCurDelimiterChar = JavaScriptProperDelimiter
}

// If the dates return value is not an dateStringError, then it is a valid unixTime and no errorstring 
exports.isADateStringError = function (returnValue) {
    for (const errorKey in dateStringErrors) {
        const error = dateStringErrors[errorKey]
        if (returnValue == error) {
            return true
        }
    }
    return false
}

// JavaScript date legal format  YYYY-MM-DD[T]HH:mm:ss   => length of the string have to be either of : 
// {4, 7, 10, 13, 16, 19} lengths
// it should only contain numbers except for the separating characters T or - or :
// We have to add the T since that will be where the user enters a space, in order to
// search between two dates. It is what separates the strings
exports.getUnixTimeFromDateStr = function (dateString) {
    let curDelimiterIx = 0
    const lengthOfString = dateString.length

    if (isLegalDateString(dateString, LEGAL_JS_DATESTRING_LENGTHS)) {
        for (let i = 0; i < lengthOfString; i++) {
            if (isIteratorAtDelimiterPos(i, LEGAL_JS_DATESTRING_LENGTHS[curDelimiterIx])) {
                const currentChar = dateString[i]
                if (isANumber(currentChar)) {
                    return dateStringErrors.DELIMITER_IS_A_NUMBER
                }
                // We know it is a delimiter, but not WHICH delimiter, and we want to swap it to a JS-DateObj legal delimiter.
                dateString[i] = LEGAL_JS_DATESTRING[i]
                curDelimiterIx++
            }
            // We are at a non-delimiter pos and it should contain a number - but it doesnt (198Q is not a legit year)
            else if (!isANumber(dateString[i])) {
                return dateStringErrors.ILLEGAL_STRING_FORMAT
            }
        }
        // No error so the string is deemed valid, we can now convert it to unix time indirectly using JS library
        const searchDate = new Date(dateString)
        const unixTimeOfSearchDate = getUnixTimeFromDate(searchDate)

        return unixTimeOfSearchDate
    }
    return dateStringErrors.ILLEGAL_STRING_FORMAT
}

