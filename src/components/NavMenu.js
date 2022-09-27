import React, { Component } from 'react';
import { Collapse, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';

export class NavMenu extends Component {
  static displayName = NavMenu.name;
    static roleUserLinks = {
        1: [
            { name: 'Home', link:'/' }, 
            { name: 'Reports', link: '/reports' }, 
            { name: 'Admin panel', link: '/admin-panel' },
            { name: 'Radiocomponents editor', link: '/radiocomponents-editor'},
        ],
        2: [
            { name: 'Home', link: '/' },
            { name: 'Reports', link: '/reports' }, 
            { name: 'Radiocomponents editor', link: '/radiocomponents-editor' },
        ],
        3: [
            { name: 'Home', link: '/' },
            { name: 'Reports', link: '/reports' }, 
        ],
    }
  
  constructor (props) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" container light>
          <NavbarBrand tag={Link} to="/">RadioComponentsStorage</NavbarBrand>
          <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
          <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
                    <ul className="navbar-nav flex-grow">
                        {NavMenu.roleUserLinks[Number(localStorage.userRole ?? 3)].map((item, index) => {
                            return (
                                <NavItem key={index}>
                                    <NavLink tag={Link} to={item.link}>{item.name}</NavLink>
                                </NavItem>
                                )
                        })}
               <NavItem>
                <button className="btn btn-outline-danger" onClick={() => { localStorage.clear(); window.location.href = '/'; } }>Exit</button>
               </NavItem>
            </ul>
          </Collapse>
          </Navbar>
      </header>
    );
  }
}
