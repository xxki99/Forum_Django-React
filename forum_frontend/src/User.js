import React, { useState, useEffect } from "react"
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Grid,
    Box,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import { getUrl } from "./UrlTools"
import Cookies from "universal-cookie"
import { CommonDialog, ThreadsSelect } from "./CommonlyUsedComponent"
import { ConvertTimeToString } from "./TimeTools"
import { login, writePost, writeComment, signup } from "./ForumAPI"

const useStyles = makeStyles({
    modal: {
        width: "600px",
    },
})

function UserDetailModal({ open, handleClose, userDetailData, setThreadUrl }) {
    const handleClick_posts = () => {
        setThreadUrl(userDetailData.post_set_url)
        handleClose()
    }

    const title = () => {
        return (
            <Grid>
                <Typography>{userDetailData.username}</Typography>
            </Grid>
        )
    }

    const content = () => {
        return (
            <Grid>
                <Typography>{ConvertTimeToString(userDetailData.date_joined)}</Typography>
            </Grid>
        )
    }

    const actions = () => {
        return (
            <Grid>
                <Button onClick={handleClick_posts}>Posts</Button>
            </Grid>
        )
    }

    return (
        <CommonDialog
            open={open}
            handleClose={handleClose}
            title={title()}
            content={content()}
            actions={actions()}
        />
    )
}

function SignupModal({ open, handleClose, verifyLogin }) {
    const classes = useStyles()

    // reset state after handleClose
    useEffect(() => {
        setErrorMessage(defaultErrorMessage)
        setUsername("")
        setPassword("")
    }, [open])

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [email, setEmail] = useState("")

    const handleChange_username = (e) => {
        setUsername(e.target.value)
    }

    const handleChange_password = (e) => {
        setPassword(e.target.value)
    }

    const handleChange_confirmPassword = (e) => {
        setConfirmPassword(e.target.value)
    }

    const handleChange_email = (e) => {
        setEmail(e.target.value)
    }

    const handleClick_signup = () => {
        if (password === confirmPassword) {
            performSignup()
        } else {
            setErrorMessage({
                ...defaultErrorMessage,
                confirmPassword: "Passwords do not match",
            })
            // handle not match
        }
    }

    const handleClick_enter = (e) => {
        if (e.keyCode === 13) {
            handleClick_signup()
        }
    }

    const performSignup = async () => {
        try {
            await signup(username, password, email)
        } catch (error) {
            // handle signup error
            // console.log(error);
            if ("non_field_errors" in error) {
                set_non_field_errors(error.non_field_errors)
            } else {
                if ("username" in error) {
                    setErrorMessage({
                        ...defaultErrorMessage,
                        username: error.username,
                    })
                } else {
                    if ("password" in error) {
                        setErrorMessage({
                            ...defaultErrorMessage,
                            password: error.password,
                        })
                    } else {
                        if ("email" in error) {
                            setErrorMessage({
                                ...defaultErrorMessage,
                                email: error.email,
                            })
                        }
                    }
                }
            }
            return
        }

        try {
            console.log("Try login")
            await login(username, password)
            verifyLogin()
            handleClose()
        } catch (error) {
            // handle login error
            return
        }
    }

    const defaultErrorMessage = {
        username: "",
        password: "",
        confirmPassword: "",
        email: "",
    }

    const [non_field_errors, set_non_field_errors] = useState([])

    const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)

    return (
        <Dialog
            onKeyUp={(e) => {
                handleClick_enter(e)
            }}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xs"
        >
            {/* title */}
            <DialogTitle id="alert-dialog-title">{"Signup"}</DialogTitle>

            {/* content */}
            <DialogContent>
                <TextField
                    error={errorMessage.username !== ""}
                    helperText={errorMessage.username}
                    margin="dense"
                    id="usernameinput-signup"
                    label="Username"
                    type="text"
                    fullWidth
                    onChange={handleChange_username}
                />

                <TextField
                    error={errorMessage.password !== ""}
                    helperText={errorMessage.password}
                    margin="dense"
                    id="passwordinput-signup"
                    label="Password"
                    type="password"
                    fullWidth
                    onChange={handleChange_password}
                />

                <TextField
                    error={errorMessage.confirmPassword !== ""}
                    helperText={errorMessage.confirmPassword}
                    margin="dense"
                    id="passwordConfirminput-signup"
                    label="Confrim your password"
                    type="password"
                    fullWidth
                    onChange={handleChange_confirmPassword}
                />

                <TextField
                    error={errorMessage.email !== ""}
                    helperText={errorMessage.email}
                    margin="dense"
                    id="emailinput-singup"
                    label="Email"
                    type="text"
                    fullWidth
                    onChange={handleChange_email}
                />
            </DialogContent>

            {/* footer */}
            <DialogActions>
                <Button onClick={handleClick_signup}>Signup</Button>
            </DialogActions>
        </Dialog>
    )
}

