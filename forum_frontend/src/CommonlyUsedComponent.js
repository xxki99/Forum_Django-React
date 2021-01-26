import {Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem} from "@material-ui/core"

function CommonDialog({open, handleClose, title, content, actions, fullWidth=true}) {
    return (
        <Dialog
            fullWidth={fullWidth}
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            {/* title */}
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>

            {/* content */}
            <DialogContent>

                {content}

            </DialogContent>

            {/* footer */}
            <DialogActions>
                {actions}
            </DialogActions>
        </Dialog>
    )

}

function ThreadsSelect({id, selectedThread, onChange, threadNavData, defaultThread}){
    const threadsItems = threadNavData.map((thread, index)=>{
        return(
            <MenuItem value={thread.url} key={index}>{thread.name}</MenuItem>
        )
    })
    return(
        <Select
          labelId={id}
          id={id}
          defaultValue={defaultThread}
          value={selectedThread}
          onChange={onChange}
        >
          {threadsItems}
        </Select>
    )
}

export {CommonDialog, ThreadsSelect}
