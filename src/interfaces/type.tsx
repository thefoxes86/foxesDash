import { ReactNode, Dispatch, SetStateAction } from 'react'

import { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import { GridRowId } from '@mui/x-data-grid'

export type WithChildren<T = {}> = T & { children?: ReactNode }
export type ModelDomains = {
  id: number
  domain_name: string
  exp_date: Date
  hosting_service: string
  mail_service: boolean
  provider: string
  sell_price: number
  objectId: string
}
export interface ModalDomainProps {
  status: boolean
  id: GridRowId | null
}

export interface ModalProps {
  open: ModalDomainProps
  setOpen: Dispatch<SetStateAction<ModalDomainProps>>
  setRefetchData: Dispatch<SetStateAction<boolean>>
}

export interface AppBarProps extends MuiAppBarProps {
  open?: boolean
}

export interface User {
  data: object
}
