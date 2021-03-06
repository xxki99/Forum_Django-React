import React, { useState, useEffect } from "react"
import "./App.css"
import {
    makeStyles,
    Box,
    Grid,
    Paper,
    Drawer,
    Typography,
} from "@material-ui/core"
import Nav from "./Nav"
import Viewer from "./Viewer"
import {
    LoginModal,
    UserProfileModal,
    UserDetailModal,
    WritePostModal,
    WriteCommentModal,
    SignupModal,
} from "./User"
import { getThreadsList, getUserLoginState } from "./ForumAPI"
import { useParams } from "react-router-dom"
import Cookies from "universal-cookie"

const appWidth = "90vw"
const navWidth = 23
const useStyles = makeStyles({
    root: {
        padding: "1vh",
    },
    nav: {
        borderRadius: 3,
        height: "98vh",
        width: `${navWidth}%`,
    },
    viewer: {
        borderRadius: 3,
        height: "98vh",
        width: `${100 - navWidth}%`,
    },
})

function App() {
    const { postID } = useParams()
    useEffect(() => {
        if (postID !== undefined) {
            setPostUrl(`/api/forum/posts/${postID}/`)
        }
        else{
            setPostUrl("")
        }
    }, [postID])

    const classes = useStyles()

    //User profile data
    const defaultUserInfo = {
        isLogin: false,
        userData: {
            username: "",
        },
    }
    const [userInfo, setUserInfo] = useState(defaultUserInfo)

    // verify login by token
    const resetUserInfo = () => {
        var newUserInfo = {
            ...defaultUserInfo,
        }
        newUserInfo.isLogin = false
        setUserInfo(newUserInfo)
    }

    const verifyLogin = () => {
        getUserLoginState()
            .then((data) => {
                setUserInfo(data)
            })
            .catch((error) => {
                console.log(error)
                const cookies = new Cookies()
                cookies.remove("token", {path: "/"})
                resetUserInfo()
            })
    }

    // component did mount
    useEffect(() => {
        verifyLogin()
    }, [])

    // thread nav data
    const defaultThreadNavData = [
        {
            url: "",
            name: "",
        },
    ]
    const [threadNavData, setThreadNavData] = useState(defaultThreadNavData)

    // get threads list from backend
    useEffect(() => {
        getThreadsList()
            .then((data) => {
                setThreadNavData(data)
            })
            .catch((error) => {
                setThreadNavData(defaultThreadNavData)
            })
    }, [])

    // post data
    const [postUrl, setPostUrl] = useState("")

    // thread url data
    const defaultThreadUrl = "/api/forum/threads/1/"
    const [threadUrl, setThreadUrl] = useState(defaultThreadUrl)

    // user detail data (all user, not only current user)
    const defaultUserDetailData = {
        
    }
    const [userDetailData, setUserDetailData] = useState(defaultUserDetailData)

    // refresh trigger
    const [refreshTrigger_post, setRefreshTrigger_post] = useState(false)
    const [refreshTrigger_thread, setRefreshTrigger_thread] = useState(false)

    const performRefresh_post = () => {
        setRefreshTrigger_post(!refreshTrigger_post)
    }
    const performRefresh_thread = () => {
        setRefreshTrigger_thread(!refreshTrigger_thread)
    }
    

    // login modal data
    const [mopen_login, setOpen_Login] = useState(false)
    const handleOpen_login = () => {
        setOpen_Login(true)
    }
    const handleClose_login = () => {
        setOpen_Login(false)
    }

    // sign up modal data
    const [mopen_sign, setOpen_signup] = useState(false)
    const handleOpen_signup = () => {
        setOpen_signup(true)
    }
    const handleClose_signup = () => {
        setOpen_signup(false)
    }

    // userprofile modal data
    const [mopen_userprofile, setOpen_userprofile] = useState(false)
    const handleOpen_userprofile = () => {
        setOpen_userprofile(true)
    }
    const handleClose_userprofile = () => {
        setOpen_userprofile(false)
    }

    // writepost modal data
    const [mopen_writepost, setOpen_writepost] = useState(false)
    const handleOpen_writepost = () => {
        setOpen_writepost(true)
    }
    const handleClose_writepost = () => {
        setOpen_writepost(false)
    }

    // writecomment modal data
    const [mopen_writecomment, setOpen_writecomment] = useState(false)
    const handleOpen_writecomment = () => {
        setOpen_writecomment(true)
    }
    const handleClose_writecomment = () => {
        setOpen_writecomment(false)
    }

    const [mopen_userDetail, setOpen_userDetail] = useState(false)
    const handleOpen_userDetail = () => {
        setOpen_userDetail(true)
    }
    const handleClose_userDetail = () => {
        setOpen_userDetail(false)
    }

    // threads drawer
    const [dopen_thread, setOpen_thread] = useState(false)
    const handleOpen_thread = () => {
        setOpen_thread(true)
    }
    const handleClose_thread = () => {
        setOpen_thread(false)
    }

    // conditional render for modal
    const modalOptionRender = () => {
        // console.log(userInfo)
        if (userInfo.isLogin) {
            return (
                <React.Fragment>
                    <UserProfileModal
                        open={mopen_userprofile}
                        handleClose={handleClose_userprofile}
                        userInfo={userInfo}
                        verifyLogin={verifyLogin}
                        setThreadUrl={setThreadUrl}
                    />
                    <WritePostModal
                        open={mopen_writepost}
                        handleClose={handleClose_writepost}
                        threadUrl={threadUrl}
                        threadNavData={threadNavData}
                        preformRefresh={performRefresh_thread}
                    />
                    <WriteCommentModal
                        open={mopen_writecomment}
                        handleClose={handleClose_writecomment}
                        postUrl={postUrl}
                        preformRefresh={performRefresh_post}
                    />
                </React.Fragment>
            )
        } else {
            return (
                <React.Fragment>
                    <LoginModal
                        open={mopen_login}
                        handleClose={handleClose_login}
                        verifyLogin={verifyLogin}
                        handleOpen_signup={handleOpen_signup}
                    />
                    <SignupModal
                        open={mopen_sign}
                        handleClose={handleClose_signup}
                        verifyLogin={verifyLogin}
                    ></SignupModal>
                </React.Fragment>
            )
        }
    }

    const handleOpenObj = {
        login: handleOpen_login,
        userprofile: handleOpen_userprofile,
        writepost: handleOpen_writepost,
        thread: handleOpen_thread,
    }

    const threadNavObj = {
        open: dopen_thread,
        onClose: handleClose_thread,
    }

    return (
        <React.Fragment>
            <Box
                width={appWidth}
                margin="auto"
                alignItems="center"
                id="appContainer"
            >
                <Grid container spacing={0} className={classes.root}>
                    <Paper variant="outlined" className={classes.nav}>
                        <Nav
                            handleClick_post={setPostUrl}
                            handleOpenObj={handleOpenObj}
                            userInfo={userInfo}
                            threadUrl={threadUrl}
                            threadNavData={threadNavData}
                            threadNavObj={threadNavObj}
                            refreshTrigger={refreshTrigger_thread}
                        />
                    </Paper>

                    <Paper variant="outlined" className={classes.viewer}>
                        <Viewer
                            postUrl={postUrl}
                            handleOpen_writecomment={handleOpen_writecomment}
                            handleOpen_login={handleOpen_login}
                            handleOpen_userDetail={handleOpen_userDetail}
                            userInfo={userInfo}
                            setUserDetailData = {setUserDetailData}
                            refreshTrigger={refreshTrigger_post}
                        />
                    </Paper>
                </Grid>
            </Box>

            {/*render modal*/}
            {modalOptionRender()}
            {/* common modal render */}
            <UserDetailModal
                open={mopen_userDetail}
                handleClose={handleClose_userDetail}
                userDetailData = {userDetailData}
                setThreadUrl={setThreadUrl}
            />
        </React.Fragment>
    )
}

export default App
