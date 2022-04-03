import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import axios from "../lib/axios";
import NumbersIcon from '@mui/icons-material/Numbers';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { LoadingButton } from "@mui/lab";
import {
    Button,
    Card,
    CardContent,
    Container,
    Stack,
    Typography,
    Box,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    FormControl,
    useMediaQuery,
} from "@mui/material";

const ShowList = () => {
    const navigate = useNavigate()
    const auth = useAuth()
    const [lists, setLists] = useState([])
    const [selectedList, setSelectedList] = useState(null)
    const [isOpenDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [isOpenCreateDialog, setOpenCreateDialog] = useState(false)
    const [isOpenEditDialog, setOpenEditDialog] = useState(false)
    const titleRef = useRef<HTMLInputElement>()
    const [editTitle, setEditTitle] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const mediaquery = useMediaQuery('(min-width:440px)')

    const jpDateList = (list) => {
        const ts = Date.parse(list.created_at)
        const dt = new Date(ts)
        const japanDate = dt.getFullYear() + '/' + (dt.getMonth() + 1).toString().padStart(2, '0') + '/' + dt.getDate().toString().padStart(2, '0')
        return {
            ...list,
            created_at: japanDate
        }
    }

    const fetchList = () => {
        axios.get('/api/v1/lists?user_id=' + auth.user.id).then((res) => {
            // 作成日を見やすく変換
            const newData = res.data.map((list) => {
                return jpDateList(list)
            })
            setLists(newData)
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchList()
    },[])

    const handleDeleteBtn = (list) => {
        setSelectedList(list)
        setOpenDeleteDialog(true)
    }

    const deleteList = () => {
        setIsLoading(true)
        axios.delete('/api/v1/lists/' + selectedList.id).then((res) => {
            axios.get('/api/v1/lists?user_id=' + auth.user.id).then((res) => {
                // 作成日を見やすく変換
                const newData = res.data.map((data) => {
                    const ts = Date.parse(data.created_at)
                    const dt = new Date(ts)
                    const japanDate = dt.getFullYear() + '/' + (dt.getMonth() + 1).toString().padStart(2, '0') + '/' + dt.getDate().toString().padStart(2, '0')
                    return {
                        ...data,
                        created_at: japanDate
                    }
                })
                setLists(newData)
                setIsLoading(false)
                setOpenDeleteDialog(false)
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
            if(err.message === "Unauthenticated.") {
                navigate('../login')
            }
        })
    }

    const handleCreateBtn = () => {
        setOpenCreateDialog(true)
    }

    const createList = () => {
        if(auth.user) {
            const dataToSend = {
                title: titleRef.current.value,
                id: auth.user.id
            }
            setIsLoading(true)
            axios.post('/api/v1/lists/create', dataToSend).then((res)=>{
                setIsLoading(false)
                setOpenCreateDialog(false)
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
                if(err.message === "Unauthenticated.") {
                    navigate('../login')
                }
            })
        } else {
            console.log('not loggedIn')
        }
    }

    const handleEditBtn = (list) => {
        setSelectedList(list)
        setEditTitle(list.title)
        setOpenEditDialog(true)
    }

    const onChangeEditTitle = (e) => {
        setEditTitle(e.target.value)
    }

    const editList = () => {
        if(auth.user) {
            const dataToSend = {
                title: editTitle,
            }
            setIsLoading(true)
            axios.put('/api/v1/lists/update/' + selectedList.id, dataToSend).then((res)=>{
                const newData = jpDateList(res.data)
                const newLists = lists.map((list) => {
                    return list.id === selectedList.id ? newData : list

                })
                setLists(newLists)
                setIsLoading(false)
                setOpenEditDialog(false)
            }).catch((err) => {
                console.log(err)
                setIsLoading(false)
                if(err.message === "Unauthenticated.") {
                    navigate('../login')
                }
            })
        } else {
            console.log('not loggedIn')
        }
    }

    const closeDialog = () => {
        setOpenDeleteDialog(false)
        setOpenCreateDialog(false)
        setOpenEditDialog(false)
    }

    return (
        <Container>
            {lists.map((list) => {
                return (
                    <Card sx={{maxWidth: 600, mx: 'auto', mt: 2}} key={list.id}>
                        <CardContent>
                            <Typography variant="h5" component='div'>
                                {list.title}
                            </Typography>
                            {mediaquery ? 
                            (<Stack
                                direction='row'
                                alignItems="flex-end"
                                justifyContent="space-between"
                            >
                                <Box>
                                    <Chip
                                    icon={<AccessTimeIcon />}
                                    label={list.created_at}
                                    variant="outlined"
                                    color="success"
                                    size="small"
                                    sx={{ml:1}}
                                    />
                                    <Chip
                                    icon={<NumbersIcon />}
                                    label={list.max_pos}
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    sx={{ml:1}}
                                    />
                                </Box>
                                <div>
                                    <Link to={'../list/' + list.id}>
                                        <Button
                                        variant="outlined"
                                        >詳細</Button>
                                    </Link>
                                    <Button
                                        color="success"
                                        variant="outlined"
                                        sx={{ml:1}}
                                        onClick={() => handleEditBtn(list)}
                                    >編集</Button>
                                    <Button
                                        color="error"
                                        variant="outlined"
                                        sx={{ml:1}}
                                        onClick={() => handleDeleteBtn(list)}
                                    >削除</Button>
                                </div>
                            </Stack>) : (
                                <div>
                                    <Box>
                                        <Chip
                                        icon={<AccessTimeIcon />}
                                        label={list.created_at}
                                        variant="outlined"
                                        color="success"
                                        size="small"
                                        sx={{ml:1}}
                                        />
                                        <Chip
                                        icon={<NumbersIcon />}
                                        label={list.max_pos}
                                        variant="outlined"
                                        size="small"
                                        color="secondary"
                                        sx={{ml:1}}
                                        />
                                    </Box>
                                    <Stack
                                    sx={{mt:2}}
                                    alignItems="flex-end"
                                    >
                                        <div>
                                            <Link to={'../list/' + list.id}>
                                                <Button
                                                variant="outlined"
                                                >詳細</Button>
                                            </Link>
                                            <Button
                                                color="success"
                                                variant="outlined"
                                                sx={{ml:1}}
                                                onClick={() => handleEditBtn(list)}
                                            >編集</Button>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                sx={{ml:1}}
                                                onClick={() => handleDeleteBtn(list)}
                                            >削除</Button>
                                        </div>
                                    </Stack>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
            <Stack sx={{mt:2}}>
                <Button
                variant="contained"
                sx={{maxWidth: 200, mx: 'auto'}}
                onClick={handleCreateBtn}>リストを作成</Button>
            </Stack>
            <Dialog
            open={isOpenDeleteDialog}
            onClose={closeDialog}
            >
                <DialogTitle>削除しますか？</DialogTitle>
                <DialogContent>
                    <DialogContentText>タイトル名 : {selectedList ? selectedList.title : null}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                    disabled={isLoading}
                    onClick={closeDialog}
                    >キャンセル</Button>
                    <LoadingButton
                    loading={isLoading}
                    onClick={deleteList}
                    >削除</LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog
            open={isOpenCreateDialog}
            onClose={closeDialog}
            sx={{width: 'auto'}}
            >
                <DialogTitle>リストの新規作成</DialogTitle>
                <FormControl margin="normal" sx={{mx:2}}>
                    <TextField
                    label='リストタイトル'
                    inputRef={titleRef}
                    />
                </FormControl>
                <DialogActions>
                    <Button
                    disabled={isLoading}
                    onClick={closeDialog}
                    >キャンセル</Button>
                    <LoadingButton
                    onClick={createList}
                    loading={isLoading}
                    >作成</LoadingButton>
                </DialogActions>
            </Dialog>
            <Dialog
            open={isOpenEditDialog}
            onClose={closeDialog}
            sx={{width: 'auto'}}
            >
                <DialogTitle>タイトルの編集</DialogTitle>
                <FormControl margin="normal" sx={{mx:2}}>
                    <TextField
                    label='リストタイトル'
                    value={editTitle}
                    onChange={onChangeEditTitle}
                    />
                </FormControl>
                <DialogActions>
                    <Button
                    disabled={isLoading}
                    onClick={closeDialog}
                    >キャンセル</Button>
                    <LoadingButton
                    onClick={editList}
                    loading={isLoading}
                    >保存</LoadingButton>
                </DialogActions>
            </Dialog>
        </Container>
    )
}

export default ShowList