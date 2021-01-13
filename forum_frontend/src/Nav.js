import { Box, Typography, Paper, ButtonGroup, Button, makeStyles, Container, Card, CardContent, Grid, ButtonBase } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { CalTimeInterval } from "./TimeTools"

const usestyles = makeStyles({
    controlPanel: {
        padding: "5px 16px",
        height: "53px",
    },
    buttonPaper: {
    },
    postNav_top: {
        padding: 0,
    },
    postItem_root: {
        width: "100%",
    },
    postItem: {
        width: "100%",
    },
})


function Nav(props) {
    const classes = usestyles()

    const defaultThreadUrl = "api/forum/threads/1/"
    const [threadUrl, setThreadUrl] = useState(defaultThreadUrl)
    useEffect(() => {
        fetch(threadUrl)
            .then((response) => {
                if (response.ok) {
                    response.json()
                        .then((data) => {
                            setThreadData(data)
                        })
                }
                // handle fetch error
                else {

                }
            })
    }, [threadUrl])

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
    const [threadData, setThreadData] = useState(defaultThreadData)

    const postItem = (postItemData, index) => {
        if (postItemData === defaultPostSetItem) {
            return (
                <React.Fragment>

                </React.Fragment>
            )
        }
        const timeWidth = 1
        return (


            <Card key={index} className={classes.postItem_root} onClick={() => { props.handleClick_post(postItemData.url) }}>
                <ButtonBase className={classes.postItem} >

                    <CardContent className={classes.postItem}>

                        <Grid container justify="flex-start" >

                            <Grid item xs={12 - timeWidth}>
                                <Typography variant="h5" align="left">
                                    {postItemData.title}
                                </Typography>
                            </Grid>
                            <Grid item xs={timeWidth} >
                                <Typography variant="subtitle2" align="right">
                                    {CalTimeInterval(postItemData.pub_date)}
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

    const postList = threadData.post_set.map((post, index) => {
        return (
            postItem(post, index)
        )
    })

    return (
        <Box>
            <Paper container variant="outlined" className={classes.controlPanel} >
                <Grid>
                    <Typography variant="h4">{threadData.name}</Typography>
                </Grid>
            </Paper>
            {postList}

        </Box>
    )
}

export default Nav
