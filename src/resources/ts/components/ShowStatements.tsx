import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom'
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setStatement } from '../redux/modules/statement'
import { setStatementArray } from '../redux/modules/statementArray'
import { setList } from "../redux/modules/lists";
import { openDialog } from "../redux/modules/statementUI";
import axios from "../lib/axios";
import {
    CardContent,
    Container,
    Card,
    Typography,
    Breadcrumbs,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button,
    Stack,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { blueGrey } from '@mui/material/colors'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';    

const ShowStatements = () => {
    const list = useSelector((state: RootState) => state.list)
    const statementArray = useSelector((state: RootState) => state.statementArray)
    const dispatch = useDispatch()
    const lightColor = blueGrey[100]
    const urlParams = useParams()
    const [selectedStatement, setSelectedStatement] = useState(null)
    const [loadingMessage, setLoadingMessage] = useState('読込中')
    const [isOpenDialog, setIsOpenDialog] = useState(false)

    const fetchStatements = () => {
        axios.get('/api/v1/statements?list_id=' + urlParams.id).then((res) => {
            if(Object.keys(res.data).length !== 0) {
                dispatch(setStatementArray(res.data))
            } else {
                setLoadingMessage('')
                dispatch(setStatementArray(null))
            }
        }).catch((err) => {
            console.log(err)
            setLoadingMessage('通信に失敗しました')
        })
    }


    useEffect(() => {
       fetchStatements()
    },[])

    const handleEditBtn = (e) => {
        dispatch(openDialog(true))
        dispatch(setStatement(e))
    }

    const handleDeleteBtn = (stm) => {
        setSelectedStatement(stm)
        setIsOpenDialog(true)
    }

    const closeDialog = () => {
        setIsOpenDialog(false)
    }

    const deleteStm = () => {
        axios.delete('/api/v1/statements/' + selectedStatement.id).then((res) => {
            fetchStatements()
            const data = {
                max_pos: list.max_pos - 1
            }
            axios.put('/api/v1/lists/update/'  + urlParams.id, data).then((res) => {
                setIsOpenDialog(false)
                dispatch(setList(res.data))
            })
        }).catch((err) => {
            console.log(err)
            setIsOpenDialog(false)
        })
    }
    return(
        <Container maxWidth="md">
            {statementArray && statementArray.map((statement) => (
                <Card key={statement.id} sx={{my:2}}>
                    <CardContent>
                        <Typography variant="body2" sx={{color: lightColor}}>
                            タイトル
                        </Typography>
                        <Typography sx={{ml: 1, mt:1, mb:2}}>
                            {statement.title}
                        </Typography>
                        <Breadcrumbs
                            separator={<NavigateNextIcon fontSize="small" />}
                            aria-label="breadcrumb"
                            sx={{typography: 'body2', ml:1, my:2}}
                        >
                            <Link to='../search'>{statement.topic.subject}</Link>
                            <Link to='../search'>{statement.topic.unit}</Link>
                            <Link to='../search'>{statement.topic.name}</Link>
                        </Breadcrumbs>
                        <Typography variant="body2" sx={{color: lightColor}}>
                            問題
                        </Typography>
                        <Typography sx={{ml: 1, mt:1, mb:2}}>
                            {statement.question}
                        </Typography>
                        <Typography variant="body2" sx={{color: lightColor}}>
                            論証
                        </Typography>
                        <Typography sx={{ml: 1, mt:1, mb:2}}>
                            {statement.text}
                        </Typography>
                    </CardContent>
                    <Accordion
                        square
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography variant="body2" sx={{color: lightColor}}>
                                メモ
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography sx={{ml: 1}}>
                                {statement.memo}
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Card>
                        <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={2}
                        >
                            <div>
                                <Button
                                variant="outlined"
                                startIcon={<EditIcon />}
                                color='success'
                                sx={{ mt: 2, mb:1 }}
                                onClick={() => handleEditBtn(statement)}
                                >
                                    編集
                                </Button>
                                <Button
                                variant="outlined"
                                startIcon={<HighlightOffIcon />}
                                color='error'
                                sx={{ mt: 2, mb:1, mx: 2 }}
                                onClick={() => handleDeleteBtn(statement)}
                                >
                                    削除
                                </Button>
                            </div>
                        </Stack>
                    </Card>
                </Card>
            ))}
            <Dialog
            open={isOpenDialog}
            onClose={closeDialog}
            >
                <DialogTitle>削除しますか？</DialogTitle>
                <DialogContent>
                    <DialogContentText>タイトル名 : {selectedStatement ? selectedStatement.title : null}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog}>キャンセル</Button>
                    <Button onClick={deleteStm}>削除</Button>
                </DialogActions>
            </Dialog>
            {!statementArray && (
                <Box sx={{mx: 'auto'}}>
                    <Typography>
                        {loadingMessage}
                    </Typography>
                </Box>
            )}
        </Container>
    )
}

export default ShowStatements