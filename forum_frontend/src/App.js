import React, { Component } from 'react'
import $ from "jquery"
import bootstrap, { Tooltip } from "bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import ThreadContainer from "./Thread"
import PostContainer from "./Post"

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
        commonContainerStyle: " mt-1 mb-1 p-0 border border-3 border-dark rounded "
    }

    getUrl = (fullUrl) => {
        const relativeUrl = fullUrl.replace("http://localhost:8000/", "")
        return relativeUrl
    }

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
        fetch(url)
            .then((result) => result.json())
            .then((result) => {
                this.setState({
                    postData: result
                })
            })
    }

    enableToolTips() {
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new Tooltip(tooltipTriggerEl)
        })
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

    componentDidMount() {
        this.getThreadsList()
        this.updateThread()
        this.updatePost()
        this.enableToolTips()
    }

    componentDidUpdate() {
        this.enableToolTips()
    }

    render() {
        const { threadData, postData, thread_set, commonContainerStyle } = this.state

        return (
            <div className="container">
                <div className="row">

                    {/* <div className={"col-3 " + commonContainerStyle}>
                        <ThreadContainer className="testingoutside" thread_set={thread_set} threadData={threadData} directToNewPost={this.directToNewPost} directToNewThread={this.directToNewThread} />
                    </div>

                    <div className={"col " + commonContainerStyle}>
                        <PostContainer postData={postData} />
                    </div> */}

                    <ThreadContainer commonStyle={commonContainerStyle} thread_set={thread_set} threadData={threadData} directToNewPost={this.directToNewPost} directToNewThread={this.directToNewThread} />
                    <PostContainer commonStyle={commonContainerStyle} postData={postData} />

                </div>
            </div>
        )
    }
}

export default App;
