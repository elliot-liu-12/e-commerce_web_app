import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { Grid } from '@mui/material';
import {
    PaymentElement,
    useStripe,
    useElements
  } from "@stripe/react-stripe-js";

const Form = () =>
{
    const handleSubmit = async () => {

        if(!stripe)
            return;

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams : {
                return_url: "http://localhost:3000"
            },
        })

        if (error.type)
        {
            setMessage(error.message);
            console.log(message);
        }
        
        setIsLoading(false);
    }
    
    const paymentElementOptions = {
        layout: "tabs"
    }

    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    return (
    <Grid container>
        <Grid item xs = {4} mx={"35%"} my={"5%"}>
            <PaymentElement id="payment-element" options={paymentElementOptions} />
            <Box sx={{my: "4%"}}>
                <Button variant="contained"
                onClick={handleSubmit}>Submit</Button>
            </Box>
        </Grid>
    </Grid>
    )
}

export default Form;
