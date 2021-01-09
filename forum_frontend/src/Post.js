import React, { Component } from "react"
import { CalTimeInterval, ConvertTimeToString } from "./TimeTools"
import $ from "jquery"
// import bootstrap from "bootstrap"
import {getUrl} from "./UrlTools"

const authorModalName = "authorModal"

function Author(props) {
    const {username, date_joined, email} = props.authorData
    const {directToAuthorPostList} = props
    return (
        <div className="modal fade" id={authorModalName} tabIndex="-1" role="dialog" aria-labelledby={authorModalName} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="LoginModelLabel">{username}</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">

                        <div>
                            <span>Date joined: </span>
                            <span>{date_joined}</span>
                        </div>

                        <div>
                            <span>email: </span>
                            <span>{email}</span>
                        </div>



                    </div>
                    <div className="modal-footer">
                        <button type="btn" className="btn btn-primary" onClick={()=>{directToAuthorPostList()}}>Posts</button>
                    </div>
                </div>
            </div>
        </div>

    )

}

function Comments(props) {
    const { comment_set } = props
    const contentStyle = {
        fontSize: 20,
    }
    const authorNameStyle = {
        fontWeight: "bold",
    }

    var rows = undefined
    if (comment_set){
            rows = comment_set.map((comment, index) => {
            const date_dif = CalTimeInterval(comment.pub_date)
            const datetime = ConvertTimeToString(comment.pub_date)
            return (
                <div key={index} className="list-group-item">
                    <small className="d-flex mb-3">
                        <a className="mr-3" style={authorNameStyle} href="/#" onClick={() => {props.updateAuthorData(comment.author)}}>
                            {comment.authorName}
                        </a>
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
    }
    else{
        rows = <div></div>
    }
    

    return (
        <React.Fragment>{rows}</React.Fragment>
    )
}

class PostContainer extends Component {
    constructor(props) {
        super(props)

        this.state = {
            authorData: {
                authorName: "", 
                date_joined: "", 
                post_set_url: "", 
            },
        }

        this.toggleAuthorModal = this.switchAuthorModal.bind(this)
        this.updateAuthorData = this.updateAuthorData.bind(this)
        this.directToAuthorPostList = this.directToAuthorPostList.bind(this)
    }

    switchAuthorModal(mode) {
        $("#" + authorModalName).modal(mode)
    }

    directToAuthorPostList(){
        
        const {updatePostList} = this.props
        const {authorData} = this.state
        const {post_set_url} = authorData

        console.log("Direct to author post set")
        
        fetch(getUrl(post_set_url))
            .then(response => response.json())
            .then((responseData) => {
                const postListData = responseData
                updatePostList(postListData)
                this.switchAuthorModal("hide")
            })
    }

    updateAuthorData(authorUrl) {
        const url = getUrl(authorUrl)
        fetch(url)
            .then(response => response.json())
            .then((responseData) => {
                this.setState(
                    {
                        authorData: responseData
                    }
                )
                console.log(responseData)
            })
        this.switchAuthorModal("toggle")
    }

    render() {
        const {authorData} = this.state
        const { postData, commonStyle } = this.props
        const { comment_set, title } = postData
        const col = " col-9 "

        if (title !== "") {
            return (
                <div className={"wrapper " + col + commonStyle}>
                    <div className="list-group-item">
                        <h3>{title}</h3>
                    </div>
                    <div className="list-group scrollable-child">
                        <Comments comment_set={comment_set} updateAuthorData={this.updateAuthorData} />
                    </div>
                    <Author authorData={authorData} directToAuthorPostList={this.directToAuthorPostList}  />
                </div>
            )
        }
        else {
            return (
                <div className={"wrapper" + col + commonStyle}>
                </div>
            )
        }

    }
}

export default PostContainer
