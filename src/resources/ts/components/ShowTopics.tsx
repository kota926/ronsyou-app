import {
    Container,
    Card,
    CardContent,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import axios from "../lib/axios";

const ShowTopics = () => {
    const [availableTopics, setAvailableTopics] = useState([])
    const [unavailableTopics, setUnavailableTopics] = useState([])
    const [btnText, setBtnText] = useState('公開')
    const [isDisableBtn, setDisableBtn] = useState(false)

    const fetchData = () => {
        axios.get('/api/v1/topics').then((res) => {
            const newData = res.data.map((data) => {
                const ts = Date.parse(data.created_at)
                const dt = new Date(ts)
                const japanDate = dt.getFullYear() + '/' + (dt.getMonth() + 1) + '/' + dt.getDate() + ' ' + dt.getHours() + ':' + dt.getMinutes().toString().padStart(2, '0')
                return {
                    ...data,
                    created_at: japanDate
                }
            })
            setAvailableTopics(newData.filter((d) => d.is_available))
            setUnavailableTopics(newData.filter((d) => !d.is_available))
            setDisableBtn(false)
        }).then((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchData()
    },[])

    const onClickUnavailable = (topic) => {
        setDisableBtn(true)
        const dataToSend = {
            ...topic,
            is_available: true
        }
        // URI = '/api/v1/update/'
        axios.put('/api/v1/topics/update', dataToSend).then((res) => {
            fetchData() 
        }).catch((err) => {
            console.log(err)
        })
    }

    const onClickAvailable = (topic) => {
        setDisableBtn(true)
        const dataToSend = {
            ...topic,
            is_available: false
        }
        // URI = '/api/v1/update/'
        axios.put('/api/v1/topics/update', dataToSend).then((res) => {
            fetchData() 
        }).catch((err) => {
            console.log(err)
        })
    }
    return(
        <Container>
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div">
                        新規作成
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>subject</TableCell>
                                    <TableCell>unit</TableCell>
                                    <TableCell>name</TableCell>
                                    <TableCell>date</TableCell>
                                    <TableCell>available</TableCell>
                                    <TableCell>公開</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {unavailableTopics.map((topic) => (
                                <TableRow
                                key={topic.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        {topic.subject}
                                    </TableCell>
                                    <TableCell>{topic.unit}</TableCell>
                                    <TableCell>{topic.name}</TableCell>
                                    <TableCell>{topic.created_at}</TableCell>
                                    <TableCell>{topic.is_available ? '○' : '×'}</TableCell>
                                    <TableCell>
                                        <Button
                                        disabled={isDisableBtn}
                                        onClick={() => onClickUnavailable(topic)}
                                        >公開</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>subject</TableCell>
                                    <TableCell>unit</TableCell>
                                    <TableCell>name</TableCell>
                                    <TableCell>date</TableCell>
                                    <TableCell>available</TableCell>
                                    <TableCell>非公開</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                            {availableTopics.map((topic) => (
                                <TableRow
                                key={topic.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell>
                                        {topic.subject}
                                    </TableCell>
                                    <TableCell>{topic.unit}</TableCell>
                                    <TableCell>{topic.name}</TableCell>
                                    <TableCell>{topic.created_at}</TableCell>
                                    <TableCell>{topic.is_available ? '○' : '×'}</TableCell>
                                    <TableCell>
                                        <Button
                                        disabled={isDisableBtn}
                                        onClick={() => onClickAvailable(topic)}
                                        >非公開</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Container>
    )
}

export default ShowTopics