import { FC, HTMLInputTypeAttribute, RefObject, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { AxiosResponse } from 'axios'
import { axiosInstance } from '../utils/axiosPublic'
import { useNavigate } from 'react-router-dom'
import Backendless from 'backendless'
import { User } from '../interfaces/type'
import { useSnackbar } from 'notistack'
import { Md5 } from 'ts-md5'

const SignUp: FC = () => {
  const user = useRef<any>()
  const pass = useRef<any>()
  const { enqueueSnackbar } = useSnackbar()
  const navigate = useNavigate()

  const handleSignUp = () => {
    Backendless.UserService.register({
      user: user.current,
      email: user.current,
      password: Md5.hashStr(pass.current),
    })
      .then((res: any) => {
        enqueueSnackbar('You are registerd', {
          variant: 'success',
        })
        navigate('/login')
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
        type="email"
        placeholder="johndoe@email.com"
        ref={user}
        onChange={e => (user.current = e.target.value)}
        // pass down to FormLabel as children
        label="Email"
      />
      <TextField
        name="password"
        type="password"
        ref={pass}
        onChange={e => (pass.current = e.target.value)}
        placeholder="password"
        label="Password"
      />
      <Button
        sx={{
          mt: 1, // margin top
        }}
        onClick={handleSignUp}
      >
        Sign Up
      </Button>
    </Box>
  )
}

export default SignUp
