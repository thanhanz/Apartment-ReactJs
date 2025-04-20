import { useContext } from "react"
import AuthContext from "../../config/Contexts"
import { useNavigate } from "react-router-dom"
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
const Logout = () => {
    const {dispatch}= useContext(AuthContext)
    const navigate = useNavigate()

    const handleLogout = () => {
        setTimeout(() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("user");
            
            dispatch({ type: "LOGOUT" });
            navigate("/login");
        }, 0);
    };

    return (
        <ListItem disablePadding>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>

          <LogoutIcon style={{color:"red"}} />
          </ListItemIcon>

          <ListItemText primary={"Logout"} style={{color:"red"}}/>
        </ListItemButton>
      </ListItem>
    )

};

export default Logout;