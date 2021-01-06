import React, { Component } from 'react'
import $ from "jquery"
import bootstrap, { Tooltip } from "bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import NavSide from "./NavSide"
import PostContainer from "./Post"
import { getUrl } from "./UrlTools"
import Cookies from "universal-cookie"

const verifyLoginUrl = "/api/auth/token/"

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            threadsListUrl: "http://localhost:8000/api/forum/threads/",
            currentPostUrl: "",
            currentThreadUrl: "http://localhost:8000/api/forum/threads/4/",
            thread_set: [
                {
                    url: "",
                    name: ""
                }
            ],
            postListData: {
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

        
        this.getThreadsList = this.getThreadsList.bind(this)
        this.updatePostList = this.updatePostList.bind(this)
        this.updatePostData = this.updatePostData.bind(this)
        this.directToNewThread = this.directToNewThread.bind(this)
        this.directToNewPost = this.directToNewPost.bind(this)
        this.verifyLogin = this.verifyLogin.bind(this)
        this.logout = this.logout.bind(this)
    }


    // initializing process
    enableToolTips() {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl)
        })
    }

    //Nav relatived
    getThreadsList() {
        const url = getUrl(this.state.threadsListUrl)
        fetch(url)
            .then((result) => result.json())
            .then((result) => {
                this.setState({
                    thread_set: result
                })
            })
    }

    updatePostList(opts = {}) {
        if (opts["name"] && opts["post_set"]) {
            console.log("udpate post list with postlist data")
            this.setState({
                postListData: {
                    name: opts["name"],
                    post_set: opts["post_set"]
                }
            })
        }
        else {
            console.log("update post list with thread url")
            const url = getUrl(this.state.currentThreadUrl)
            fetch(url)
                .then((result) => result.json())
                .then((result) => {
                    this.setState({
                        postListData: result
                    })
                })
        }

    }

    updatePostData() {
        const url = getUrl(this.state.currentPostUrl)
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

    directToNewThread(threadUrl) {
        console.log("direct to new thread")
        this.setState({
            currentThreadUrl: threadUrl
        },
            () => {
                this.updatePostList()
            }
        )
    }

    directToNewPost(postUrl) {
        // console.log(postUrl)
        this.setState(
            {
                currentPostUrl: postUrl
            },
            () => {
                this.updatePostData()
            }
        )
    }

    //Login relatived
    verifyLogin() {
        const cookies = new Cookies()
        const token = cookies.get("token")

        if (token !== undefined) {
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


    }

    logout = () => {
        const cookie = new Cookies()
        cookie.remove("token")
        this.verifyLogin()
    }

    componentDidMount() {
        this.verifyLogin()
        this.getThreadsList()
        this.updatePostList()
        this.updatePostData()
        this.enableToolTips()
    }

    componentDidUpdate() {
        this.enableToolTips()
    }

    render() {
        const { postListData: threadData, postData, thread_set, userData, commonContainerStyle } = this.state

        return (
            <div className="container">
                <div className="row">

                    <NavSide commonStyle={commonContainerStyle} thread_set={thread_set} threadData={threadData}
                        directToNewPost={this.directToNewPost} directToNewThread={this.directToNewThread}
                        verifyLogin={this.verifyLogin} logout={this.logout} userData={userData} />
                    <PostContainer commonStyle={commonContainerStyle} postData={postData} updatePostList={this.updatePostList} />

                </div>
            </div>
        )
    }
}

export default App;
