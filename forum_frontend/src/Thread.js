import React, { Component } from "react"
import { CalTimeInterval } from "./TimeTools"
import "./Thread.css"

function PostList(props) {
    const { post_set, directToNewPost } = props
    const rows = post_set.map((post, index) => {
        const date_dif = CalTimeInterval(post.pub_date)
        return (
            <a href="#" className="list-group-item list-group-item-action noselect" onClick={() => { directToNewPost(post.url) }}>
                <div className="d-flex justify-content-between">
                    <p className="mb-1">{post.authorName}</p>
                    <small>{date_dif}</small>
                </div>
                <h5 className="mb-1">{post.title}</h5>
            </a>
        )
    })

    return (
        <React.Fragment>{rows}</React.Fragment>
    )
}

function ThreadDropDown(props){
    const imenu_style = {
        fontSize: "1.65em",
    }

    const {thread_set, directToNewThread} = props

    const rows = thread_set.map((thread, index) => {
        return(
            <button className="btn" onClick={() => {directToNewThread(thread.url)}}>{thread.name}</button>
        )
    })

    return (
        <div className="dropdown">
                        <button className="btn p-0 pt-1" type="button" data-toggle="dropdown">
                            <i className="fas fa-bars" style={imenu_style}></i>
                        </button>
                        <div className="dropdown-menu">
                            {rows}
                        </div>
        </div>
    )
}

class ThreadContainer extends Component {
    render() {
        const { threadData, thread_set, commonStyle, directToNewPost, directToNewThread } = this.props
        const { post_set, name } = threadData

        return (
            <div className={"wrapper col-3" + commonStyle}>
                <div className="list-group-item d-flex justify-content-start">
                    <ThreadDropDown thread_set = {thread_set} directToNewThread={directToNewThread} />
                    <h3 className="mb-0 ml-2">{name}</h3>
                </div>
                <div className="list-group postListContainer scrollable-child">
                    <PostList post_set={post_set} directToNewPost={directToNewPost} />
                </div>
            </div>
        )
    }
}

export default ThreadContainer
