import * as React from 'react';
import { useSessionState } from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FrontPage from './pages/front/index';
import ItemPage from './pages/item/index';
import Header from './global/header/index';
import Checkout from './pages/checkout/index';
import Login from './pages/login/index';
import Signup from './pages/signup/index';
import AccountPage from './pages/account/index';

function App() {
  //don't change the state here
  const [isLoggedIn, setLoginState] = useState(false);

  const handleLogin = () => {
    setLoginState(true)
  }

  return (
<div className="app">
    <Header isLoggedIn={isLoggedIn} setLoginState={setLoginState}/>
        <Routes>
          <Route path='/' element={<FrontPage/>}/>
          <Route path='/item' element={<ItemPage />}/>
          <Route path='/login' element={<Login setLoginState={setLoginState}/>}/>
          <Route path='/signup' element={<Signup />}/>
          <Route path='/account' isLoggedIn={isLoggedIn} setLoginState={setLoginState} element={<AccountPage />} />
          <Route path='/item/checkout' element={<Checkout />}/>
        </Routes>
</div>
  );
}

export default App;
