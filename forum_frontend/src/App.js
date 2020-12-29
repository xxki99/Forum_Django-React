import React, { Component } from 'react'
import "./App.css"
import $ from "jquery"
import bootstrap from "bootstrap"
import ThreadContainer from "./Thread"

class App extends Component {
    state = {
        currentPostUrl: "",
        currentThreadUrl: "http://localhost:8000/api/forum/threads/1/",
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
        }
    }

    getUrl = (fullUrl) => {
        const relativeUrl = fullUrl.replace("http://localhost:8000/", "")
        return relativeUrl
    }

    updateThread = () => {
        const url = this.getUrl(this.state.currentThreadUrl)
        fetch(url)
            .then((result) => result.json())
            .then((result)=>{
                this.setState({
                    threadData: result
                })
            })
    }

    updatePost = () => {

    }

    componentDidMount() {
        this.updateThread()
        this.updatePost()
    }

    render() {
        const {threadData} = this.state
        return (
            <div>
                <ThreadContainer threadData={threadData} />
            </div>
        )
    }
}

export default App;
