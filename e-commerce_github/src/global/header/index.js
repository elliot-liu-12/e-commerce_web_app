import AppBar from '@mui/material/AppBar';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../providers/AuthProvider'

const Header = () =>
{
const {loginState, setLoginState} = useContext(AuthContext);

return (
<AppBar position="relative">
    <Toolbar>
        <Box style={{color: "#FFFFFF"}} component={Link} to="/"> 
            <ShoppingBagIcon sx={{ mr: 2 }} to="/"/>
        </Box>
        <Typography variant="h6" color="inherit" noWrap sx={{flexGrow: 1}}>
            Shop
        </Typography>
        {/*if the state says that the user is logged in, display a different button*/}

        <div className="login-button" >
            { loginState ?  <Button variant="text" color="inherit" component={Link} to="/account">
            My Account
            </Button> : <Button variant="text" color="inherit" component={Link} to="/login">
            Log In
            </Button>}
        </div>
    </Toolbar>
</AppBar>
)

}

export default Header;