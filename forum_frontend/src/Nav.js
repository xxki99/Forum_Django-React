import { Box, Typography, Paper, IconButton, makeStyles, Card, CardContent, Grid, ButtonBase, Button } from "@material-ui/core"

// icon
import AccountCircle from '@material-ui/icons/AccountCircle';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import AddIcon from '@material-ui/icons/Add';

import React, { useEffect, useState } from "react"

import { CalTimeInterval } from "./TimeTools"
import { getUrl } from "./UrlTools"

import {getThreadDetailData, writePost} from "./ForumAPI"

// override style here
const usestyles = makeStyles({
    controlPanel_root: {
        padding: "5px 16px",
        height: "53px",
    },
    controlPanel_threadName: {
        flexGrow: 1,
    },
    controlPanel_userPanel_button: {
        fontSize: "16px",
    },
    postItem_root: {
        width: "100%",
        marginBottom: "1px", 
    },
    postItem_button: {
        width: "100%",
    },
})

// default state variables here
const defaultPostSetItem = {
    url: "",
    title: "",
    authorName: "",
    pub_date: ""
}
const defaultThreadData = {
    name: "",
    url: "",
    post_set: [
        defaultPostSetItem
    ]
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
                        <AddIcon className={classes.controlPanel_userPanel_button} />
                    </IconButton>
                    <IconButton onClick={handleOpenObj.userprofile} >
                        <VerifiedUserIcon className={classes.controlPanel_userPanel_button} />
                    </IconButton>
                </Grid>
            )
        }
        else {
            // controlpanel for {not login}
            return (
                <Grid item>
                    <IconButton onClick={handleOpenObj.login}>
                        <AccountCircle className={classes.controlPanel_userPanel_button} />
                    </IconButton>
                </Grid>
            )
        }

    }

    return (
        <Paper variant="outlined" className={classes.controlPanel_root} >

            <Grid container justify="space-between">
                <Grid item className={classes.controlPanel_threadName}>
                    <Button>
                        <Typography variant="h6">{threadName}</Typography>
                        {/* {threadName} */}
                    </Button>
                </Grid>
                <Grid item >
                    <Grid container>
                        {userPanel()}
                    </Grid>

                </Grid>
            </Grid>

        </Paper>
    )
}

// component
const PostItem = ({ postItemData, handleClick }) => {
    const classes = usestyles()
    if (postItemData === defaultPostSetItem) {
        return (
            <React.Fragment>

            </React.Fragment>
        )
    }
    const timeWidth = 1
    return (


        <Card className={classes.postItem_root} onClick={() => { handleClick(getUrl(postItemData.url)) }}>
            <ButtonBase className={classes.postItem_button} >

                <CardContent className={classes.postItem_button}>

                    <Grid container justify="flex-start" >

                        <Grid item xs={12 - timeWidth}>
                            <Typography variant="h5" align="left">
                                {postItemData.title}
                            </Typography>
                        </Grid>
                        <Grid item xs={timeWidth} >
                            <Typography variant="subtitle2" align="right">
                                {CalTimeInterval(postItemData.leastcomment_date)}
                            </Typography>
                        </Grid>


                    </Grid>

                    <Grid container >
                        <Grid  >
                            <Typography variant="body2" >
                                {postItemData.authorName}
                            </Typography>
                        </Grid>
                    </Grid>


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
function Nav({ handleClick_post, handleOpenObj, userInfo, threadUrl }) {
    // hooks: threadurl
    useEffect(() => {
        if (threadUrl === "") {
            console.log("empty thread url")
            setThreadData(defaultThreadData)
        }
        else {
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
        <Box>
            <ControlPanel threadName={threadData.name} handleOpenObj = {handleOpenObj} userInfo={userInfo} />
            <PostList post_set={threadData.post_set} handleClick={handleClick_post} />
        </Box>
    )
}

// export default component: Nav
export default Nav
