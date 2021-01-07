import React, { Component } from "react"
import Cookies from 'universal-cookie'
import $ from "jquery"
import {getUrl} from "./UrlTools"

const userIconStyle = {
    fontSize: "1.55em",
}

const loginUrl = "/api/auth/token/"
const writePostUrl = "/api/forum/posts/"

class UserLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: ""
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.login = this.submitLoginForm.bind(this)
    }

    postLoginDataToBackend = (url, body) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then((response) => {
                const status = response.status
                response.json()
                    .then((data) => {
                        return this.performLogin(status, data)
                    })
            })
        this.setState({
            username: "",
            password: ""
        })
    }

    performLogin(status, data) {
        if (status === 200) {
            const cookies = new Cookies()
            cookies.set("token", "Token " + data.token)
            $("#loginModal").modal("hide")
            this.props.verifyLogin()
        }
    }

    submitLoginForm = (event) => {
        const { username, password } = this.state
        const bodyObj = {
            username: username,
            password: password
        }

        this.postLoginDataToBackend(loginUrl, bodyObj)

        return false
    }

    handleUsernameChange(event) {
        this.setState(
            {
                username: event.target.value
            }
        )
    }

    handlePasswordChange(event) {
        this.setState(
            {
                password: event.target.value
            }
        )
    }

    render() {


        return (
            <div className="">
                <button type="button" className="btn p-0 pt-1" data-toggle="modal" data-target="#loginModal">
                    <i className="fas fa-user-secret" style={userIconStyle}></i>
                </button>
                <div className="modal fade" id="loginModal" tabIndex="-1" role="dialog" aria-labelledby="loginModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="LoginModelLabel">User Login</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <label htmlFor="UsernameInput" className="form-label">Username:</label>
                                <div className="input-group">
                                    <input type="text" className="form-control" id="UsernameInput" placeholder="Username" aria-label="Username" onChange={this.handleUsernameChange} />
                                </div>

                                <label htmlFor="PasswordInput" className="form-label">Password</label>
                                <div className="input-group">
                                    <input type="password" className="form-control" id="PasswordInput" placeholder="Password" aria-label="Password" onChange={this.handlePasswordChange} />
                                </div>



                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.submitLoginForm}>Login</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function UserProfile(props) {
    const { userprofileData, logout } = props
    const { username } = userprofileData
    return (
        <div className="">
            <button type="button" className="btn p-0" data-toggle="modal" data-target="#userProfileModal">
                <i className="fas fa-user-check" style={userIconStyle}></i>
            </button>

            <div className="modal fade" id="userProfileModal" tabIndex="-1" role="dialog" aria-labelledby="userProfileModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="userProfileModelLabel">{username}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            User info here


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => { logout() }}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

class UserWritePost extends Component {
    constructor(props) {
        super(props)

        this.state = {
            title: "",
            content: "",
            thread: ""
        }

        this.handleChange_title = this.handleChange_title.bind(this)
        this.handleChange_content = this.handleChange_content.bind(this)
        this.handleChange_thread = this.handleChange_thread.bind(this)
        this.toggleWritePostModel = this.toggleWritePostModel.bind(this)
        this.performWritePost = this.performWritePost.bind(this)
    }

    handleChange_title(e) {
        this.setState(
            {
                title: e.target.value
            }
        )
    }

    handleChange_content(e) {
        this.setState(
            {
                content: e.target.value
            }
        )
    }

    performWritePost() {
        const { title, content, thread } = this.state
        const cookies = new Cookies()
        const token = cookies.get("token")
        const bodyObj = {
            title: title, 
            content: content, 
            thread: thread
        }
        fetch(writePostUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify(bodyObj)
            }
        )
            .then(response => response.json())
            .then((responseData) => {
                console.log(responseData)
            })
        }

    handleChange_thread(e) {
        const thread = getUrl(e.target.value)
        this.setState(
            {
                thread: thread
            }
        )
    }

    componentDidMount(){
        const {currentThreadUrl} = this.props

        this.setState({
            thread: getUrl(currentThreadUrl)
        })
    }

    // call this function to toggle the modal and initialize it
    toggleWritePostModel(){
        // update the thread when the modal is toggled
        const relativeThreadUrl = getUrl(this.props.currentThreadUrl)
        this.setState(
            {
                thread: relativeThreadUrl
            }
        )

        // toggle
        $("#writePostModal").modal("toggle")
    }

    render() {
        const { thread_set, currentThreadUrl } = this.props
        var relativeThreadUrl = ""
        if (currentThreadUrl){
            relativeThreadUrl = getUrl(currentThreadUrl)
        }
        else{
            relativeThreadUrl = ""
        }

        const threadsDropDown = thread_set.map((thread, index) => {
            
            if (getUrl(thread.url) === relativeThreadUrl){
                return (
                    <option selected value={thread.url}>{thread.name}</option>
                )
            }
            else return (
                <option value={thread.url}>{thread.name}</option>
            )
        })

        return (
            <div>
                <button type="button" className="btn p-0" onClick={this.toggleWritePostModel} >
                    <i className="fas fa-plus" style={userIconStyle}></i>
                </button>

                <div className="modal fade" id="writePostModal" tabIndex="-1" role="dialog" aria-labelledby="writePostModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="writePostModelLabel">Write a new post</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <label htmlFor="postTitleInput" className="form-label">Title: </label>
                                <div className="input-group">
                                    <input type="text" className="form-control" id="postTitleInput" placeholder="Title" aria-label="Title"
                                        onChange={this.handleChange_title} />
                                </div>

                                <label htmlFor="contentInput" className="form-label">Content: </label>
                                <div className="input-group">
                                    <textarea className="form-control" id="contentInput" aria-label="Content"
                                        onChange={this.handleChange_content} />
                                </div>

                                <select class="form-select" aria-label="thread select" onChange={this.handleChange_thread}>
                                    {threadsDropDown}
                                </select>



                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.performWritePost}>Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        )
    }
}

class UserPanel extends Component {

    render() {
        const { userData, thread_set, verifyLogin, logout, currentThreadUrl } = this.props
        const { isLogin } = userData
        if (isLogin) {
            const { userprofileData } = userData
            return (
                <div className="d-flex mt-1">
                    <div>
                        <UserProfile userprofileData={userprofileData} logout={logout} />
                    </div>
                    <div className="ml-3">
                        <UserWritePost thread_set={thread_set} currentThreadUrl={currentThreadUrl} />
                    </div>
                </div>
            )
        }
        else {
            return (
                <UserLogin verifyLogin={verifyLogin} />
            )
        }

    }
}

export default UserPanel
