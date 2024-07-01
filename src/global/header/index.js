import AppBar from '@mui/material/AppBar';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Box, Button, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../../providers/AuthProvider';
import { useUIContext } from '../context/index';
import Cart from '../cart/index';

const Header = () =>
{
const { loginState, setLoginState } = useContext(AuthContext);
const { cart, setShowCart } = useUIContext();
/*
const key = sessionStorage.getItem("token");
if(key != null)
{
    setLoginState(true);
}
*/
return (
<AppBar position="relative">
    <Toolbar>
        <Box style={{color: "#FFFFFF"}} component={Link} to="/"> 
        <   ShoppingBagIcon sx={{ mr: 2 }} to="/"/>
        </Box>
        <Typography variant="h6" color="inherit" noWrap sx={{flexGrow: 1}}>
            Shop
        </Typography>

        <Box style={{color: "#FFFFFF"}} sx={{mr: 2, mb: 0.7}}>
            <Badge badgeContent={cart > 0 ? 1 : 0} color="secondary" overlap="circular" max={999}>
                <ShoppingCartIcon onClick={() => setShowCart(true)} sx={{ mr: 2, mt: 0.65  }} />
            </Badge>
        </Box>
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