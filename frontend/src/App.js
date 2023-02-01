import './App.css';
import {BrowserRouter as Router,Routes,Route, Link} from "react-router-dom";
import Least from "./components/LeastSquareform"
import Form from './components/LinearRegression';
import Interface from './components/Home';
import Sparepart from './components/Spareparts';
// import { useState } from 'react';


function App() {
  // const [visible, setVisible] = useState(false);

  const open = () => {
    const menu = document.querySelector('#nav-menu-div');
    menu.classList.toggle('active');
  }

  const close = ()=>{
    const menu = document.querySelector('#nav-menu-div');
    menu.classList.toggle('close');
  }
  

  return(
    <div className='App'>
      <div id="homeTop">
        <ul>
          <li>₱しひㅜㅇ৲</li>
          <li><img alt='img' src="https://miro.medium.com/max/1200/1*DSJ2Xe8uz633S1ZEBSwV1A.png"></img></li>
        </ul>
        
      </div>
      <ul id='menu-icon' onClick={open}>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      
      
      <Router>
        <div id='nav-menu-div'>
          <ul id='menu-close' onClick={close}>
            <li></li>
            <li></li>
          </ul>
          <div id='Router'>
            <Link to='/' id='Link'><li id='home'><a href="/">Home</a></li></Link>
            <Link to="/spare" id='spare'><li><a href="least">Spare parts forecasting</a></li></Link>
          </div>
          <div className="dropdown">
            <button  type="button" data-toggle="dropdown">Forecast sales<span>&#8964;</span></button>
            <ul className="dropdown-menu">
              <Link to="/linear"><li><a href="linear">Linear Regression</a></li></Link>
              <Link to="/least"><li><a href="least">Least Square Regression</a></li></Link>
            </ul>
          </div>

        </div>
        <Routes>
          <Route path='/' element={<Interface />} />
          <Route path ='/least' element={<Least/>} />
          <Route path ='/linear' element={<Form/>} />
          <Route path ='/spare' element={<Sparepart/>} />
        </Routes>
      </Router>
    </div>
  )
}

export default App;