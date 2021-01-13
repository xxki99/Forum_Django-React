import React, { useState, useEffect } from "react"
import { Box, Card, Paper, Typography, CardContent, makeStyles } from "@material-ui/core"
import { getUrl } from "./UrlTools"

const usestyles = makeStyles({
    titlePanel: {
        padding: "5px 16px",
        height: "53px",
    },
})



function Viewer(props) {
    const classes = usestyles()

    const defaultCommentItem = {
        author: "",
        authorName: "",
        content: "",
        pub_date: "",
    }
    const defaultPostData = {
        url: "",
        title: "",
        author: "",
        authorName: "",
        thread: "",
        pub_date: "",
        comment_set: [
            defaultCommentItem
        ],
    }
    const [postData, setPostData] = useState(defaultPostData)
    useEffect(() => {
        console.log("fecth psot")
        fetch(getUrl(props.postUrl))
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((data) => {
                            setPostData(data)
                        })
                }
                else {

                }
            })
    }, [props.postUrl])

    const CommentCard = (comment, index) => {
        if (comment === defaultCommentItem) {
            return (
                <React.Fragment>

                </React.Fragment>
            )
        }
        return (
            <Card index={index}>
                <CardContent>
                    <Typography variant="body2" color="initial">
                        {comment.authorName}
                    </Typography>
                    <Typography variant="body1">
                        {comment.content}
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    const CommentSet = postData.comment_set.map((comment, index) => {
        return (
            CommentCard(comment, index)
        )
    })

    return (
        <React.Fragment>
            <Paper variant="outlined" className={classes.titlePanel}>
                <Typography variant="h4">
                    {postData.title}
                </Typography>

            </Paper>
            <Box>
                {CommentSet}
            </Box>
        </React.Fragment>
    )
}

export default Viewer
