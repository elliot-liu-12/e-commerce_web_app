import * as React from 'react';
import Box from '@mui/material/Box';
import {Button} from '@mui/material';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import PlaceholderImage from '../../assets/placeholder.png';
import {Link} from 'react-router-dom';



const ItemPage = () =>
{
    return (
        <Grid container>
            <CssBaseline />
            <Grid item xs={6}>
            <Container className="image" direction='row'> 
                <Card sx={{p: '10%'}} style={{border: 'none', boxShadow: 'none'}}>
                    <CardMedia 
                    component='img'
                    alt='placeholder image'
                    image={PlaceholderImage}/>
                </Card>
            </Container>
            </Grid>

            <Grid item xs={6}>
                    <Box textAlign='center' sx={{margin:'15%'}}>
                    <Typography variant='h2' sx={{}}> Placeholder Item</Typography>
                    <Typography variant='body1' sx={{m: '5%'}} textAlign='left'>Placeholder description: 
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris augue ante, 
                    euismod vel feugiat sed, ornare vel lectus. Vestibulum ante ipsum primis in faucibus
                    orci luctus et ultrices posuere cubilia curae.</Typography>
                    <Button variant='contained' sx={{mt:'3%'}} component={Link} to="checkout">Checkout</Button>
                    </Box>
            </Grid>
        </Grid>
        
    )
}

export default ItemPage