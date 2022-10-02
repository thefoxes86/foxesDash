import Box from '@mui/material/Box'
import Header from './Header'
import DrawerHeader from './shared/DrawerHeader'

import { FC } from 'react'

const Layout: FC<{ component: JSX.Element }> = ({ component }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {component}
      </Box>
    </Box>
  )
}

export default Layout
