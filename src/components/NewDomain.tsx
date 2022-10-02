import React, { FC, useCallback, useEffect, useState } from 'react'

import { ModalProps } from '../interfaces/type'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Slide from '@mui/material/Slide'
import Grid from '@mui/material/Unstable_Grid2'
import MenuItem from '@mui/material/MenuItem'
import dayjs, { Dayjs } from 'dayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'
import { TransitionProps } from '@mui/material/transitions'
import axios, { AxiosResponse } from 'axios'
import { useSnackbar, VariantType } from 'notistack'
import { axiosInstance } from '../utils/axiosPublic'

const hostingList = [
  {
    value: 'Vultr',
    label: 'Vultr',
  },
  {
    value: 'Kamatera',
    label: 'Kamatera',
  },
  {
    value: 'Aruba',
    label: 'Aruba',
  },
  {
    value: 'OVH',
    label: 'OVH',
  },
  {
    value: 'none',
    label: 'None',
  },
]

const providerList = [
  {
    value: 'OVH',
    label: 'OVH',
  },
  {
    value: 'Aruba',
    label: 'Aruba',
  },
  {
    value: 'Register',
    label: 'Register',
  },
  {
    value: 'Other',
    label: 'Other',
  },
  {
    value: 'none',
    label: 'None',
  },
]

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const NewDomain: FC<ModalProps> = ({ open, setOpen, setRefetchData }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [domain, setDomain] = useState<any>({
    name: '',
    defaultMessage: 'Insert the domain without www.',
    error: false,
    errorMessage: '',
  })
  const [price, setPrice] = useState<any>({
    value: 0,
    defaultMessage: 'Insert the price without symbol',
    error: false,
    errorMessage: '',
  })
  const [hosting, setHosting] = useState<string>()
  const [provider, setProvider] = useState<string>()
  const [expDate, setExpDate] = useState<Dayjs | null>(dayjs(new Date()))
  const [mail, setMail] = useState<boolean>(false)

  const handleClose = useCallback(() => {
    setOpen({ ...open, status: false })
  }, [open])

  const handleDomain = useCallback(
    (e: any) =>
      setDomain({
        ...domain,
        name: e.target.value,
        error: e.target.value.includes('www.') ? true : false,
        errorMessage: e.target.value.includes('www.')
          ? 'You have to insert the domain without www.'
          : '',
      }),

    [domain]
  )

  const handleHosting = useCallback(
    (e: any) => {
      setHosting(e.target.value)
    },
    [hosting]
  )

  const handleProvider = useCallback(
    (e: any) => {
      setProvider(e.target.value)
    },
    [provider]
  )

  const handleExpDate = (newValue: Dayjs | null) => {
    setExpDate(newValue)
  }

  const handlePrice = useCallback(
    (e: any) =>
      setPrice({
        ...price,
        value: e.target.value,
      }),

    [price]
  )

  const handleMail = useCallback(() => {
    setMail(!mail)
  }, [mail])

  const submitDomain = useCallback(() => {
    axiosInstance({
      method: 'put',
      url: 'data/DOMAINS',
      headers: {
        'user-token': Backendless.LocalCache.get('user-token'),
      },
      data: {
        exp_date: dayjs(expDate),
        domain_name: domain.name,
        hosting_service: hosting,
        provider: provider,
        mail_service: mail,
        sell_price: parseInt(price.value),
        objectId: open.id,
      },
    }).then((res: AxiosResponse) => {
      if (res.status === 200) {
        enqueueSnackbar('Domain saved succesfully', { variant: 'success' })
        setOpen({ ...open, status: false })
        setRefetchData(true)
      }
    })
  }, [hosting, domain.name, expDate, provider, mail, price.value])

  useEffect(() => {
    setRefetchData(false)

    if (open.id) {
      axiosInstance({
        method: 'get',
        url: 'data/DOMAINS/' + open.id,
      }).then((res: AxiosResponse) => {
        setDomain({ ...domain, name: res.data.domain_name })
        setExpDate(dayjs(res.data.exp_date))
        setHosting(res.data.hosting_service)
        setProvider(res.data.provider)
        setMail(res.data.mail_service)
        setPrice({ ...price, value: res.data.sell_price })
      })
    }
  }, [, open.status, open.id])

  return (
    <Dialog
      fullScreen
      open={open.status}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            New domain
          </Typography>
          <Button autoFocus color="inherit" onClick={submitDomain}>
            save
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          padding: 3,
        }}
      >
        <Grid container spacing={4}>
          <Grid xs={3}>
            <TextField
              sx={{
                width: '100%',
              }}
              error={domain.error}
              id="outlined-error-helper-text"
              label="Domain"
              value={domain.name}
              helperText={
                domain.error ? domain.errorMessage : domain.defaultMessage
              }
              onChange={handleDomain}
            />
          </Grid>
          <Grid xs={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Expiration Date"
                inputFormat="MM/DD/YYYY"
                value={expDate}
                onChange={handleExpDate}
                renderInput={params => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid xs={4}>
            <TextField
              sx={{
                width: '100%',
              }}
              error={price.error}
              id="outlined-error-helper-text"
              label="Price"
              value={price.value}
              helperText={
                price.error ? price.errorMessage : price.defaultMessage
              }
              onChange={handlePrice}
            />
          </Grid>
          <Grid xs={3}>
            <TextField
              id="outlined-select-currency"
              select
              label="Hosting"
              value={hosting}
              onChange={handleHosting}
              helperText="Please select your Hosting"
            >
              {hostingList.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={3}>
            <TextField
              id="outlined-select-currency"
              select
              label="Provider"
              value={provider}
              onChange={handleProvider}
              helperText="Please select your Provider"
            >
              {providerList.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid xs={4}>
            <FormGroup>
              <FormControlLabel
                control={<Switch onChange={handleMail} />}
                label="Mail"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  )
}
export default NewDomain
