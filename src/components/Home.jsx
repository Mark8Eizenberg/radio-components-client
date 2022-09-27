import React, { Component } from 'react';

export default class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
        <div>
            <h1>Welcome {localStorage.userFullName}</h1>
      </div>
    );
  }
}
