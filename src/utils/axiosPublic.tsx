import axios, { AxiosInstance } from 'axios'
import Backendless from 'backendless'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://caringship.backendless.app/api/',
})
