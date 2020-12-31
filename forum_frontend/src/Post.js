import React, { Component } from "react"
import { CalTimeInterval, ConvertTimeToString } from "./TimeTools"

function Comments(props) {
    const { comment_set } = props
    const contentStyle = {
        fontSize: 20,
    }
    const authorNameStyle = {
        fontWeight: "bold",
    }

    const rows = comment_set.map((comment, index) => {
        const date_dif = CalTimeInterval(comment.pub_date)
        const datetime = ConvertTimeToString(comment.pub_date)
        return (
            <div className="list-group-item">
                <small className="d-flex mb-3">
                    <span className="mr-3" style={authorNameStyle}>
                        {comment.authorName}
                    </span>
                    <span data-bs-toggle="tooltip" data-placement="bottom" title={datetime}>
                        {date_dif}
                    </span>
                </small>

                <div>
                    <p style={contentStyle}>{comment.content}</p>
                </div>


            </div>
        )
    })

    return (
        <React.Fragment>{rows}</React.Fragment>
    )
}

class PostContainer extends Component {
    render() {
        const { postData, commonStyle } = this.props
        const { comment_set, title } = postData
        return (
            <div className={"wrapper col" + commonStyle}>
                <div className="list-group-item">
                    <h3>{title}</h3>
                </div>
                <div className="list-group scrollable-child">
                    <Comments comment_set={comment_set} />
                </div>
            </div>
        )
    }
}

export default PostContainer
