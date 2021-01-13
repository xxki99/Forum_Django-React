const baseUrl = "http://localhost:8000/"

function getUrl(url){
    
    return url.replace(baseUrl, "")
}

export {getUrl}

