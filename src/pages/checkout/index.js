import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { Box } from '@mui/material';
//if the stripe version is a github link in the JSON, reinstall Stripe with a specific version number
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import Form from "../form/index";
import { useUIContext } from "../../global/context/index";

var loadCount = 0;
const Checkout = () =>
{
    const password = "testing";
    const stripePromise = loadStripe("pk_test_51NczmlFYi6KCR1Fw7sBy7JpCBYDkgPOnoGsfLYFHIfpa1j0TI9sXrptHDXZsQgNLDzqW4ho2pULrWMSrzMqMNlem00JEI4XCfb");
    const { cart } = useUIContext();
    const [clientSecret, setClientSecret] = useState("");
    useEffect(() => {
            //Gets the secret as soon as the page loads
            console.log("rendered");
            fetch("http://127.0.0.1:5000/secret", {
            method: "POST",
            headers: { "Content-Type": "application/json"
        },
            body: JSON.stringify({ quantity : cart })
            }) 
            .then((response) => response.json()) 
            .then((responseJSON) => { //must use exact field name
                setClientSecret(responseJSON.client_secret)
                console.log(clientSecret);
            });
            loadCount++;
        }

    , []);

    const appearance = {
        theme: 'stripe',
    };

    const options = {
        clientSecret,
        appearance,
    };

    return (
        <div>
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                  <Form />
                </Elements>
              )}
        </div>
        )
}

export default Checkout;
