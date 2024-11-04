import { Button, Dialog, DialogActions, DialogContent, DialogTitle, styled } from '@mui/material'
import React from 'react'
import './CustomDialog.css'

const StyledDialogActions = styled(DialogActions)({
    '&.MuiDialogActions-root': {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '1rem'
    }
})

function CustomDialog({children, openModal, setOpenModal, title, handleClickYes, handleClickNo, confirmButtonText, cancelButtonText, disabledConfirmButton, style}) {
    return (
        <Dialog
            open={openModal}
            onClose={() => setOpenModal(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle className='custom-dialog-title' id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent className="custom-dialog-content" sx={{...style}}>
                {children}
            </DialogContent>

            <StyledDialogActions>
                {confirmButtonText ? 
                    <Button
                        variant="contained"
                        children={confirmButtonText}          
                        onClick={handleClickYes}
                        disabled={disabledConfirmButton}
                    /> :
                    null
                }
                <Button
                    variant="outlined"
                    children={cancelButtonText}           
                    onClick={handleClickNo}
                />
            </StyledDialogActions>
        </Dialog>
    )
}

export default CustomDialog