import React, { useState, useEffect } from "react"
import { Box, Card, Paper, Typography, CardContent, makeStyles, Grid, Tooltip, IconButton } from "@material-ui/core"
import ReplyIcon from '@material-ui/icons/Reply';
import { CalTimeInterval, ConvertTimeToString } from "./TimeTools"
import { getPostDetailData } from "./ForumAPI"

// override style
const usestyles = makeStyles({
    titlePanel: {
        padding: "5px 16px",
        height: "53px",
    },
    titlePanel_replyButton: {
        fontSize: "18px", 
    }, 
    commentSet_commentCard: {
        marginBottom: "1px", 
    }, 
})

// default state variables
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

// component
function CommentCard({ comment }) {
    const classes = usestyles()
    if (comment === defaultCommentItem) {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
    return (
        <Card className={classes.commentSet_commentCard}>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid item>
                        <Typography variant="body2">
                            {comment.authorName}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip title={ConvertTimeToString(comment.pub_date)}>
                            <Typography variant="caption">
                                {CalTimeInterval(comment.pub_date)}
                            </Typography>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            {comment.content}
                        </Typography>
                    </Grid>
                </Grid>
                
            </CardContent>
        </Card>
    )
}

// component
function CommentSet({ comment_set }) {
    return comment_set.map((comment, index) => {
        return (
            <div key={index}>
                <CommentCard comment={comment} />
            </div>
        )
    })
}



// component
function Viewer({postUrl, handleOpen_writecomment, handleOpen_login, userInfo}) {
    const classes = usestyles()

    const handleClick_reply = () => {
        if (userInfo.isLogin){
            handleOpen_writecomment()
        }
        else{
            handleOpen_login()
        }
    }

    const [postData, setPostData] = useState(defaultPostData)
    useEffect(() => {
        if (postUrl === "") {
            // console.log("No post url")
        }
        else {
            getPostDetailData(postUrl)
                .then((data) => {
                    setPostData(data)
                })
                .catch((error) => {
                    console.log(error)
                    setPostData(defaultPostData)
                })
        }

    }, [postUrl])

    if (postUrl === "") {
        return (
            <React.Fragment>
                <Paper variant="outlined" className={classes.titlePanel}>

                </Paper>
                <Box>

                </Box>
            </React.Fragment>
        )
    }
    else {
        return (
            <React.Fragment>
                <Paper variant="outlined" className={classes.titlePanel}>

                    <Box display="flex" flexDirection="row">
                        <Box flexGrow={1}>
                            <Typography variant="h4">
                                {postData.title}
                            </Typography>
                        </Box>
                        <Box>
                            <IconButton onClick={handleClick_reply}>
                                <ReplyIcon className={classes.titlePanel_replyButton}/>
                            </IconButton>
                        </Box>
                    </Box>

                </Paper>
                <Box>
                    <CommentSet comment_set={postData.comment_set} />
                </Box>
            </React.Fragment>
        )
    }

}

// export default component: Viewer
export default Viewer
