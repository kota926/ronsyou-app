import React, { Fragment, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { closeDialog } from "../redux/modules/statementUI";
import { setList } from "../redux/modules/lists";
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

const CreateStatement = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const statementArray = useSelector((state: RootState) => state.statementArray)
    const list = useSelector((state: RootState) => state.list)
    const auth = useAuth();
    const [loading, setLoading] = useState(false);
    const [isDisable, setDisable] = useState(false);
    // const [list, setList] = useState(null)
    const [subject, setSubject] = useState('')
    const [unit, setUnit] = useState('')
    const [selectedTopics, setSelectedTopics] = useState([])
    const [topicName, setTopicName] = useState('')
    const titleRef = useRef<HTMLInputElement>()
    const questionRef = useRef<HTMLInputElement>()
    const textRef = useRef<HTMLInputElement>()
    const memoRef = useRef<HTMLInputElement>()
    const [selectedUnits, setUnits] = useState([])
    const [isDisableUnit, setDisableUnit] = useState(true)
    const [isDisableTopic, setDisableTopic] = useState(true)
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

    useEffect(() => {
        axios.get('/api/v1/lists/' + urlParams.id).then((res) => {
            dispatch(setList(res.data))
        }).catch((err) => {
            handleError('fetch lists error')
            if(err.message === "Unauthenticated.") {
                navigate('../login')
            }
        })
    }, [])

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
            unit: u.target.value
        }
        axios.get('/api/v1/topics', {params: data}).then((res) => {
            setSelectedTopics(res.data)
            setUnitLoading(false)
        }).catch((err) => {
            handleError('tu')
        })
        setDisableTopic(false)
        
    }

    const handleServerError = () => {
        setErrorMessage('通信に失敗しました')
        setIsError(true)
    }

    const handleError = (message: string) => {
        setErrorMessage(message)
        setIsError(true)
    }

    const onChangeTopic = (event, newInputValue) => {
        setTopicName(newInputValue)
    }

    const updateList = (num: number) =>{
        const data = {
            max_pos: list.max_pos + num
        }
        axios.put('/api/v1/lists/update/'  + urlParams.id, data).then((res) => {
            // setList(res.data)
            setLoading(false)
            setDisable(false)
            dispatch(setList(res.data))
            dispatch(closeDialog())
        }).catch((err) => {
            handleError('list update error')
            setLoading(false)
            setDisable(false)
        })
    }

    const onSubmit = () => {
        if(titleRef.current.value.trim() && subject.trim() && unit.trim() && topicName.trim() && textRef.current.value.trim()) {
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
                        title: titleRef.current.value.trim(),
                        topic_id: topicToRegister.id,
                        question: questionRef.current.value.trim(),
                        text: textRef.current.value.trim(),
                        memo: memoRef.current.value.trim(),
                        position: list.max_pos + 1,
                        is_public: true,
                        user_id: auth.user.id,
                        list_id: urlParams.id,
                        publisher_id: auth.user.id,
                    }
                    axios.post('/api/v1/statements/create', dataToSend).then((stm) => {
                        const newStm = Object.assign(stm.data, {
                            topic: topicToRegister
                        })
                        const newStatements = [...statementArray, newStm]
                        dispatch(setStatementArray(newStatements))
                        updateList(1)
                    }).catch((err) => {
                        handleError('create statement error')
                        setLoading(false)
                        setDisable(false)
                        setDisableUnit(false)
                        setDisableTopic(false)
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
                            title: titleRef.current.value.trim(),
                            topic_id: res.data.id,
                            question: questionRef.current.value.trim(),
                            text: textRef.current.value.trim(),
                            memo: memoRef.current.value.trim(),
                            position: list.max_pos + 1,
                            is_public: true,
                            user_id: auth.user.id,
                            list_id: urlParams.id,
                            publisher_id: auth.user.id,
                        }
                        axios.post('/api/v1/statements/create', dataToSend).then((stm) => {
                            const newStm = Object.assign(stm.data, {
                                topic: res.data
                            })
                            const newStatements = [...statementArray, newStm]
                            dispatch(setStatementArray(newStatements))
                            updateList(1)
                        }).catch((err) => {
                            handleError('create statement error')
                            setLoading(false)
                            setDisable(false)
                            setDisableUnit(false)
                            setDisableTopic(false)
                        })
                    }).catch((err) => {
                        handleError('create topic error')
                        setLoading(false)
                        setDisable(false)
                        setDisableUnit(false)
                        setDisableTopic(false)
                    })
                }
                
            } else {
                handleError('ログインし直してください')
            }
        } else {
            handleError('すべての欄に記入してください')
        }
    }
    const handleCloseDialog = () => {
        dispatch(closeDialog())
    }

    return(
        <Fragment>
            <AppBar sx={{bgcolor: 'black', position: 'relative'}}>
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
                    新規作成
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
                                    inputRef={titleRef}
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
                                    inputRef={questionRef}
                                />
                            </FormControl>
                            <FormControl disabled={isDisable} fullWidth margin="normal">
                                <TextField 
                                    fullWidth
                                    multiline
                                    variant="outlined" 
                                    label="論証"
                                    inputRef={textRef}
                                />
                            </FormControl>
                            <FormControl disabled={isDisable} fullWidth margin="normal">
                                <TextField 
                                    fullWidth
                                    multiline
                                    variant="outlined" 
                                    label="メモ"
                                    inputRef={memoRef}
                                />
                            </FormControl>
                            <div className="mt-4 text-center">
                                <LoadingButton
                                    type="submit"
                                    loading={loading}
                                    variant="contained"
                                    onClick={onSubmit}
                                >
                                    追加
                                </LoadingButton>
                                {isError && <span className="block text-red-400 mt-1">{errorMessage}</span>}
                            </div>
                        </div>
                        {/* <div>{statement}</div> */}
                    </CardContent>
                </Card>
            </Container>
        </Fragment>
    )
}

export default CreateStatement