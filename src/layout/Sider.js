import React, { useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ArticleIcon from '@mui/icons-material/Article';
import FeedbackIcon from '@mui/icons-material/Feedback';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import LoginIcon from '@mui/icons-material/Login';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../config/Contexts';
import Logout from '../components/APIs/Logout';

const drawerWidth = 240;

export default function Sider(props) {
  const {content} = props;
  const location = useLocation();
  const path = location.pathname
  const navigate = useNavigate()
  const {user} = useContext(AuthContext)

  return (  
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            AVC Apartment
          </Typography>

          {user && (
            <Typography variant="h8" sx={{ ml: "auto", mr: 2 }} style={{color: "yellow"}}>
              Welcome, {user.username}
            </Typography>
          )}

        </Toolbar>
      </AppBar>


      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
          
              <ListItem key={1} disablePadding>
                <ListItemButton component={Link} to="/monthly-fee" selected={"/monthly-fee" === path}>
                  <ListItemIcon>
                     <AttachMoneyIcon />

                  </ListItemIcon>
                  <ListItemText primary={"Monthly Fee"} />
                </ListItemButton>
              </ListItem>

              <ListItem key={2} disablePadding>
                <ListItemButton component={Link} to="/surveys" selected={"/surveys" === path}>
                  <ListItemIcon>
                     <ArticleIcon />

                  </ListItemIcon>
                  <ListItemText primary={"Surveys"} />
                </ListItemButton>
              </ListItem>

              <ListItem key={3} disablePadding>
                <ListItemButton component={Link} to="/feedbacks" selected={"/feedbacks" === path}>
                  <ListItemIcon>
                   
                     <FeedbackIcon />

                  </ListItemIcon>
                  <ListItemText primary={"Feedbacks"} />
                </ListItemButton>
              </ListItem>

              <ListItem key={4} disablePadding>
                <ListItemButton component={Link} to="/locker/packages" selected={"/locker/packages" === path}>
                  <ListItemIcon>
                     
                  <Inventory2Icon />
                  </ListItemIcon>
                  <ListItemText primary={"Storage Locker"} />
                </ListItemButton>
              </ListItem>

          </List>
          <Divider />
          { user ? 
            <Logout/>
          :
          <ListItem key={6} disablePadding>
                <ListItemButton component={Link} to="/login" selected={"/login" === path}>
                  <ListItemIcon>
                  <LoginIcon style={{color:"blueviolet"}} />
                  </ListItemIcon>
                  <ListItemText primary={"Login"} style={{color:"blueviolet"}}/>
                </ListItemButton>
              </ListItem>
          }
          
          </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
       {content}
      </Box>
    </Box>
  );
}
