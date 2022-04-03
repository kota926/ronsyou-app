import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { setList } from "../redux/modules/lists";
import { Card, CardContent, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const CreateList = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors }
    } = useForm();
    const auth = useAuth();
    const [loading, setLoading] = useState(false);

    const onSubmit = (data) => {
        if(auth.user) {
            const dataToSend = {
                title: data.title,
                id: auth.user.id
            }
            setLoading(true)
            axios.post('/api/v1/lists/create', dataToSend).then((res)=>{
                setLoading(false)
                dispatch(setList(res.data))
            }).catch((err) => {
                setLoading(false)
                if(err.message === "Unauthenticated.") {
                    navigate('../login')
                }
            })
        } else {
            console.log('not loggedIn')
        }
    }
    return(
        <Card className="max-w-md mx-auto">
            <CardContent>
                <Typography variant="h6" component="div">
                    新規作成
                </Typography>
                <form className="mt-4"  onSubmit={handleSubmit(onSubmit)}>
                    <TextField 
                        fullWidth
                        variant="outlined" 
                        label="タイトル"
                        {...register('title', {
                            required: '入力してください'
                        })}
                    />
                    <div className="mt-4 text-center">
                        <LoadingButton
                            type="submit"
                            loading={loading}
                            variant="contained"
                        >リストを作成する</LoadingButton>
                        {errors.submit && <span className="block text-red-400">{errors.submit.message}</span>}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

export default CreateList