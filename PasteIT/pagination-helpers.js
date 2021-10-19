const FIRST_PASTE_IX = 0
const LAST_PASTE_IX = 10

exports.getNextPageNumber = function (pageNumber) {
    const nextPageNumber = pageNumber + 1
    return nextPageNumber
}

exports.getPreviousPageNumber = function (pageNumber) {
    const previousPageNumber = pageNumber - 1
    return previousPageNumber
}


exports.getAllPastesButTheLast = function (pastes) {
    pastes = pastes.slice(FIRST_PASTE_IX, LAST_PASTE_IX)
    return pastes
}

exports.hasMorePages = function (pasteAmount, maxPastesPerPage) {
    return pasteAmount > maxPastesPerPage
}

exports.getFirstPasteIxFromPage = function (currentPageNumber, maxPastesPerPage) {
    // page 1 == 1-1 * 10 == 0 <==> firstIx = 0
    const onePageNumberLess = currentPageNumber - 1
    const resultStartIx = onePageNumberLess * maxPastesPerPage
    return resultStartIx
}

exports.getLastPasteIxPlusOneFromPage = function (maxPastesPerPage, currentPageNumber) {
    // We need to retrieve one more result than max pastes allowed.
    const lastIx = (currentPageNumber * maxPastesPerPage) + 1
    return lastIx
}

