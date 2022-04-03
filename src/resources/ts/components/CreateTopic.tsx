import React, { useRef, useState } from "react";
import axios from "../lib/axios";
import {
    Container,
    Card,
    CardContent,
    Typography,
    FormControl,
    TextField,
    Grid,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { searchUnits } from '../lib/unit'

const CreateTopic = () => {
    const [loading, setLoading] = useState()
    const [subject, setSubject] = useState('')
    const [selectedUnits, setUnits] = useState([])
    const [unit, setUnit] = useState('')
    const nameRef = useRef<HTMLInputElement>()
    const [isDisableUnit, setDisableUnit] = useState(true)

    const subjects = [
        '憲法',
        "行政法",
        "民法",
        "商法",
        "民訴",
        "刑法",
        "刑訴"
    ]

    const onChangeSubject = (sub) => {
        setSubject(sub.target.value)
        setUnits(searchUnits(sub.target.value))
        setDisableUnit(false)
    }

    const onChangeUnit = (u) => {
        setUnit(u.target.value)
    }

    const onSubmit = () => {
        if(subject && unit && nameRef.current.value) {
            const data = {
                subject: subject,
                unit: unit,
                name: nameRef.current.value,
                is_available: false
            }
            axios.post('/api/v1/topics/create', data).then((res) => {
                setSubject('')
                setUnit('')
                nameRef.current.value = ''
            }).catch((err) => {
                console.log(err)
            })
        } else {

        }
    }

    return(
        <Container>
            <Card>
                <CardContent>
                    <Typography variant="h6" component="div">
                        新規作成
                    </Typography>
                    <div>
                        <Grid container rowSpacing={0} columnSpacing={2}>
                            <Grid item xs={12} sm={6}>
                                <FormControl margin="normal" fullWidth={true}>
                                    <InputLabel id="subject-label">科目</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="subject-label"
                                        label="科目"
                                        defaultValue="憲法"
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
                                <FormControl disabled={isDisableUnit} margin="normal" fullWidth={true}>
                                    <InputLabel id="unit-label">単元</InputLabel>
                                    <Select
                                        fullWidth
                                        labelId="unit-label"
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
                        <FormControl margin="normal" fullWidth>
                            <TextField 
                                fullWidth
                                variant="outlined" 
                                label="論点"
                                inputRef={nameRef}
                            />
                        </FormControl>
                        <div className="mt-4 text-center">
                            <LoadingButton
                                type="submit"
                                loading={loading}
                                variant="contained"
                                onClick={onSubmit}
                            >リストを作成する</LoadingButton>
                            {/* {errors.submit && <span className="block text-red-400">{errors.submit.message}</span>} */}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Container>
    )
}

export default CreateTopic