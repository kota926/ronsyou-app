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
    const statementArray = useSelector((state: RootState) => state.statementArray)
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
        '??????',
        "?????????",
        "??????",
        "??????",
        "??????",
        "??????",
        "??????"
    ]

    const handleError = (message: string) => {
        setErrorMessage(message)
        setIsError(true)
    }

    useEffect(() => {
        const data = {
            subject: subject,
            unit: unit,
        }
        axios.get('/api/v1/topics', {params: data}).then((res) => {
            setSelectedTopics(res.data)
            setUnitLoading(false)
        }).catch((err) => {
            console.log(err)
            handleError('???????????????????????????')
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
        setSelectedTopics([])
        setTopicName('')
        setUnits(searchUnits(sub.target.value))
        setDisableUnit(false)
    }

    const onChangeUnit = (u) => {
        setUnit(u.target.value)
        setSelectedTopics([])
        const data = {
            subject: subject,
            unit: unit,
        }
        axios.get('/api/v1/topics', {params: data}).then((res) => {
            setSelectedTopics(res.data)
            setUnitLoading(false)
        }).catch((err) => {
            console.log(err)
            handleError('???????????????????????????')
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
                        const newStm = Object.assign(res.data, {
                            topic: topicToRegister
                        })
                        const newStatements = statementArray.map((stm) => {
                            return stm.id === dataToSend.id ? newStm : stm
        
                        })
                        dispatch(setStatementArray(newStatements))
                        setLoading(false)
                        dispatch(closeDialog())
                    }).catch((err) => {
                        console.log(err)
                        handleError('???????????????????????????')
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
                    axios.post('/api/v1/topics/create', topicToSend).then((res_topic) => {
                        const dataToSend = {
                            id: statement.id,
                            title: title.trim(),
                            topic_id: res_topic.data.id,
                            question: question.trim(),
                            text: text.trim(),
                            memo: memo.trim(),
                        }
                        axios.put('/api/v1/statements/update', dataToSend).then((res_stm) => {
                            const newStm = Object.assign(res_stm.data, {
                                topic: res_topic.data
                            })
                            const newStatements = statementArray.map((stm) => {
                                return stm.id === dataToSend.id ? newStm : stm
            
                            })
                            dispatch(setStatementArray(newStatements))
                            setLoading(false)
                            dispatch(closeDialog())
                        }).catch((err) => {
                            console.log(err)
                            handleError('???????????????????????????')
                            setLoading(false)
                            setDisable(false)
                            setDisableUnit(false)
                            setDisableTopic(false)
                        })
                    }).catch((err) => {
                        console.log(err)
                        handleError('???????????????????????????')
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
                handleError('????????????????????????????????????')
            }
        } else {
            handleError('??????????????????????????????????????????')
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
                    ??????
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
                                    label="????????????"
                                    value={title}
                                    onChange={onChangeTitle}
                                />
                            </FormControl>
                            <Grid container rowSpacing={0} columnSpacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl disabled={isDisable} margin="normal" fullWidth={true}>
                                        <InputLabel id="subject-label">??????</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="subject-label"
                                            label="??????"
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
                                        <InputLabel id="unit-label">??????</InputLabel>
                                        <Select
                                            fullWidth
                                            labelId="unit-label"
                                            disabled={isDisableUnit}
                                            defaultValue=""
                                            value={unit}
                                            onChange={onChangeUnit}
                                            label="??????"
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
                                    label="??????"
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
                                    label="??????"
                                    value={question}
                                    onChange={onChangeQuestion}
                                />
                            </FormControl>
                            <FormControl disabled={isDisable} fullWidth margin="normal">
                                <TextField 
                                    fullWidth
                                    multiline
                                    variant="outlined" 
                                    label="??????"
                                    value={text}
                                    onChange={onChangeText}
                                />
                            </FormControl>
                            <FormControl disabled={isDisable} fullWidth margin="normal">
                                <TextField 
                                    fullWidth
                                    multiline
                                    variant="outlined" 
                                    label="??????"
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
                                    ?????????????????????
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