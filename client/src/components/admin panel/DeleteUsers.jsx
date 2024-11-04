import { Checkbox, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import Message from "../reusable/Message";
import CustomDialog from "../reusable/CustomDialog";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SelectAllIcon from '../../assets/select-all.svg'
import UnselectAllIcon from '../../assets/unselect-all.svg'
import './DeleteUsers.css'
import { deleteUser, getAllUsers } from "../../api/authService";
import useNotification from "../hooks/useNotification";

function DeleteUsers() {
    const { success, error, showSuccess, showError, clearNotifications, isLoading, startLoading, stopLoading } = useNotification();

    const [users, setUsers] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        getUsers();
    }, []);

    const checkBoxHandler = (id) => {
        if (selectedUsers.some((user) => user.id === id)) {
            setSelectedUsers(selectedUsers.filter((user) => user.id !== id));
        } else {
            setSelectedUsers([...selectedUsers, users.find((user) => user.id === id)]);
        }
    };

    const handleSelectAll = () => {
        if (users.length === selectedUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers([
                ...selectedUsers,
                ...users.filter(user =>
                    !selectedUsers.some(
                        selectedUser => selectedUser.id === user.id
                    ))
            ]);
        }
    }

    const deleteUsers = async (users) => {
        const emails = users.map(user => user.email)
        startLoading()
        try {
            const response = await deleteUser(emails)
            if (response.status === 200) {
                setIsDialogOpen(false);
                showSuccess('Users deleted successfully!')
                setSelectedUsers([])
                getUsers();
            }
         
        } catch (error) {
            showError(error.response.data.message);
            stopLoading()
        }
    };

    const getUsers = async () => {
        startLoading()
        try {
            const response = await getAllUsers()
            setUsers(response.data.users.filter((item) => item.id !== user.id));
            stopLoading()
        } catch (error) {
            stopLoading()
            showError(error.response.data.message);
        }
    };

    return (
        <>
            {isLoading && <CircularProgress className="loader" color="primary" />}
            <div className="delete-users-buttons">
                {users.length ?
                    <img onClick={handleSelectAll} src={selectedUsers.length ? UnselectAllIcon : SelectAllIcon} className='icon' /> :
                    <></>
                }
                {selectedUsers.length ? 
                    <DeleteOutlineIcon
                        className="icon delete-user-icon"
                        onClick={() => {
                            setIsDialogOpen(true);
                        }}
                    /> :
                    <></>
                }
            </div>
            <Message
                open={success.state}
                handleClose={clearNotifications}
                message={success.message}
                severity="success"
            />
            <Message
                open={error.state}
                handleClose={clearNotifications}
                message={error.message}
                severity="error"
            />
            {isDialogOpen && (
                <CustomDialog
                    openModal={isDialogOpen}
                    setOpenModal={() => setIsDialogOpen(true)}
                    title="Are you sure you want to delete the user/s"
                    handleClickYes={async () => await deleteUsers(selectedUsers)}
                    handleClickNo={() => {
                        setSelectedUsers([]);
                        setIsDialogOpen(false);
                    }}
                    confirmButtonText="Yes"
                    cancelButtonText="Cancel"
                   
                />
            )}
            <div className="users-container">
                {users.map((user) => (
                    <div key={user.id} className="user location">
                        <Checkbox
                            onChange={() => checkBoxHandler(user.id)}
                            checked={selectedUsers.some(
                                (selectedUser) => selectedUser.id === user.id
                            )}
                            sx={{
                                color: "white",
                                "&.Mui-checked": {
                                    color: "white",
                                },
                            }}
                            icon={<RadioButtonUncheckedIcon />}
                            checkedIcon={<CheckCircleOutlineIcon />}
                        />
                        {`${user.email.slice(0, 12)}...`}
                    </div>
                ))}
            </div>
        </>
    );
}

export default DeleteUsers;
