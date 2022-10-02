import { FC, useState, useCallback, useEffect, useMemo } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Fab from '@mui/material/Fab'
import AddIcon from '@mui/icons-material/Add'
import {
  DataGrid,
  GridColTypeDef,
  GridActionsCellItem,
  GridRowId,
  GridColumns,
} from '@mui/x-data-grid'
import { AxiosError, AxiosResponse } from 'axios'

import { ModalDomainProps, ModelDomains } from '../interfaces/type'
import NewDomain from '../components/NewDomain'
import { useSnackbar } from 'notistack'
import { axiosInstance } from '../utils/axiosPublic'
import Backendless from 'backendless'

const Domains: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const [rows, setRows] = useState<Array<ModelDomains>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [openModal, setOpenModal] = useState<ModalDomainProps>({
    status: false,
    id: null,
  })

  const [refetchData, setRefetchData] = useState<boolean>(false)

  const currencyFormatter = new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  })

  type Row = typeof rows[number]

  const usePrice: GridColTypeDef = {
    type: 'number',
    headerName: 'Price',
    description: 'This column has a value getter and is not sortable.',
    width: 160,
    valueFormatter: ({ value }) => currencyFormatter.format(value),
    cellClassName: 'font-tabular-nums',
  }

  const columns = useMemo<GridColumns<Row>>(
    () => [
      { field: 'objectId', headerName: 'ID', width: 90 },
      {
        field: 'exp_date',
        headerName: 'Expiration Date',
        type: 'date',
        width: 150,
        editable: true,
        valueGetter(params) {
          return new Date(params.row.exp_date)
        },
      },
      {
        field: 'domain_name',
        headerName: 'Domain',
        width: 150,
        editable: true,
      },
      {
        field: 'mail_service',
        headerName: 'Mail',
        type: 'checkbox',
        width: 110,
        editable: true,
      },
      {
        field: 'hosting_service',
        headerName: 'Hosting',
        width: 160,
      },
      {
        field: 'provider',
        headerName: 'Provider',
        width: 160,
      },
      {
        field: 'sell_price',
        ...usePrice,
      },
      {
        field: 'actions',
        type: 'actions',
        width: 100,
        getActions: (params: any) => [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={editRow(params.id)}
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={deleteRow(params.id)}
          />,
        ],
      },
    ],
    []
  )

  const deleteRow = useCallback(
    (id: GridRowId) => () => {
      setLoading(true)
      setTimeout(() => {
        axiosInstance({
          method: 'delete',
          url: 'data/DOMAINS/' + id,
          headers: {
            'user-token': Backendless.LocalCache.get('user-token'),
          },
        }).then((res: AxiosResponse) => {
          setRows(prevRows => prevRows.filter(row => row.objectId !== id))
          setLoading(false)
          enqueueSnackbar('Your domain is now deleted', {
            variant: 'success',
          })
        })
      })
    },
    [enqueueSnackbar]
  )

  const editRow = useCallback(
    (id: GridRowId) => () => {
      setOpenModal({ status: true, id: id })
    },
    []
  )

  useEffect(() => {
    setLoading(true)

    axiosInstance({
      method: 'get',
      url: 'data/DOMAINS?pageSize=100',
      headers: {
        'user-token': Backendless.LocalCache.get('user-token'),
      },
    })
      .then((res: AxiosResponse) => {
        setRows(res.data)
        setLoading(false)
      })
      .catch((err: AxiosError) => {
        enqueueSnackbar(err.message, {
          variant: 'error',
        })
        setLoading(false)
      })
  }, [, refetchData])

  return (
    <>
      <Typography paragraph>
        <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={row => row.objectId}
            pageSize={50}
            components={{
              LoadingOverlay: LinearProgress,
            }}
            loading={loading}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
          />
        </Box>
      </Typography>
      <Box
        sx={{
          '& > :not(style)': {
            m: 1,
            position: 'fixed',
            bottom: 30,
            right: 50,
          },
        }}
      >
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenModal({ status: true, id: null })}
        >
          <AddIcon />
        </Fab>
      </Box>
      {openModal.status && (
        <NewDomain
          open={openModal}
          setOpen={setOpenModal}
          setRefetchData={setRefetchData}
        />
      )}
    </>
  )
}

export default Domains
