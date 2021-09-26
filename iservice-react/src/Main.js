import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Views/Home';
import NewTask from './Views/NewTask'
import Login from './Views/Login'

const Main = () => {
    return (
        <Switch>
            <Route exact path='/' component={Home}></Route>
            <Route exact path='/new-task' component={NewTask}></Route>
            <Route exact path='/login' component={Login}></Route>
        </Switch>
    );
}

export default Main;