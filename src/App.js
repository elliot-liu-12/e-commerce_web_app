import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import FrontPage from './pages/front/index'
import ItemPage from './pages/item/index'
import Header from './global/header/index'
import Checkout from './pages/checkout/index'
import Login from './pages/login/index'
import Signup from './pages/signup/index'

function App() {
  return (
    <div className="app">
    <Header />
      <Routes>
        <Route path='/' element={<FrontPage />}/>
        <Route path='/item' element={<ItemPage />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/signup' element={<Signup />}/>
        <Route path='/item/checkout' element={<Checkout />}/>
      </Routes>
    </div>
  );
}

export default App;
