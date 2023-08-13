
import AppBar from '@mui/material/AppBar';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = () =>
{
return (
<AppBar position="relative">
    <Toolbar>
        <ShoppingBagIcon sx={{ mr: 2 }} />
            <Typography variant="h6" color="inherit" noWrap>
                Shop
            </Typography>
    </Toolbar>
</AppBar>
)

}

export default Header;