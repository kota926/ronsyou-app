import React, { Fragment, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../redux/modules/statementUI";
import { setStatementArray } from "../redux/modules/statementArray";
import { RootState } from "../redux/store";
import axios from "../lib/axios";
import { searchUnits } from '../lib/unit'
import {
    Card,
    CardContent,
    TextField,
    Typography,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    FormControl,
    Container,
    Autocomplete,
    CircularProgress,
    Dialog,
    Button,
    Slide,
    AppBar,
    Toolbar,
    IconButton,
    Stack,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const UpdateStatement = (props) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const statement = useSelector((state: RootState) => state.statement)
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [isDisable, setDisable] = useState(false);
    const [list, setList] = useState(null)
    const [subject, setSubject] = useState(statement.topic.subject)
    const [unit, setUnit] = useState(statement.topic.unit)
    const [selectedTopics, setSelectedTopics] = useState([])
    const [topicName, setTopicName] = useState(statement.topic.name)
    const [title, setTitle] = useState(statement.title)
    const [question, setQuestion] = useState(statement.question)
    const [text, setText] = useState(statement.text)
    const [memo, setMemo] = useState(statement.memo)
    const [selectedUnits, setUnits] = useState(searchUnits(statement.topic.subject))
    const [isDisableUnit, setDisableUnit] = useState(false)
    const [isDisableTopic, setDisableTopic] = useState(false)
    const [unitLoading, setUnitLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const urlParams = useParams<{id: string}>()

    const subjects = [
        '憲法',
        "行政法",
        "民法",
        "商法",
        "民訴",
        "刑法",
        "刑訴"
    ]

    const handleError = (message: string) => {
        setErrorMessage(message)
        setIsError(true)
    }

    useEffect(() => {
        axios.get('/api/v1/topics/' + subject + '/' + unit + '/').then((res) => {
            setSelectedTopics(res.data)
            setUnitLoading(false)
        }).catch((err) => {
            console.log(err)
            handleError('通信に失敗しました')
        })
    }, [])

    const handleCloseDialog = () => {
        dispatch(closeDialog())
    }

    const onChangeTitle = (e) => {
        setTitle(e.target.value)
    }

    const onChangeSubject = (sub) => {
        setSubject(sub.target.value)
        setUnit('')
        setTopicName('')
        setUnits(searchUnits(sub.target.value))
        setDisableUnit(false)
    }

    const onChangeUnit = (u) => {
        setUnit(u.target.value)
        axios.get('/api/v1/topics/' + subject + '/' + u.target.value + '/').then((res) => {
            setSelectedTopics(res.data)
            setUnitLoading(false)
        }).catch((err) => {
            console.log(err)
            handleError('通信に失敗しました')
        })
        setDisableTopic(false)
        
    }

    const onChangeTopic = (event, newInputValue) => {
        setTopicName(newInputValue)
    }

    const onChangeQuestion = (e) => {
        setQuestion(e.target.value)
    }

    const onChangeText = (e) => {
        setText(e.target.value)
    }

    const onChangeMemo = (e) => {
        setMemo(e.target.value)
    }

    const onSubmit = () => {
        const dataToSend = {
            id: statement.id,
            title: title.trim(),
            topic_id: topicName,
            question: question.trim(),
            text: text.trim(),
            memo: memo.trim(),
            is_public: true,
        }
        if(title.trim() && subject.trim() && unit.trim() && topicName.trim() && text.trim()) {
            if(auth.user) {
                const topicToRegister = selectedTopics.find((e) => {
                    return e.name === topicName
                })
                setLoading(true)
                setDisable(true)
                setDisableUnit(true)
                setDisableTopic(true)
                if(topicToRegister) {
                    const dataToSend = {
                        id: statement.id,
                        title: title.trim(),
                        topic_id: topicToRegister.id,
                        question: question.trim(),
                        text: text.trim(),
                        memo: memo.trim(),
                    }
                    axios.put('/api/v1/statements/update', dataToSend).then((res) => {
                        axios.get('/api/v1/statements?list_id=' + urlParams.id).then((res) => {
                            if(Object.keys(res.data).length !== 0) {
                                dispatch(setStatementArray(res.data))
                            } else {
                                dispatch(setStatementArray(null))
                            }
                            setLoading(false)
                            dispatch(closeDialog())
                        }).catch((err) => {
                            console.log(err)
                        })
                    }).catch((err) => {
                        console.log(err)
                        handleError('通信に失敗しました')
                        setLoading(false)
                        setDisable(false)
                        setDisableUnit(false)
                        setDisableTopic(false)
                        if(err.message === "Unauthenticated.") {
                            navigate('../login')
                        }
                    })
                } else {
                    const topicToSend = {
                        subject: subject,
                        unit: unit,
                        name: topicName.trim(),
                        is_available: false
                    }
                    axios.post('/api/v1/topics/create', topicToSend).then((res) => {
                        const dataToSend = {
                            id: statement.id,
                            title: title.trim(),
                            topic_id: res.data.id,
                            question: question.trim(),
                            text: text.trim(),
                            memo: memo.trim(),
                        }
                        axios.put('/api/v1/statements/update', dataToSend).then((res) => {
                            axios.get('/api/v1/statements?list_id=' + urlParams.id).then((res) => {
                                if(Object.keys(res.data).length !== 0) {
                                    dispatch(setStatementArray(res.data))
                                } else {
                                    dispatch(setStatementArray(null))
                                }
                                setLoading(false)
                                dispatch(closeDialog())
                            }).catch((err) => {
                                console.log(err)
                            })
                        }).catch((err) => {
                            console.log(err)
                            handleError('通信に失敗しました')
                            setLoading(false)
                            setDisable(false)
                            setDisableUnit(false)
                            setDisableTopic(false)
                        })
                    }).catch((err) => {
                        console.log(err)
                        handleError('通信に失敗しました')
                        setLoading(false)
                        setDisable(false)
                        setDisableUnit(false)
                        setDisableTopic(false)
                        if(err.message === "Unauthenticated.") {
                            navigate('../login')
                        }
                    })
                }
                
            } else {
                handleError('ログインし直してください')
            }
        } else {
            handleError('すべての欄に記入してください')
        }
    }
    return(
        <Fragment>
            <AppBar sx={{bgcolor: 'black', position: 'relative'}} >
                <Toolbar>
                    <IconButton
                    edge="start"
                    color="inherit"
                    onClick={handleCloseDialog}
                    aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    編集
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{mt:2}}>
                <Card sx={{mx: 'auto'}}>
                    <CardContent>
                        <div>
                            <FormControl disabled={isDisable} margin="normal" fullWidth>
                                <TextField 
                                    fullWidth
                                    variant="outlined" 
                                    label="タイトル"
                                    value={title}
                                    onChange={onChangeTitle}
                                />
                            </FormControl>
                            <Grid container rowSpacing={0} columnSpacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl disabled={isDisable} margin="normal" fullWidth={true}>
                                        <InputLabel id="subject-label">科目</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="subject-label"
                                            label="科目"
                                            defaultValue=""
                                            value={subject}
                                            onChange={onChangeSubject}
                                        >
                                            {subjects.map((subject) => {
                                                return <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl margin="normal" fullWidth={true}>
                                        <InputLabel id="unit-label">単元</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="unit-label"
                                            disabled={isDisableUnit}
                                            defaultValue=""
                                            value={unit}
                                            onChange={onChangeUnit}
                                            label="単元"
                                        >
                                            {selectedUnits.map((unit) => {
                                                return <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <FormControl margin="normal" fullWidth={true}>
                                <Autocomplete
                                freeSolo
                                disabled={isDisableTopic}
                                loading={unitLoading}
                                inputValue={topicName}
                                onInputChange={onChangeTopic}
                                options={selectedTopics.map((topic) => topic.name)}
                                renderInput={(params) => (
                                    <TextField
                                    {...params}
                                    label="論点"
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                        <React.Fragment>
                                            {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                            {params.InputProps.endAdornment}
                                        </React.Fragment>
                                        ),
                                    }}
                                    />
                                )}
                                />
                            </FormControl>
                            <FormControl disabled={isDisable} fullWidth margin="normal">
                                <TextField 
                                    fullWidth
                                    multiline
                                    variant="outlined" 
                                    label="問題"
                                    value={question}
                                    onChange={onChangeQuestion}
                                />
                            </FormControl>
                            <FormControl disabled={isDisable} fullWidth margin="normal">
                                <TextField 
                                    fullWidth
                                    multiline
                                    variant="outlined" 
                                    label="論証"
                                    value={text}
                                    onChange={onChangeText}
                                />
                            </FormControl>
                            <FormControl disabled={isDisable} fullWidth margin="normal">
                                <TextField 
                                    fullWidth
                                    multiline
                                    variant="outlined" 
                                    label="メモ"
                                    value={memo}
                                    onChange={onChangeMemo}
                                />
                            </FormControl>
                            <div className="mt-4 text-center">
                                <LoadingButton
                                    type="submit"
                                    loading={loading}
                                    variant="contained"
                                    onClick={onSubmit}
                                >
                                    編集を保存する
                                </LoadingButton>
                                {isError && <span className="block text-red-400 mt-1">{errorMessage}</span>}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Container>
        </Fragment>
    )
}

export default UpdateStatement