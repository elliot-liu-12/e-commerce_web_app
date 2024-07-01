import { useState } from 'react';
import { useContext } from 'react'; 
import { FormControl } from '@mui/material';
import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { TextField } from '@mui/material/';
import { Typography } from '@mui/material/';
import { useFormik } from 'formik';
import AuthContext from '../../providers/AuthProvider';


async function backendReq(values)
{
    try {
        const resp = await fetch("http://127.0.0.1:5000/login",
        {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
                
            },
            body: JSON.stringify(values),
            credentials: "include"
        }).then(reply => {
            return reply.text()
        })
        return resp
    }
    catch(error) {
        return 500;
    }
}


//close with npx kill-port [port]
const Login = () =>
{
    //initialize form object
    const formik = useFormik ({
        initialValues: {
            email: '',
            username: '',
            password: ''
        },
        onSubmit: values => {
           backendReq(values).then((token) =>
           {
                if(token != "")
                {
                    console.log("login successful");
                    sessionStorage.setItem("token", token);
                    setLoginState(true);
                    setAuthToken(token);
                    //window.location.replace("/");
                }
                else
                {
                    setErrorState(true);
                }
           })
        },
    })

    const [errorState, setErrorState] = useState(false);
    //must use curly braces for context things
    const {authToken, setAuthToken, loginState, setLoginState} = useContext(AuthContext);
    return (
        <Box>
        <FormControl sx={{mx:"40%", my:"2%"}}>
            <TextField
            id="username" 
            name="username"
            label="Username/Email"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value= {formik.values.username}
            margin="normal"
            />
            {formik.touched.username && formik.errors.username ? <div style={{color:"#FF0000"}}>{formik.errors.username}</div> : null}   
            
            <TextField
            id="password"
            name="password"
            label="Password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            margin="normal"
            />
            {formik.touched.password && formik.errors.password ? <div style={{color:"#FF0000"}}>{formik.errors.password}</div> : null}
                
                <Button onClick={formik.handleSubmit} sx={{my:"10%"}} variant="contained">Log In</Button>
                {errorState ? <Typography sx={{color:"#C70039"}}>Username or password is incorrect</Typography> : null}
        </FormControl>

        <Typography sx={{ml:"40%"}}>No account? <a href="/signup">Sign up</a></Typography>
    </Box>
    )
}

export default Login