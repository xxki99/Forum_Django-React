import React, { useState, useEffect } from "react"
import {
    Box,
    Card,
    Paper,
    Typography,
    CardContent,
    makeStyles,
    Grid,
    Tooltip,
    IconButton,
    Button,
} from "@material-ui/core"
import ReplyIcon from "@material-ui/icons/Reply"
import { CalTimeInterval, ConvertTimeToString } from "./TimeTools"
import { getPostDetailData, getUserDetail } from "./ForumAPI"
import { getUrl } from "./UrlTools"

// override style
const usestyles = makeStyles({
    viewer_root: {
        height: "100%", 
        display: "flex", 
        flexDirection: "column", 
    }, 
    titlePanel: {
        padding: "5px 16px",
        // height: "53px",
    },
    titlePanel_replyButton: {
        fontSize: "18px",
    },
    commentSet_root: {
        overflowY: "auto", 
    }, 
    commentSet_commentCard: {
        marginBottom: "1px",
    },
    commentSet_commentCard_topBar: {
        height: "100%",
    },
    commentSet_commentCard_userButton: {
        paddingLeft: "0px",
        paddingRight: "0px", 
        minWidth: "auto"
    }, 
    commentSet_commentCard_userButton_text: {
        
    }, 
    commentSet_commentCard_pubDate: {
        padding: "0px",
        marginTop: "6px",
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
    comment_set: [defaultCommentItem],
}

// component
function CommentCard({ comment, setUserDetailData, handleOpen_userDetail }) {
    const classes = usestyles()
    if (comment === defaultCommentItem) {
        return <React.Fragment></React.Fragment>
    }

    const handleClick_user = () => {
        const userUrl = getUrl(comment.author)
        getUserDetail(userUrl)
            .then((data) => {
                setUserDetailData(data)
                handleOpen_userDetail()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <Card className={classes.commentSet_commentCard}>
            <CardContent>
                <Grid
                    container
                    spacing={2}
                    className={classes.commentSet_commentCard_topBar}
                >
                    <Grid item>
                        <Button onClick={handleClick_user} padding={0} className={classes.commentSet_commentCard_userButton}>
                            <Typography variant="body2" align="left" className={classes.commentSet_commentCard_userButton_text}>
                                {comment.authorName}
                            </Typography>
                        </Button>
                    </Grid>
                    <Grid item>
                        <div className={classes.commentSet_commentCard_pubDate}>
                            <Tooltip
                                title={ConvertTimeToString(comment.pub_date)}
                            >
                                <Typography variant="caption">
                                    {CalTimeInterval(comment.pub_date)}
                                </Typography>
                            </Tooltip>
                        </div>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">
                            {comment.content}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

// component
function CommentSet({ comment_set, setUserDetailData, handleOpen_userDetail }) {
    return comment_set.map((comment, index) => {
        return (
            <div key={index}>
                <CommentCard
                    comment={comment}
                    setUserDetailData={setUserDetailData}
                    handleOpen_userDetail={handleOpen_userDetail}
                />
            </div>
        )
    })
}

// component
function Viewer({
    postUrl,
    handleOpen_writecomment,
    handleOpen_login,
    userInfo,
    setUserDetailData,
    handleOpen_userDetail,
}) {
    const classes = usestyles()

    const handleClick_reply = () => {
        if (userInfo.isLogin) {
            handleOpen_writecomment()
        } else {
            handleOpen_login()
        }
    }

    const [postData, setPostData] = useState(defaultPostData)
    useEffect(() => {
        if (postUrl === "") {
            // console.log("No post url")
        } else {
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
                <Paper
                    variant="outlined"
                    className={classes.titlePanel}
                ></Paper>
                <Box></Box>
            </React.Fragment>
        )
    } else {
        return (
            <React.Fragment>
                <div className={classes.viewer_root}>
                    <Paper variant="outlined" className={classes.titlePanel}>
                        <Box display="flex" flexDirection="row">
                            <Box flexGrow={1}>
                                <Typography variant="h4">
                                    {postData.title}
                                </Typography>
                            </Box>
                            <Box>
                                <IconButton onClick={handleClick_reply}>
                                    <ReplyIcon
                                        className={
                                            classes.titlePanel_replyButton
                                        }
                                    />
                                </IconButton>
                            </Box>
                        </Box>
                    </Paper>
                    <Box className={classes.commentSet_root}>
                        <CommentSet
                            comment_set={postData.comment_set}
                            setUserDetailData={setUserDetailData}
                            handleOpen_userDetail={handleOpen_userDetail}
                        />
                    </Box>
                </div>
            </React.Fragment>
        )
    }
}

// export default component: Viewer
export default Viewer
