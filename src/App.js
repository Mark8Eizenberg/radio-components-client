import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {SignIn} from './components/SignIn'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";
import { Alert, Nav, Navbar } from 'react-bootstrap';
import {userRolesLinks} from './utils/UserRoles'
import { useState } from 'react';

function App() {
  const [message, setMessage] = useState(null);

  if(localStorage.token){
    if(localStorage.validTo !== undefined){
      var today = new Date();
      var validTokenDate = new Date(localStorage.validTo);
      if(today > validTokenDate){
        localStorage.clear();
        setMessage(<Alert 
            className='w-100'
            variant='danger' 
            dismissible 
            onClose={() => setMessage(null)}
        >Час дії вашого токена вичерпаний увійдіть знову</Alert>)
      }
    } else {
      localStorage.clear();
      setMessage(<Alert 
            className='w-100'
            variant='danger' 
            dismissible 
            onClose={() => setMessage(null)}
        >Для користування сайтом спочатку необхідно увійти, або отримати аккаунт у адміністратора</Alert>)
    }
  } 

  return  <div className="App">
      {message}
      {localStorage.token ? <Router>
        <Navbar collapseOnSelect bg='light' expand='lg'>
        <Navbar.Brand href="#">Облік радіокомпонентів</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className='pills-from-navbar' defaultActiveKey="/home">
              {userRolesLinks[localStorage.userRole].map((link, index) => 
                <Nav.Item key={index}>
                  <Nav.Link as={NavLink} to={link.link} end >{link.name}</Nav.Link>
                </Nav.Item>  
              )}
              <Nav.Item>
                <Nav.Link className="exit-btn" onClick={()=>{localStorage.clear(); window.location.href = '/';}}>Вихід</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Routes>
        {userRolesLinks[localStorage.userRole].map((link, index) => 
            <Route key={index} path={link.link} element={link.element} /> 
          )}
        </Routes>
      </Router> : <SignIn/>}
    </div>
}

export default App;
