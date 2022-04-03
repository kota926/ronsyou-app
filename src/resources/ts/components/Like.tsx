import React, { Fragment, useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { Box } from "@mui/system";
import { IconButton, Stack, Typography } from "@mui/material";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import axios from "../lib/axios";
import LoginDialog from "./LoginDialog";
import { useNavigate } from "react-router-dom";

const Like = (props) => {
    const [count, setCount] = useState(0)
    const [isExist, setIsExist] = useState(false)
    const [isDisableBtn, setIsDisableBtn] = useState(false)
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    const auth = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        
        let isMounted = true
        if(auth.user) {
            const dataToSend = {
                statement_id: props.statement_id,
                user_id: auth.user.id
            }
            setIsDisableBtn(true)
            axios.get('/api/v1/likes', {params: dataToSend}).then((res) => {
                if(isMounted) {
                    setCount(res.data.count)
                    setIsExist(res.data.is_exist)
                    setIsDisableBtn(false)
                }
            }).catch((err) => {
                if(isMounted) {
                    console.log(err)
                    setIsDisableBtn(false)
                }
            })
        } else {
            const dataToSend = {
                statement_id: props.statement_id,
            }
            setIsDisableBtn(true)
            axios.get('/api/v1/likes', {params: dataToSend}).then((res) => {
                if(isMounted) {
                    setCount(res.data.count)
                    setIsExist(res.data.is_exist)
                    setIsDisableBtn(false)
                }
            }).catch((err) => {
                if(isMounted) {
                    console.log(err)
                    setIsDisableBtn(false)
                }
            })
        }
        return () => { isMounted = false }
    },[])

    const handleLikeBtn = () => {
        if(isExist) {
            setCount(count - 1)
            setIsExist(false)
            const dataToSend = {
                statement_id: props.statement_id,
                user_id: auth.user.id
            }
            setIsDisableBtn(true)
            axios.delete('/api/v1/likes', {params: dataToSend}).then((res) => {
                setIsDisableBtn(false)
            }).catch((err) => {
                console.log(err)
                setCount(count + 1)
                setIsExist(true)
                setIsDisableBtn(false)
                if(err.message === "Unauthenticated.") {
                    navigate('../login')
                }
            })
        } else if (auth.user) {
            setCount(count + 1)
            setIsExist(true)
            const dataToSend = {
                statement_id: props.statement_id,
                user_id: auth.user.id
            }
            setIsDisableBtn(true)
            axios.post('/api/v1/likes', dataToSend).then((res) => {
                setIsDisableBtn(false)
            }).catch((err) => {
                console.log(err)
                setCount(count - 1)
                setIsExist(false)
                setIsDisableBtn(false)
            })
        } else {
            setIsOpenDialog(true)
        }
    }

    const handleCloseDialog = () => {
        setIsOpenDialog(false)
    }
    return(
        <Fragment>
            <Stack
            direction='row'
            alignItems='center'
            sx={{mr:2}}>
                <IconButton
                size="large"
                onClick={handleLikeBtn}
                disabled={isDisableBtn}
                >
                    <FavoriteTwoToneIcon
                    color={isExist ? 'error' : 'disabled'}
                    />
                </IconButton>
                <Typography variant="body2" sx={{color: 'text.disabled'}}>
                    {count && count}
                </Typography>
            </Stack>
            <LoginDialog
            dialog={isOpenDialog}
            closeLoginDialog={handleCloseDialog}
            message='いいね機能'
            />
        </Fragment>
    )
}

export default Like