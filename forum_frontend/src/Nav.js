import {
    Box,
    Typography,
    Paper,
    IconButton,
    makeStyles,
    Card,
    CardContent,
    Grid,
    ButtonBase,
    Button,
    Drawer,
    ListItem,
    List,
} from "@material-ui/core"

// icon
import AccountCircle from "@material-ui/icons/AccountCircle"
import VerifiedUserIcon from "@material-ui/icons/VerifiedUser"
import AddIcon from "@material-ui/icons/Add"

import React, { useEffect, useState } from "react"

import { CalTimeInterval } from "./TimeTools"
import { getUrl, getPostId } from "./UrlTools"

import { getThreadDetailData, writePost, getUserDetail } from "./ForumAPI"

import { Link } from "react-router-dom"

// override style here
const usestyles = makeStyles({
    nav_root: {
        height: "100%", 
        maxWidth: "100%", 
        display: "flex", 
        flexDirection: "column", 
    }, 
    controlPanel_root: {
        padding: "5px 16px",
        maxWidth: "100%", 
        // height: "53px",
    },
    controlPanel_threadName: {
        flexGrow: 1,
        maxWidth: "100%", 
    },
    controlPanel_userPanel_button: {
        fontSize: "16px",
    },
    postItem_root: {
        width: "100%",
        height: "auto",
        marginBottom: "1px",
    },
    postItem_button: {
        width: "100%",
        height: "auto"
    },
    postItem_button_topBar_root: {
        width: "100%", 
        marginBottom: "5px", 
    }, 
    postItem_button_topBar_title: {
        paddingLeft: "3px", 
        flexGrow: 1,
        maxWidth: "100%", 
    }, 
    postItem_button_topBar_title_text: {
        wordWrap: "break-word", 
    },

    
    postListContainer: {
        overflowY: "auto", 
    },
})

// default state variables here
const defaultPostSetItem = {
    url: "",
    title: "",
    authorName: "",
    pub_date: "",
}
const defaultThreadData = {
    name: "",
    url: "",
    post_set: [defaultPostSetItem],
}

// component
function ControlPanel({ threadName, handleOpenObj, userInfo }) {
    const classes = usestyles()

    const userPanel = () => {
        if (userInfo.isLogin) {
            // control panel for {login}
            return (
                <Grid item>
                    <IconButton onClick={handleOpenObj.writepost}>
                        <AddIcon
                            className={classes.controlPanel_userPanel_button}
                        />
                    </IconButton>
                    <IconButton onClick={handleOpenObj.userprofile}>
                        <VerifiedUserIcon
                            className={classes.controlPanel_userPanel_button}
                        />
                    </IconButton>
                </Grid>
            )
        } else {
            // controlpanel for {not login}
            return (
                <Grid item>
                    <IconButton onClick={handleOpenObj.login}>
                        <AccountCircle
                            className={classes.controlPanel_userPanel_button}
                        />
                    </IconButton>
                </Grid>
            )
        }
    }

    return (
        <Paper variant="outlined" className={classes.controlPanel_root}>
            <Grid container justify="space-between">
                <Grid item className={classes.controlPanel_threadName}>
                    <Button onClick={handleOpenObj.thread}>
                        <Typography variant="h6">{threadName}</Typography>
                        {/* {threadName} */}
                    </Button>
                </Grid>
                <Grid item>
                    <Grid container>{userPanel()}</Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}

// component
const PostItem = ({ postItemData }) => {
    const classes = usestyles()
    if (postItemData === defaultPostSetItem) {
        return <React.Fragment></React.Fragment>
    }
    const timeWidth = 1
    const postid = getPostId(postItemData.url)

    return (
        <Card className={classes.postItem_root}>
            <ButtonBase
                component={Link}
                to={`/posts/${postid}`}
                className={classes.postItem_button}
            >
                <CardContent className={classes.postItem_button}>
                    <Box display="flex" className={classes.postItem_button_topBar_root}>
                        <Box className={classes.postItem_button_topBar_title}>
                            <Typography variant="h6" align="left" className={classes.postItem_button_topBar_title_text}>
                                {postItemData.title}
                            </Typography>
                            
                        </Box>
                        <Box>
                            <Typography variant="subtitle2" align="right">
                                {CalTimeInterval(
                                    postItemData.leastcomment_date
                                )}
                            </Typography>
                        </Box>
                    </Box>
                    
                        <Box>
                            <Typography variant="body2">
                                {postItemData.authorName}
                            </Typography>
                    </Box>


                </CardContent>
            </ButtonBase>
        </Card>
    )
}

// component
function PostList({ post_set, handleClick }) {
    const postList = post_set.map((post, index) => {
        return (
            <div key={index}>
                <PostItem postItemData={post} handleClick={handleClick} />
            </div>
        )
    })

    return postList
}

// component
function ThreadNavDrawer({ open, onClose, threadNavData }) {
    const threadlist = threadNavData.map((thread, index) => {
        return (
            <ListItem key={index}>
                <Button>{thread.name}</Button>
            </ListItem>
        )
    })

    return (
        <Drawer open={open} onClose={onClose} anchor="left">
            <Box>{threadlist}</Box>
        </Drawer>
    )
}

// component
function Nav({
    handleClick_post,
    handleOpenObj,
    userInfo,
    threadUrl,
    threadNavData,
    threadNavObj,
    setUserDetailData,
}) {
    const classes = usestyles()

    // hooks: threadurl
    useEffect(() => {
        if (threadUrl === "") {
            console.log("empty thread url")
            setThreadData(defaultThreadData)
        } else {
            getThreadDetailData(threadUrl)
                .then((data) => {
                    setThreadData(data)
                })
                .catch((error) => {
                    console.log(`fetch thread data error: ${error}`)
                    setThreadData(defaultThreadData)
                })
        }
    }, [threadUrl])

    // hooks: threadData
    const [threadData, setThreadData] = useState(defaultThreadData)

    // return render
    return (
        <React.Fragment>
            <Box className={classes.nav_root}>
                <ControlPanel
                    threadName={threadData.name}
                    handleOpenObj={handleOpenObj}
                    userInfo={userInfo}
                />
                <Box className={classes.postListContainer}>
                    <PostList
                        post_set={threadData.post_set}
                        handleClick={handleClick_post}
                        setUserDetailData={setUserDetailData}
                    />
                </Box>
            </Box>
            <ThreadNavDrawer
                open={threadNavObj.open}
                onClose={threadNavObj.onClose}
                threadNavData={threadNavData}
            />
        </React.Fragment>
    )
}

// export default component: Nav
export default Nav
