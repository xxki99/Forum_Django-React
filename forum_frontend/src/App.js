import React, { Component } from 'react'
import $ from "jquery"
import bootstrap, { Tooltip } from "bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import ThreadContainer from "./Thread"
import PostContainer from "./Post"
import Cookies from "universal-cookie"

const verifyLoginUrl = "/api/auth/token/"

class App extends Component {
    state = {
        threadsListUrl: "http://localhost:8000/api/forum/threads/",
        currentPostUrl: "",
        currentThreadUrl: "http://localhost:8000/api/forum/threads/4/",
        thread_set: [
            {
                url: "",
                name: ""
            }
        ],
        threadData: {
            name: "",
            post_set: [
                {
                    author: "",
                    authorName: "",
                    pub_date: "",
                    title: "",
                    url: ""
                }
            ]
        },
        postData: {
            "url": "",
            "title": "",
            "author": "",
            "authorName": "",
            "pub_date": "",
            "comment_set": [
                {
                    author: "",
                    authorName: "",
                    content: "",
                    pub_date: ""
                },
            ]
        },
        commonContainerStyle: " mt-1 mb-1 p-0 border border-3 border-dark rounded ",
        userData: {
            isLogin: false,
            userprofileData: {
                username: ""
            }
        }
    }

    // initializing process

    getUrl = (fullUrl) => {
        const relativeUrl = fullUrl.replace("http://localhost:8000/", "")
        return relativeUrl
    }

    enableToolTips() {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl)
        })
    }

    //Nav relatived
    getThreadsList = () => {
        const url = this.getUrl(this.state.threadsListUrl)
        fetch(url)
            .then((result) => result.json())
            .then((result) => {
                this.setState({
                    thread_set: result
                })
            })
    }

    updateThread = () => {
        const url = this.getUrl(this.state.currentThreadUrl)
        fetch(url)
            .then((result) => result.json())
            .then((result) => {
                this.setState({
                    threadData: result
                })
            })
    }

    updatePost = () => {
        const url = this.getUrl(this.state.currentPostUrl)
        if (url !== "") {
            fetch(url)
                .then((result) => result.json())
                .then((result) => {
                    this.setState({
                        postData: result
                    })
                })
        }

    }

    directToNewThread = (threadUrl) => {
        // console.log(threadUrl)
        this.setState({
            currentThreadUrl: threadUrl
        },
            () => {
                this.updateThread()
            }
        )
    }

    directToNewPost = (postUrl) => {
        // console.log(postUrl)
        this.setState(
            {
                currentPostUrl: postUrl
            },
            () => {
                this.updatePost()
            }
        )
    }

    //Login relatived
    verifyLogin = () => {
        const cookies = new Cookies()
        const token = cookies.get("token")

        fetch(verifyLoginUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
            .then((response) => {
                const status = response.status
                // Login in success
                if (status === 200) {
                    response.json()
                        .then((responseData) => {
                            this.setState({
                                userData: {
                                    isLogin: true,
                                    userprofileData: {
                                        username: responseData.username
                                    }
                                },
                            })

                        })
                }
                else {   //handle login error
                    this.setState({
                        userData: {
                            isLogin: false,
                            userprofileData: {
                                username: ""
                            }
                        },
                    })
                }
            })
    }

    logout = () => {
        const cookie = new Cookies()
        cookie.remove("token")
        this.verifyLogin()
    }

    componentDidMount() {
        this.verifyLogin()
        this.getThreadsList()
        this.updateThread()
        this.updatePost()
        this.enableToolTips()
    }

    componentDidUpdate() {
        this.enableToolTips()
    }

    render() {
        const { threadData, postData, thread_set, userData, commonContainerStyle } = this.state

        return (
            <div className="container">
                <div className="row">

                    <ThreadContainer commonStyle={commonContainerStyle} thread_set={thread_set} threadData={threadData}
                        directToNewPost={this.directToNewPost} directToNewThread={this.directToNewThread}
                        verifyLogin={this.verifyLogin} logout={this.logout} userData={userData} />
                    <PostContainer commonStyle={commonContainerStyle} postData={postData} />

                </div>
            </div>
        )
    }
}

export default App;
