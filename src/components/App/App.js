import React, {Component} from 'react';
import {
    BrowserRouter,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import Nav from 'components/Nav/Nav';
import getRouter from 'router/router';

export default class App extends Component {
    render = () => <div>{getRouter()}</div>;
}