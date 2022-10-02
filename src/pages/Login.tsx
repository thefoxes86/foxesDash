import { FC, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { AxiosResponse } from 'axios'
import { axiosInstance } from '../utils/axiosPublic'
import { Link, useNavigate } from 'react-router-dom'
import Backendless from 'backendless'
import { User } from '../interfaces/type'
import { useSnackbar } from 'notistack'
import Typography from '@mui/material/Typography'
import { Md5 } from 'ts-md5'

const Login: FC = () => {
  const user = useRef<any>()
  const pass = useRef<any>()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const handleLogin = () => {
    Backendless.UserService.login(user.current, Md5.hashStr(pass.current), true)
      .then((res: any) => {
        enqueueSnackbar('You are logged in', {
          variant: 'success',
        })
        navigate('/')
      })
      .catch((err: any) => {
        enqueueSnackbar(`${err.code} - ${err.message}`, {
          variant: 'error',
        })
      })
  }

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <TextField
        // html input attribute
        name="email"
        ref={user}
        type="email"
        placeholder="johndoe@email.com"
        onChange={e => (user.current = e.target.value)}
        // pass down to FormLabel as children
        label="Email"
      />
      <TextField
        name="password"
        ref={pass}
        type="password"
        onChange={e => (pass.current = e.target.value)}
        placeholder="password"
        label="Password"
      />
      <Button
        sx={{
          mt: 1, // margin top
        }}
        onClick={handleLogin}
      >
        Log in
      </Button>
      <Typography component={'p'}>
        <Link to={'/signup'}>Sign Up</Link>
      </Typography>
    </Box>
  )
}

export default Login
