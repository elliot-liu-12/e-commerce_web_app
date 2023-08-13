
import AppBar from '@mui/material/AppBar';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () =>
{
return (
<AppBar position="relative">
    <Toolbar>
        <a href="/" style={{color: "#FFFFFF"}}>
        <ShoppingBagIcon sx={{ mr: 2 }} />
        </a>
        <Typography variant="h6" color="inherit" noWrap>
            Shop
        </Typography>
    </Toolbar>
</AppBar>
)

}

export default Header;