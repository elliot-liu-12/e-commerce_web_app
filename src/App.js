import * as React from 'react';
import { useSessionState } from 'react';
import { UIProvider } from './global/context/index'
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FrontPage from './pages/front/index';
import ItemPage from './pages/item/index';
import VariableItemPage from './pages/var-item/index';
import Header from './global/header/index';
import Checkout from './pages/checkout/index';
import Login from './pages/login/index';
import Signup from './pages/signup/index';
import AccountPage from './pages/account/index';
import Cart from './global/cart/index';

function App() {
  //don't change the state here
  const [isLoggedIn, setLoginState] = useState(false);

  const handleLogin = () => {
    setLoginState(true)
  }

  return (
<div className="app">
<UIProvider>
    <Header isLoggedIn={isLoggedIn} setLoginState={setLoginState}/>
      <Cart />
      <Routes>
        <Route path='/' element={<FrontPage/>}/>
        <Route path='/item' element={<ItemPage />}/>
        <Route path='/var-item' element={<VariableItemPage />}/>
        <Route path='/login' element={<Login setLoginState={setLoginState}/>}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/account' isLoggedIn={isLoggedIn} setLoginState={setLoginState} element={<AccountPage />} />
        <Route path='/item/checkout' element={<Checkout />}/>
      </Routes>
</UIProvider>
</div>
  );
}

export default App;