function WriteCommentModal({ open, handleClose, postUrl }) {
    const [commentContent, setCommentContent] = useState("")

    const handleChange_comment = (e) => {
        setCommentContent(e.target.value)
    }

    const performWriteComment = () => {
        /*
        try{
            await writeComment(postUrl, commentContent);
            handleClose();
        }catch(error){
            console.log(error)
        }
        */

        writeComment(postUrl, commentContent)
            .then((data) => {
                handleClose()
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const title = () => {
        return <Grid>Write a new Comment</Grid>
    }

    const content = () => {
        return (
            <Grid>
                <TextField
                    fullWidth
                    id="commentContentInputTextField"
                    label="Comment"
                    multiline
                    rows={10}
                    defaultValue=""
                    variant="outlined"
                    onChange={handleChange_comment}
                />
            </Grid>
        )
    }

    const actions = () => {
        return <Button onClick={performWriteComment}>Comment</Button>
    }

    return (
        <CommonDialog
            open={open}
            handleClose={handleClose}
            title={title()}
            content={content()}
            actions={actions()}
        />
    )
}

function TestingRename({ open, handleClose, threadNavData, threadUrl }) {
    const [postTitle, setPostTitle] = useState("")
    const [postContent, setPostContent] = useState("")
    const [postThread, setPostThread] = useState(threadUrl)

    const handleChange_title = (e) => {
        setPostTitle(e.target.value)
    }

    const handleChange_content = (e) => {
        setPostContent(e.target.value)
    }

    const handleChange_thread = (e) => {
        setPostThread(e.target.value)
    }

    const performWritePost = () => {
        console.log("Perform write post")
        writePost(postThread, postTitle, postContent)
        handleClose()
    }

    const title = () => {
        return (
            <Box display="flex">
                <Box flexGrow={1}>Write a new post</Box>
                <Box>
                    <ThreadsSelect
                        id="threadsSelect"
                        defaultThread={threadUrl}
                        threadNavData={threadNavData}
                        selectedThread={postThread}
                        onChange={handleChange_thread}
                    />
                </Box>
            </Box>
        )
    }

    const content = () => {
        return (
            <Grid fullWidth container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="postTitleInputTextField"
                        label="Title"
                        multiline
                        rows={1}
                        defaultValue=""
                        variant="outlined"
                        onChange={handleChange_title}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="postContentInputTextField"
                        label="Content"
                        multiline
                        rows={10}
                        defaultValue=""
                        variant="outlined"
                        onChange={handleChange_content}
                    />
                </Grid>
            </Grid>
        )
    }

    const actions = () => {
        return (
            <Grid>
                <Button onClick={performWritePost}>Write post</Button>
            </Grid>
        )
    }

    return (
        <CommonDialog
            open={open}
            handleClose={handleClose}
            title={title()}
            content={content()}
            actions={actions()}
        />
    )
}

function UserProfileModal({
    open,
    handleClose,
    userInfo,
    verifyLogin,
    setThreadUrl,
}) {
    const logout = () => {
        const cookies = new Cookies()
        cookies.remove("token", {path: "/"})
        verifyLogin()
        handleClose()
    }

    const directToUserPosts = (url) => {
        setThreadUrl(url)
        handleClose()
    }

    const { userData } = userInfo
    const title = () => {
        return (
            <Grid>
                <Typography>{userData.username}</Typography>
            </Grid>
        )
    }

    const content = () => {
        return (
            <Grid>
                <Typography>
                    {ConvertTimeToString(userData.date_joined)}
                </Typography>
            </Grid>
        )
    }

    const actions = () => {
        return (
            <Grid>
                <Button
                    onClick={() => {
                        directToUserPosts(userData.post_set_url)
                    }}
                >
                    Posts
                </Button>
                <Button onClick={logout}>Logout</Button>
            </Grid>
        )
    }

    return (
        <CommonDialog
            open={open}
            handleClose={handleClose}
            title={title()}
            content={content()}
            actions={actions()}
        />
    )
}

function LoginModal({ open, handleClose, verifyLogin, handleOpen_signup }) {
    useEffect(() => {
        resetInput()
        setErrorMessage(defaultErrorMessage)
    }, [open])

    const resetInput = () => {
        setUsername("")
        setPassword("")
    }

    const [username, setUsername] = useState("")

    const handleChange_username = (e) => {
        setUsername(e.target.value)
    }

    const [password, setPassword] = useState("")

    const handleChange_password = (e) => {
        setPassword(e.target.value)
    }

    const handleClick_login = () => {
        performLogin()
        // handleClose();
    }

    const handleClick_enter = (e) => {
        if (e.keyCode === 13) {
            handleClick_login()
        }
    }

    const handleClick_signup = () => {
        handleClose()
        handleOpen_signup()
    }

    const performLogin = () => {
        // reset default errorMessage
        setErrorMessage(defaultErrorMessage)
        login(username, password)
            .then((data) => {
                verifyLogin()
                handleClose()
            })
            .catch((error) => {
                console.log(error)
                if ("non_field_errors" in error) {
                    setErrorMessage({
                        ...defaultErrorMessage,
                        non_field_errors: error.non_field_errors,
                    })
                } else {
                    setErrorMessage({ ...error, non_field_errors: "" })
                }
            })
    }

    const defaultErrorMessage = {
        username: "",
        password: "",
        non_field_errors: "",
    }
    const [errorMessage, setErrorMessage] = useState(defaultErrorMessage)

    return (
        <Dialog
            onKeyUp={(e) => {
                handleClick_enter(e)
            }}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {/* title */}
            <DialogTitle id="alert-dialog-title">{"Login"}</DialogTitle>

            {/* content */}
            <DialogContent>
                <TextField
                    error={errorMessage.username !== ""}
                    helperText={errorMessage.username}
                    autoFocus
                    margin="dense"
                    id="usernameinput-login"
                    label="Username"
                    type="text"
                    fullWidth
                    onChange={handleChange_username}
                />
                <TextField
                    error={errorMessage.password !== ""}
                    helperText={errorMessage.password}
                    margin="dense"
                    id="passwordinput-login"
                    label="Password"
                    type="password"
                    fullWidth
                    onChange={handleChange_password}
                />
                <Box>
                    <Typography color="error">
                        {errorMessage.non_field_errors}
                    </Typography>
                </Box>
            </DialogContent>

            {/* footer */}
            <DialogActions>
                <Button onClick={handleClick_signup}>Signup</Button>
                <Button onClick={handleClick_login}>Login</Button>
            </DialogActions>
        </Dialog>
    )
}

export {
    LoginModal,
    UserProfileModal,
    UserDetailModal, 
    TestingRename,
    WriteCommentModal,
    SignupModal,
}
