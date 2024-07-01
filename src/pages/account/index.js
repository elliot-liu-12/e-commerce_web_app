import { Box } from '@mui/material';
import { Button } from '@mui/material';
import { TextField } from '@mui/material'
import { Typography } from '@mui/material';
import { FormControl } from '@mui/material';
import { useContext } from 'react';
import AuthContext from '../../providers/AuthProvider'
import { json } from 'react-router-dom';

const AccountPage = () =>
{
    const {loginState, setLoginState, setAuthToken, authToken} = useContext(AuthContext);
    if(loginState == false)
    {
        return(
        window.location.replace("/")
        )
    }
    else
    {
        //can't access global state if handler is inside of component fucntion
        async function handleSignout() {
            try {
               const resp = await fetch("http://127.0.0.1:5000/signout", 
               {
                    method:"POST",
                    headers: {
                        "Content-Type"  : "application/json"
                    },
                    body: authToken,
               }).then((resp) =>
               {
                console.log(resp);
                sessionStorage.clear();
                setLoginState(false);
                setAuthToken("");
                window.location.replace("/");
               })                
            }
            catch (exception) {
                console.log(exception)
                console.log("something happened")
            }
        }
        return(
        <Box>
            <FormControl sx={{mx:"40%", my:"3%"}}>
                <Typography>Account Information</Typography>

                    <TextField
                    id="username" 
                    name="username"
                    label="Username"
                    type="text"
                    value="username"
                    inputlabelprops = {{
                        readOnly: true,
                        shrink: true                    
                    }}       
                    margin="normal"
                    />

                    <TextField
                    id="email" 
                    name="email"
                    label="Email"
                    type="text"
                    value="account email"
                    inputlabelprops = {{
                        readOnly: true,
                        shrink: true                    
                    }}
                    margin="normal"/>

                    <TextField
                    id="password" 
                    name="password"
                    label="Password"
                    type="password"
                    value="account password"
                    inputlabelprops = {{
                        readOnly: true,
                        shrink: true                    
                    }}
                    margin="normal"/>
                <Button variant="contained">Change User Info</Button>                    
                <Button variant="contained" onClick={handleSignout}>Sign Out</Button>
            </FormControl>
        </Box>
        
        )
    }
}
export default AccountPage;