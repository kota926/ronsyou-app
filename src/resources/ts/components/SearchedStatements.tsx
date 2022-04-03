import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom'
import axios from "../lib/axios";
import { useAuth } from "../AuthContext";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setStatementsWithLike } from "../redux/modules/statementsWithLike";
import { setStatementArray } from "../redux/modules/statementArray";
import {
    CardContent,
    Card,
    Typography,
    Breadcrumbs,
    Box,
    IconButton,
    Stack,
} from "@mui/material";
import { blueGrey } from '@mui/material/colors'
// import { NavigateNextIcon } from '@mui/icons-material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GetAppIcon from '@mui/icons-material/GetApp';
import GetStatement from "./GetStatement";
import statementArray from "../redux/modules/statementArray";
import Like from "./Like";
import LoginDialog from "./LoginDialog";

const SearchedStatements = () => {
    const dispatch = useDispatch()
    const statementArray = useSelector((state: RootState) => state.statementArray)
    const auth = useAuth()
    const lightColor = blueGrey[100]
    const urlParams = useParams()
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    const [isOpenLoginDialog, setIsOpenLoginDialog] = useState(false)
    const [lists, setLists] = useState([])
    const [clickedStatement, setClickedStatement] = useState({})
    const [loadingMessage, setLoadingMessage] = useState('読込中')

    useEffect(() => {
        axios.get('/api/v1/statements').then((res) => {
            dispatch(setStatementArray(res.data))
            setLoadingMessage('')
        }).catch((err) => {
            console.log(err)
        })
    },[])

    useEffect(() => {
        if(auth.user) {
            axios.get('/api/v1/lists?user_id=' + auth.user.id).then((res) => {
                setLists(res.data)
            }).catch((err) => {
                console.log(err)
            })
        }
    },[auth.user])

    const handleGetBtn = (s) => {
        if(auth.user) {
            setClickedStatement(s)
            setIsOpenDialog(true)
        } else {
            setIsOpenLoginDialog(true)
        }
    }

    const handleCloseDialog = () => {
        setIsOpenDialog(false)
        setIsOpenLoginDialog(false)
    }
    
    return(
        <Box>
            {statementArray && statementArray.map((statement) => (
                <div key={statement.id}>
                    <Card sx={{my:2}}>
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
                                <div>{statement.topic.subject}</div>
                                <div>{statement.topic.unit}</div>
                                <div>{statement.topic.name}</div>
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
                        <Stack
                        direction="row"
                        justifyContent="flex-end"
                        alignItems="center"
                        sx={{mr:1}}
                        >
                            <Stack
                            direction='row'
                            alignItems='center'
                            >
                                <IconButton
                                size="large"
                                onClick={() => handleGetBtn(statement)}
                                >
                                    <GetAppIcon />
                                </IconButton>
                                <Like statement_id={statement.id} />
                            </Stack>
                        </Stack>
                    </Card>
                </div>
            ))}
            <GetStatement
                lists={lists}
                isOpenImport={isOpenDialog}
                closeDialog={handleCloseDialog}
                statement={clickedStatement}
            />
            <LoginDialog
                dialog={isOpenLoginDialog}
                closeLoginDialog={handleCloseDialog}
                message='保存機能'
            />
            {!statementArray && (
                <Box sx={{mx: 'auto'}}>
                    <Typography>
                        {loadingMessage}
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default SearchedStatements;