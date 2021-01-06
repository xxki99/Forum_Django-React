const baseUrl = "http://localhost:8000"

function getUrl(absUrl){
    const relativeUrl = absUrl.replace(baseUrl, "")
    return relativeUrl
}

export {getUrl}
