import React from 'react';
import { Route } from 'react-router-dom';
import {
    CreateUser,
    EditUser,
    CreateCategory,
    EditCategory,
    CreateItem,
    EditItem,
    UpdateItem,
    CreateFeatureItem,
    Login
} from './pages';

const Navigation = () => {
    return (
        <div>
            <Route exact path="/" component={CreateUser} />
            <Route path="/editUser" component={EditUser} />
            <Route path="/createCategory" component={CreateCategory} />
            <Route path="/editCategory" component={EditCategory} />
            <Route path="/createItem" component={CreateItem} />
            <Route path="/editItem" component={EditItem} />
            <Route path="/updateItem" component={UpdateItem} />
            <Route path="/featureItem" component={CreateFeatureItem} />
            <Route path="/login" component={Login} />
        </div>
    )
}

export default Navigation;