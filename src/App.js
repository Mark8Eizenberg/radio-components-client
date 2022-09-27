import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import {SignIn} from './components/SignIn'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink
} from "react-router-dom";
import { Button, Nav, Navbar } from 'react-bootstrap';
import {userRolesLinks} from './utils/UserRoles'
function App() {

  return  <div className="App">
      {localStorage.token ? <Router>
        <Navbar collapseOnSelect bg='light' expand='lg'>
        <Navbar.Brand href="#">RadioComponents</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className='pills-from-navbar' defaultActiveKey="/home">
              {userRolesLinks[localStorage.userRole].map((link, index) => 
                <Nav.Item key={index}>
                  <Nav.Link as={NavLink} to={link.link} end >{link.name}</Nav.Link>
                </Nav.Item>  
              )}
              <Nav.Item>
                <Nav.Link className="exit-btn" onClick={()=>{localStorage.clear(); window.location.href = '/';}}>Exit</Nav.Link>
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

function Home() {
  return localStorage.token ? <div>You signIn: {JSON.stringify(userRolesLinks[localStorage.userRole].map((i, k)=>[i,k]))}</div> : <SignIn/> ;
}

export default App;
