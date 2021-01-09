import React, { Component } from "react"
import { CalTimeInterval } from "./TimeTools"
import "./Thread.css"
import UserPanel from "./User"

function PostList(props) {
    const { post_set, directToNewPost } = props
    var rows = <div></div>
    if (post_set) {
        rows = post_set.map((post, index) => {
            const date_dif = CalTimeInterval(post.pub_date)
            return (
                <a key={index} href="/#" className="list-group-item list-group-item-action noselect" onClick={() => { directToNewPost(post.url) }}>
                    <div className="d-flex justify-content-between">
                        <p className="mb-1">{post.authorName}</p>
                        <small>{date_dif}</small>
                    </div>
                    <h5 className="mb-1">{post.title}</h5>
                </a>
            )
        })
    }

    return (
        <React.Fragment>{rows}</React.Fragment>
    )
}

function ThreadDropDown(props) {
    const imenu_style = {
        fontSize: "1.65em",
    }

    const { thread_set, directToNewThread } = props

    const rows = thread_set.map((thread, index) => {
        return (
            <button key={index} className="btn" onClick={() => { directToNewThread(thread.url) }}>{thread.name}</button>
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

class NavSide extends Component {
    render() {
        const { threadData, thread_set, userData, commonStyle, directToNewPost, directToNewThread, verifyLogin, logout, currentThreadUrl } = this.props
        const { post_set, name } = threadData
        const col = "col-3 "

        return (
            <div className={"wrapper " + col + commonStyle}>
                <div className="list-group-item d-flex justify-content-between">

                    <div className="d-flex align-items-start">
                        <ThreadDropDown thread_set={thread_set} directToNewThread={directToNewThread} />
                        <h3 className="mb-0 ml-2">{name}</h3>
                    </div>

                    <div>
                        <UserPanel verifyLogin={verifyLogin} logout={logout} userData={userData} thread_set={thread_set} currentThreadUrl={currentThreadUrl} />
                    </div>

                </div>
                <div className="list-group postListContainer scrollable-child">
                    <PostList post_set={post_set} directToNewPost={directToNewPost} />
                </div>
            </div>
        )
    }
}

export default NavSide
