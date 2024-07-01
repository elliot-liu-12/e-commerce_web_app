import { useState } from 'react';
import { FormControl } from '@mui/material';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { TextField } from '@mui/material/';
import { Typography } from '@mui/material/';
import { useFormik } from 'formik';

//TODO: make password difficulty meter/requirements, make username/email errors live instead of on submit
    //performs validation on input (must be outside of component and named validate to work)
    const validate = values => {
        const errors = {};

        //enforce username requirements 
        if(!values.username)
        {
            errors.username = "Required";
        } else if (values.username.length < 4)
        {
            errors.username = "Username is too short"
        } else if (values.username.length > 30)
        {
            errors.username = "Username is too long"
        }
        
        //enforce email requirements
        if(!values.email)
        {
            errors.email = "Required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email))
        {
            errors.email="Invalid Email"
        }

        //enforce password requirements
        if(!values.password)
        {
            errors.password = "Required";
        } else if(values.password.length < 6)
        {
            errors.password="Password is too short";
        } else if(values.password.length > 50)
        {
            errors.password="Password is too long";
        } //TODO: Add more password conditions

        return errors;
    }

    async function backendReq(values)
    {
        try
        {
            const resp = await fetch("http://127.0.0.1:5000/signup",
            {
                method: "POST",
                headers: {
                    //specifies that data is in JSON
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            }
            )
            return resp.status;
        }
        catch (error) {
            console.error(error);
            return 500;
        }
    }

//close with npx kill-port [port]
const Signup = () =>
{
    //initialize form object
    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: ''
        },
        validate,
        onSubmit: values => {
            //async functions will always return a promise
            backendReq(values).then((value) =>
            {
                if (value === 200)
                {
                    setUniqueEmailError(false)
                    setUniqueUsernameError(false)
                    window.location.replace("/")
                }
                else if(value === 600)
                {
                    setUniqueEmailError(true)
                    setUniqueUsernameError(true)
                }
                else if(value === 601)
                {
                    setUniqueEmailError(false)
                    setUniqueUsernameError(true)
                }
                else if(value === 602)
                {
                    setUniqueEmailError(true)
                    setUniqueUsernameError(false)
                }
                else
                {
                    console.log("something went wrong")
                }
            })
        },
    })

    const [uniqueUsernameError, setUniqueUsernameError] = useState(false)
    const [uniqueEmailError, setUniqueEmailError] = useState(false)

    return (
        <Box>
        <FormControl sx={{mx:"10%", my:"2%", width:"80%"}}>
            <TextField
            id="email"
            name="email"
            label="Email"
            type="text"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value = {formik.values.email}
            margin="normal"
            />
            {/*If there is an error with the email, display the divs. Otherwise, display nothing*/}
            {formik.touched.email && formik.errors.email ? <div style={{color:"#FF0000"}}>{formik.errors.email}</div> : null}
            {uniqueEmailError ? <Typography sx={{"color": "#C70039"}}>Email is already taken</Typography> : null}
            <TextField
            id="username" 
            name="username"
            label="Username"
            type="text"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value= {formik.values.username}
            margin="normal"
            />
            {formik.touched.username && formik.errors.username ? <div style={{color:"#FF0000"}}>{formik.errors.username}</div> : null}   
            {uniqueUsernameError ? <Typography sx={{"color": "#C70039"}}>Username is already taken</Typography>: null}
            <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            required
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            margin="normal"
            />
            {formik.touched.password && formik.errors.password ? <div style={{color:"#FF0000"}}>{formik.errors.password}</div> : null}
        </FormControl>
        <Button onClick={formik.handleSubmit} sx={{ml:"10%"}} variant="contained">Sign up</Button>  
        <Typography sx={{ml:"40%"}}>Already have an account? <a href="/login">Log in</a></Typography>
    </Box>
    )
}

export default Signup