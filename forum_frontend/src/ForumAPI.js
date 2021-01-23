import { getUrl } from "./UrlTools"
import Cookies from "universal-cookie"

// global variables
const verifyLoginUrl = getUrl("/api/auth/token/")
const threadNavDataUrl = getUrl("/api/forum/threads/")
const writePostUrl = getUrl("/api/forum/posts/")
const writeCommentUrl = getUrl("/api/forum/comment/")
const userUrl = getUrl("/api/forum/users/")

const loginUrl = getUrl("/api/auth/token/")

// helper functions
function getAuthHeaders() {
    const cookies = new Cookies()
    const token = cookies.get("token")
    if (token === undefined) {
        throw new Error("No token")
    }
    return {
        "Accept": "application/json",
        "Authorization": `Token ${token}`
    }
}

async function fetchData(url, method = "GET", headers = undefined, bodyObj = undefined) {
    var defaultHeaders = {
        "Accept": "application/json"
    }
    if (headers !== undefined) {
        defaultHeaders = headers
    }
    var requestObj = {
        method: method,
        headers: defaultHeaders
    }
    if (bodyObj !== undefined) {
        requestObj = {
            ...requestObj, body: JSON.stringify(bodyObj)
        }
    }
    try {
        const response = await fetch(url, requestObj)
        if (response.ok) {
            const data = await response.json()
            return data
        }
        else {
            const data = await response.json()
            console.log(data)
            throw new Error(response.status)
        }
    }
    catch (error) {
        throw new Error(error)
    }
}


// api function
async function getUserLoginState() {
    try {
        try {
            const headers = getAuthHeaders()
            const data = await fetchData(verifyLoginUrl, "GET", headers)
            return {
                isLogin: true,
                userData: data
            }
        }
        catch (error) {
            throw new Error(error)
        }


    }
    catch (error) {
        throw new Error(error)
    }

}

async function getThreadsList() {
    try {
        const data = await fetchData(threadNavDataUrl)
        const returnValue = []
        data.forEach(element=>{
            const newElement = {
                name: element.name, 
                url: getUrl(element.url)
            }
            returnValue.push(newElement)
        })
        return returnValue
    }
    catch (error) {
        throw new Error(error)
    }


}

async function getPostDetailData(postUrl) {
    try {
        const data = await fetchData(postUrl)
        return data
    }
    catch (error) {
        throw new Error(error)
    }

}

async function getThreadDetailData(threadUrl) {
    try {
        const data = await fetchData(threadUrl)
        return data
    }
    catch (error) {
        throw new Error(error)
    }
}

async function writePost(threadUrl, title, content) {
    try {
        try {
            const headers = {...getAuthHeaders(), "Content-Type": "application/json"}
            const bodyObj = {
                title: title, 
                content: content, 
                thread: threadUrl
            }
            const data = await fetchData(writePostUrl, "POST", headers, bodyObj)
            return data
        }
        catch (error) {
            throw new Error(error)
        }
    }
    catch (error) {
        throw new Error(error)
    }
}

async function writeComment(postUrl, content){
    try{
        try{
            const headers = {...getAuthHeaders(), "Content-Type": "application/json"}
            const bodyObj = {
                post: postUrl, 
                content: content, 
            }
            const data = await fetchData(writeCommentUrl, "POST", headers, bodyObj)
            return data
        }
        catch(error){
            throw new Error(error)
        }
    }
    catch(error){
        throw new Error(error)
    }
}

async function login(username, password) {
    const bodyObj = {
        username: username,
        password: password,
    }
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    try {
        const data = await fetchData(loginUrl, "POST", headers, bodyObj)
        const cookies = new Cookies()
        cookies.set("token", data.token)
        return data
    }
    catch (error) {
        throw new Error(error)
    }

}

async function signup(username, password, email){
    const bodyObj = {
        username: username, 
        password: password, 
        email: email, 
    }
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
    try {
        const data = await fetchData(userUrl, "POST", headers, bodyObj)

        return data
    }
    catch(error){
        throw new Error(error)
    }
}

export { getUserLoginState, getThreadsList, getPostDetailData, getThreadDetailData, login, writePost, writeComment, signup }
