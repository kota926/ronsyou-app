import React, { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setStatementArray } from "../redux/modules/statementArray";
import {
    FormControl,
    Box,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Stack,
    Button,
    Grid,
    Autocomplete,
    CircularProgress,
    Divider,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { searchUnits } from "../lib/unit";
import axios from "../lib/axios";
import { LoadingButton } from "@mui/lab";

const SearchBox = (props) => {
    const dispatch = useDispatch()

    const subjects = [
        '憲法',
        "行政法",
        "民法",
        "商法",
        "民訴",
        "刑法",
        "刑訴"
    ]

    const [subject, setSubject] = useState('')
    const [isDisableUnit, setIsDisableUnit] = useState(true)
    const [selectedUnits, setSelectedUnits] = useState([])
    const [unit, setUnit] = useState('')
    const [selectedTopics, setSelectedTopics] = useState([])
    const [topicLoading, setTopicLoading] = useState(false)
    const [isDisableTopic, setDisaboeTopic] = useState(true)
    const [topic, setTopic] = useState('')
    const wordRef = useRef<HTMLInputElement>()
    const [btnLoading, setBtnLoading] = useState(false)

    const onChangeSubject = (e) => {
        setSubject(e.target.value)
        setSelectedUnits(searchUnits(e.target.value))
        setIsDisableUnit(false)
    }
    const onChangeUnit = (e) => {
        setUnit(e.target.value)
        setTopicLoading(true)
        setDisaboeTopic(false)
        axios.get('/api/v1/topics/' + subject + '/' + e.target.value + '/').then((res) => {
            setSelectedTopics(res.data)
            setTopicLoading(false)
        }).catch((err) => {
            console.log(err)
        })
    }

    const onChangeTopic = (event, newInputValue) => {
        setTopic(newInputValue)
    }

    const onClickSearch = () => {
        if(subject || wordRef.current.value.trim()) {
            setBtnLoading(true)
            setIsDisableUnit(true)
            setDisaboeTopic(true)
            const data = {
                subject: subject,
                unit: unit,
                topic: topic.trim(),
                word: wordRef.current.value.trim(),
            }
            axios.get('/api/v1/statements/', {params: data}).then((res) => {
                dispatch(setStatementArray(res.data))
                props.finishSearching()
            }).catch((err) => {
                console.log(err)
            })
        } else {
            setBtnLoading(true)
            setIsDisableUnit(true)
            setDisaboeTopic(true)
            axios.get('/api/v1/statements/').then((res) => {
                dispatch(setStatementArray(res.data))
                props.finishSearching()
            }).catch((err) => {
                console.log(err)
            })
        }
    }

    return(
        <Box sx={{ mx: 4, mb: 3}}>
            <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            spacing={2}
            >
                <Grid container rowSpacing={0} columnSpacing={2}>
                    <Grid item xs={12} sm={6}>
                        <FormControl disabled={btnLoading} margin="normal" fullWidth={true}>
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
                    loading={topicLoading}
                    inputValue={topic}
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
                                {topicLoading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                            }}
                        />
                    )}
                    />
                </FormControl>
                <Divider />
                <FormControl fullWidth margin="normal">
                    <TextField 
                        fullWidth
                        multiline
                        disabled={btnLoading}
                        variant="outlined" 
                        label="キーワード検索"
                        inputRef={wordRef}
                    />
                </FormControl>
                <LoadingButton
                    variant="outlined"
                    loading={btnLoading}
                    loadingPosition="start"
                    startIcon={<SearchIcon/>}
                    onClick={onClickSearch}
                    sx={{my: 2, px: 1}}
                >
                    検索
                </LoadingButton>
            </Stack>
        </Box>
    )
}

export default SearchBox