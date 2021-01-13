import React, { Component, useState } from 'react'
import { makeStyles, Box, Grid, Paper } from '@material-ui/core';
import Nav from "./Nav"
import Viewer from "./Viewer"

const navWidth = 20

const useStyles = makeStyles({
    root: {
        padding: "1vh"
    },
    nav: {
        borderRadius: 3,
        height: "98vh",
        width: `${navWidth}%`
    },
    viewer:{
        borderRadius: 3,
        height: "98vh",
        width: `${100-navWidth}%`
    }
})

function App() {
    const classes = useStyles()

    const [postUrl, setPostUrl] = useState("")

    return (
        <Box width={"80%"} margin="auto" alignItems="center" >
            <Grid container spacing={0} className={classes.root}>
                    <Paper variant="outlined" className={classes.nav} >
                        <Nav handleClick_post={setPostUrl} />
                    </Paper>
                    <Paper variant="outlined" className={classes.viewer}>
                        <Viewer postUrl = {postUrl} />
                    </Paper>
            </Grid>
        </Box>
    )
}

export default App;
