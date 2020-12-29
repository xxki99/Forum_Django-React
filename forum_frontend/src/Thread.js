import React, { Component } from "react"

function PostList(props) {
    const { post_set } = props
    const rows = post_set.map((post, index) => {
        return (
            <div className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                    <p className="mb-1">{post.authorName}</p>
                    <small>{post.pub_date}</small>
                </div>
                <h5 className="mb-1">{post.title}</h5>
            </div>
        )
    })

    return (
        <div className="list-gorup">
            {rows}
        </div>
    )
}

class ThreadContainer extends Component {
    render() {
        const { threadData } = this.props
        const { post_set } = threadData
        return (
            <div>
                <h3>{threadData.name}</h3>
                <PostList post_set={post_set} />
            </div>
        )
    }
}

export default ThreadContainer
