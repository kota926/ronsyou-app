import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { Card, CardContent, Container, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import BaseBar from '../components/BaseBar'

interface LoginData {
    email: string,
    password: string,
  }
  
  const Login = () => {
    const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm();
    const navigate = useNavigate()
    const auth = useAuth()
    const [loading, setLoading] = useState(false);
  
    const onSubmit = (data: LoginData) => {
      setLoading(true)
      axios.get('/sanctum/csrf-cookie').then(() => {
        auth?.signin(data).then(() => {
          navigate('../home')
        }).catch(error => {
          console.log(error)
          setError('submit', {
            type: 'manual',
            message: 'ログインに失敗しました'
          })
          setLoading(false)
        })
      })
    }
  
    return (
        <Fragment>
            <BaseBar />
            <Container>
                <Card sx={{maxWidth: 600, mx: 'auto', mt:10}}>
                    <CardContent>
                        <h1 className="text-center text-xl font-bold pb-4">ログイン</h1>
                        <p className="text-center"><Link to="/register" className="text-sm c-link">アカウントを持っていない方はこちら</Link></p>
                        <form className="py-4" onSubmit={e => {clearErrors(); handleSubmit(onSubmit)(e)}}>
                        <div className="py-4">
                            <TextField 
                            fullWidth
                            variant="outlined" 
                            label="メールアドレス" 
                            {...register('email', {
                                required: '入力してください'
                            })} 
                            />
                            {errors.email && <span className="block text-red-400">{errors.email.message}</span>}
                        </div>
                        <div className="py-4">
                            <TextField 
                            fullWidth
                            id="password"
                            type="password" 
                            variant="outlined" 
                            label="パスワード" 
                            {...register('password', {
                                required: '入力してください'
                            })} 
                            />
                            {errors.password && <span className="block text-red-400">{errors.password.message}</span>}
                        </div>
                        <div className="text-center">
                            <div>
                            <LoadingButton loading={loading} type="submit" variant="contained" fullWidth>Login</LoadingButton>
                            </div>
                            {errors.submit && <span className="block text-red-400">{errors.submit.message}</span>}
                        </div>
                        </form>
                    </CardContent>
                </Card>
            </Container>
        </Fragment>
    )
  }
  
  export default Login