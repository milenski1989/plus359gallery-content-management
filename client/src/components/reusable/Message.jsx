import { Alert, Snackbar } from "@mui/material"


const Message = ({ open, handleClose, message, severity }) => {

    return <>
        <Snackbar open={open} onClose={handleClose} autoHideDuration={2000}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    </>
}

export default Message