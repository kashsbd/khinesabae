import React, { Component } from 'react';

export class Header extends Component {

  onLogOut = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("loggedEmail");
    window.location.reload();
  }

  render() {
    return (
      <header className="main-header">
        <a href="/" className="logo">
          <span className="logo-mini"><b>K</b></span>
          <span className="logo-lg"><b>Khine </b>Sabae</span>
        </a>
        <nav className="navbar navbar-static-top">
          <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
            <span className="sr-only">Toggle navigation</span>
          </a>
          <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <li>
                <a onClick={this.onLogOut}>Log Out</a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    )
  }
}