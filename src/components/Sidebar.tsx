import { FC } from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import { Link } from 'react-router-dom'
type SidebarProps = {
  open: boolean
}

const Sidebar: FC<SidebarProps> = ({ open }) => {
  return (
    <>
      <List>
        {[
          { label: 'Dashboard', path: '/' },
          { label: 'Domains', path: '/domains' },
        ].map(({ label, path }, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <Link to={path}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={label} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
      <Divider />
    </>
  )
}

export default Sidebar
