import React, { Component } from "react"
import Cookies from 'universal-cookie'
import bootstrap from "bootstrap"
import $ from "jquery"
import { getUrl } from "./UrlTools"
import { TextInput } from "./InputComponents"

const userIconStyle = {
    fontSize: "1.55em",
}

const loginUrl = "/api/auth/token/"
const signupUrl = "/api/forum/users/"
const writePostUrl = "/api/forum/posts/"
const signupModalID = "signupModal"
const loginModalID = "loginModal"

class UserLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
            errorText: {
                username: "",
                password: ""
            },
        }

        this.handleUsernameChange = this.handleUsernameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.submitLoginForm = this.submitLoginForm.bind(this)
        this.toggleLoginModal = this.toggleLoginModal.bind(this)
        this.toggleSignupModal = this.toggleSignupModal.bind(this)
        this.resetInput = this.resetInput.bind(this)
    }

    usernameInputID = "usernameInput"
    passwordInputID = "passwordInput"

    resetInput(){
        $("#" + this.usernameInputID).val("")
        $("#" + this.passwordInputID).val("")
        this.setState(
            {
                username: "", 
                password: "", 
            }
        )
    }

    submitLoginForm(event) {
        const { username, password } = this.state
        const bodyObj = {
            username: username,
            password: password
        }

        fetch(getUrl(loginUrl), {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bodyObj)
        })
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((responseData) => {
                            console.log(responseData)
                            const cookies = new Cookies()
                            cookies.set("token", "Token " + responseData.token)
                            $("#" + loginModalID).modal("hide")
                            this.props.verifyLogin()
                        })
                }
                else {
                    response.json().then((responseData) => {
                        console.log(responseData)

                        this.setState(
                            {
                                errorText: responseData
                            }
                        )


                    })
                }
                this.resetInput()
            })
    }

    toggleLoginModal(){
        $("#" + loginModalID).modal("toggle")
    }

    toggleSignupModal() {
        $("#" + loginModalID).modal("hide")
        $("#" + signupModalID).modal("toggle")
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
        const { errorText } = this.state
        return (
            <div className="">
                <button type="button" className="btn p-0 pt-1" onClick={this.toggleLoginModal}>
                    <i className="fas fa-user-secret" style={userIconStyle}></i>
                </button>
                <div className="modal fade" id={loginModalID} tabIndex="-1" role="dialog" aria-labelledby="loginModal" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="LoginModelLabel">User Login</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <div>
                                    <small className="text-danger">{errorText.non_field_errors}</small>
                                </div>

                                < TextInput id={this.usernameInputID} labelText="Username:" type="text" placeholder="Username"
                                    handleChange={this.handleUsernameChange} errorText={errorText.username} />

                                < TextInput id={this.passwordInputID} labelText="Password:" type="password" placeholder="Password"
                                    handleChange={this.handlePasswordChange} errorText={errorText.password} />

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={this.submitLoginForm}>Login</button>
                                <button type="button" className="btn btn-primary" onClick={this.toggleSignupModal} >Sign-up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

class UserSignup extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: "",
            password: "",
            email: "",
            confirmPassword: "",
            errorText: {
                non_field_errors: "",
                username: "",
                password: "",
                email: "",
                confirmPassword: ""
            },
        }

        this.handleChange_username = this.handleChange_username.bind(this)
        this.handleChange_password = this.handleChange_password.bind(this)
        this.handleChange_email = this.handleChange_email.bind(this)
        this.handleChange_confirmPassword = this.handleChange_confirmPassword.bind(this)
        this.handleSignup = this.handleSignup.bind(this)
        this.resetInput = this.resetInput.bind(this)
        this.checkValidInput = this.checkValidInput.bind(this)

    }

    emailInputID = "emailInput_signup"
    usernameInputID = "usernameInput_signup"
    passwordInputID = "passwordInput_signup"
    confirmPasswordInputID = "confirmPasswordInput_signup"
    inputList = [this.emailInputID, this.usernameInputID, this.passwordInputID, this.confirmPasswordInputID]

    resetInput(){
        this.inputList.forEach((e)=>{
            $("#" + e).val("")
        })
        this.setState(
            {
                username: "", 
                password: "", 
                confirmPassword: "", 
                email: "", 
            }
        )
    }

    handleChange_username(e) {
        this.setState(
            {
                username: e.target.value
            }
        )
    }

    handleChange_email(e) {
        this.setState(
            {
                email: e.target.value
            }
        )
    }

    handleChange_password(e) {
        this.setState(
            {
                password: e.target.value
            }
        )
    }

    handleChange_confirmPassword(e) {
        this.setState(
            {
                confirmPassword: e.target.value
            }
        )
    }

    dismissSignupModal() {
        $("#" + signupModalID).modal("hide")
    }

    checkValidInput() {
        const { email, username, password, confirmPassword } = this.state
        console.log("checking signup input valid")

        var returnValue = {
            isValid: true,
            errorText: {
                non_field_errors: "",
                email: "",
                username: "",
                password: "",
                confirmPassword: "",
            }
        }

        // checking confirm password
        if (password !== confirmPassword) {
            returnValue.isValid = false
            returnValue.errorText.confirmPassword = "Password do not match."
        }

        // checking email
        if (!email.includes("@")) {
            returnValue.isValid = false
            returnValue.errorText.email = "Email must include @."
        }

        return returnValue
    }

    handleSignup() {
        const { email, username, password } = this.state
        const { verifyLogin } = this.props

        // custom validation
        // check for confirm password
        const checkValidObj = this.checkValidInput()

        if (checkValidObj.isValid) {
            const bodyObj = {
                username: username,
                password: password,
                email: email,
            }

            fetch(signupUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bodyObj)
            })
                .then((response) => {
                    if (response.ok) {
                        response.json()
                            .then((responseData) => {
                                this.dismissSignupModal()
                            })
                            .then(() => {
                                // login, will be changed in the future (create a login function in parent component and pass down to UserLogin and UserSignup)
                                const loginBodyObj = {
                                    username: username,
                                    password: password
                                }
                                fetch(getUrl(loginUrl), {
                                    method: "POST",
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(loginBodyObj)
                                })
                                    .then((response) => {
                                        if (response.ok) {
                                            response.json()
                                                .then((responseData) => {
                                                    const cookies = new Cookies()
                                                    cookies.set("token", "Token " + responseData.token)
                                                    verifyLogin()
                                                    this.dismissSignupModal()
                                                })
                                        }
                                        else {
                                            console.log("login after signup error")
                                        }
                                    })
                            })
                    }
                    else {
                        response.json()
                            .then((errorData) => {
                                this.setState(
                                    {
                                        errorText: errorData
                                    }
                                )
                            })
                    }
                    this.resetInput()
                })

        }
        else {  // handle invalid input
            this.setState({
                errorText: checkValidObj.errorText
            })
        }
    }



    render() {
        const { errorText } = this.state
        return (
            <div className="modal fade" id="signupModal" tabIndex="-1" role="dialog" aria-labelledby={signupModalID} aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="userProfileModelLabel">Sign up</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <p className="text-danger">
                                    {errorText.non_field_errors}
                                </p>
                            </div>

                            <TextInput id={this.emailInputID} labelText="Email:" type="text" placeholder="Email"
                                errorText={errorText.email} handleChange={this.handleChange_email} />
                            <TextInput id={this.usernameInputID} labelText="Username:" type="text" placeholder="Username"
                                errorText={errorText.username} handleChange={this.handleChange_username} />
                            <TextInput id={this.passwordInputID} labelText="Password:" type="password" placeholder="Password"
                                errorText={errorText.password} password handleChange={this.handleChange_password} />
                            <TextInput id={this.confirmPasswordInputID} labelText="Confirm your password:" type="password" placeholder="Password"
                                errorText={errorText.confirmPassword} confirmPassword handleChange={this.handleChange_confirmPassword} />


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={this.handleSignup} >Signup</button>
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

function ThreadDropDown(props) {
    const { thread_set, currentThread, handleChange } = props
    const options = thread_set.map((thread, index) => {
        return (
            <option value={getUrl(thread.url)} key={index}>{thread.name}</option>
        )
    })
    return (
        <select value={currentThread} onChange={handleChange}>
            {options}
        </select>
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
        console.log(thread)
        this.setState(
            {
                thread: thread
            }
        )
    }

    // call this function to toggle the modal and initialize it
    toggleWritePostModel() {
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

    componentDidMount() {
        const { currentThreadUrl } = this.props

        this.setState({
            thread: getUrl(currentThreadUrl)
        })
    }



    render() {
        const { thread_set } = this.props

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

                                <div className="pt-1">
                                    <ThreadDropDown thread_set={thread_set} currentThread={this.state.thread} handleChange={this.handleChange_thread} />
                                </div>



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
                <div>
                    <UserLogin verifyLogin={verifyLogin} />
                    <UserSignup verifyLogin={verifyLogin} />
                </div>
            )
        }

    }
}

export default UserPanel
