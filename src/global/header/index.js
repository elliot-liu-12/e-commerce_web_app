
import AppBar from '@mui/material/AppBar';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Button} from '@mui/material';
import {Link} from 'react-router-dom';

const Header = () =>
{
return (
<AppBar position="relative">
    <Toolbar>
        <a href="/" style={{color: "#FFFFFF"}}>
        <ShoppingBagIcon sx={{ mr: 2 }} />
        </a>
        <Typography variant="h6" color="inherit" noWrap sx={{flexGrow: 1}}>
            Shop
        </Typography>
        <div className="login-button" >
        <Button variant="text" color="inherit" component={Link} to="/login">
        Log In
        </Button>
        </div>
    </Toolbar>
</AppBar>
)

}

export default Header;