import { Drawer, Avatar, Typography, Divider, Paper, Button } from '@mui/material';
import { useUIContext } from '../context/index';
import { Box } from '@mui/system';
import PlaceholderImage from '../../assets/placeholder.png';
export default function Cart() {
    const { cart, showCart, setShowCart } = useUIContext();
    const cartItem = (
        <Box>
            <Box
            display="flex"
            sx={{ pt:2, pb:2 }}
            alignItems="start"
            justifyContent={"space-between"}>
                <Avatar src={PlaceholderImage} sx={{width:96, height: 96, mr:2}} />
                <Box display="flex" flexDirection={"column"}>
                    <Typography variant="h6">Placeholder Item</Typography>
                    <Typography variant="subtitle2">Lorem Ipsum dolor amet</Typography>
                </Box>
                <Typography variant="body1" justifyContent={"end"}>
                    0
                </Typography>
            </Box>
            <Divider variant="inset" />
        </Box>
    );

    return (
        <Drawer 
        open={showCart}
        onClose={() => setShowCart(false)}
        anchor='right'
        PaperProps={{
            sx: {
                width: 500,
                borderRadius: 0
            }
        }}>
        <Box 
        sx={{p:4}}
        display="flex"
        justifyContent={"center"}
        flexDirection="column"
        alignItems="center">
            <Typography variant="h3">My Cart</Typography>
            <Paper
            elevation={0}
            sx={{
                mt: 2,
                width: '90%',
                padding: 4
            }}>

                {cart ? cartItem : null}
                <Button>Remove from Cart</Button>
            </Paper>
        </Box>

        </Drawer>
    );
}