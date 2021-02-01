const baseUrl = "http://localhost:8000";

function getUrl(url) {
    return url.replace(baseUrl, "");
}

function getPostId(postUrl) {
    const temp = postUrl.split("/");
    return temp[temp.length - 2];
}

export { getUrl, getPostId };
