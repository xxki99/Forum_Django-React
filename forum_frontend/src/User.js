import React, { Component } from "react"
import Cookies from 'universal-cookie'
import $ from "jquery"

const userIconStyle = {
    fontSize: "1.60em",
}

class UserLogin extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loginUrl: "/api/auth/token/",
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
        const { loginUrl, username, password } = this.state
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
    const {username} = userprofileData
    return (
        <div className="">
            <button type="button" className="btn p-0 pt-1" data-toggle="modal" data-target="#userProfileModal">
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
                            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={()=>{logout()}}>Logout</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

class UserEntry extends Component {

    render() {
        const {userData, verifyLogin, logout} = this.props
        const { isLogin } = userData
        if (isLogin) {
            const {userprofileData} = userData
            return (
                <UserProfile userprofileData={userprofileData} logout={logout} />
            )
        }
        else {
            return (
                <UserLogin verifyLogin={verifyLogin} />
            )
        }

    }
}

export default UserEntry
