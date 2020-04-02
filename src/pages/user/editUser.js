import React, { Component } from 'react';
import { Header, Sidebar } from '../../components';
import { checkSession, getCredentials } from '../../config/util';
import { Login } from '../login';
import { Alert } from 'react-alert';
import { GET_ALL_USERS, DELETE_USERS, UPDATE_USER } from '../../config/config';
import UserTable from './userTable';

export class EditUser extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            loading: false,
            userId: "",
            username: "",
            email: "",
            password: "",
            confrimPassword: "",
        }
    }

    componentDidMount() {
        this.setState({ loading: true }, () => this.getAllUsers());
    }

    async getAllUsers() {

        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        }

        try {
            const res = await fetch(GET_ALL_USERS, config);

            if (res.status === 500) {
                console.log("Error On The Server");
            } else if (res.status === 200) {
                const resJson = await res.json();
                this.setState({ users: resJson, loading: false });
            } else {
                console.log("Connection Problem, Try Again");
            }
        } catch (error) {
            console.log("Please connect to internet.");
        }
    }

    onDeleteUser = async (id) => {

        const data = {
            _id: id,
            deletedBy: getCredentials().uid
        }

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            },
            body: JSON.stringify(data)
        }

        try {
            const res = await fetch(DELETE_USERS, config);
            switch (res.status) {
                case 200:
                    window.location.reload();
                    break;
                case 401:
                    alert("Permission Denied");
                    break;
                case 404:
                    alert("Not Found");
                    break;
            }
        } catch (error) {
            console.log("Please connect to internet.");
        }
    }

    _onUpdate = (user) => {
        this.setState({ userId: user._id, username: user.name, email: user.email });
    }

    async onUpdateUser() {

        const { userId, username, email, password, confrimPassword } = this.state;

        if (getCredentials().role === 'ADMIN' || userId === getCredentials().uid) {

            let data = null;

            if (password !== "") {
                if (password.trim().length < 6) {
                    alert("Password must be at least 6 character");
                } else if (password !== confrimPassword) {
                    alert("Password Did Not Match");
                } else {
                    data = {
                        _id: userId,
                        username: username,
                        email: email,
                        password: password
                    }
                }

            } else {
                data = {
                    _id: userId,
                    username: username,
                    email: email
                }
            }

            const config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                },
                body: JSON.stringify(data)
            }

            try {
                const res = await fetch(UPDATE_USER, config);
                switch (res.status) {
                    case 200:
                        window.location.reload();
                        break;
                    case 401:
                        alert("Permission Denied");
                        break;
                    case 404:
                        alert("Not Found");
                        break;
                }
            } catch (error) {
                console.log("Please connect to internet.");
            }
        } else {
            alert("You are not admin.Permission denied !");
        }
    }

    onUsernameChange = (event) => {
        event.preventDefault();
        this.setState({ username: event.target.value });
    }

    onEmailChange = (event) => {
        event.preventDefault();
        this.setState({ email: event.target.value });
    }

    onPasswordChange = (event) => {
        event.preventDefault();
        this.setState({ password: event.target.value });
    }

    onConfrimPasswordChange = (event) => {
        event.preventDefault();
        this.setState({ confrimPassword: event.target.value });
    }

    render() {
        const { users, loading, username, email, password, confrimPassword } = this.state;

        if (!checkSession()) {
            return <Login redirectPath='/deleteUser' />
        }

        return (
            <div className="wrapper">
                <Header />
                <Sidebar />
                <div className="content-wrapper">
                    {
                        loading ?
                            <div>
                                Loading ...
                            </div>
                            :
                            <section className="content">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="box box-primary">
                                            <div className="box-header">
                                                <h3 className="box-title">Edit Users</h3>
                                            </div>
                                            <div className="box-body">
                                                <UserTable
                                                    data={this.state.users}
                                                    onDeleteUser={this.onDeleteUser}
                                                    onUpdateUser={this._onUpdate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                    }
                    <div className="modal modal-default fade" id="modal_primary">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span></button>
                                    <h4 className="modal-title">Update User</h4>
                                </div>
                                <div className="modal-body">
                                    <form role="form">
                                        <div className="box-body">
                                            <div className="form-group">
                                                <label htmlFor="username">User Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="username"
                                                    placeholder="Enter User Name"
                                                    value={username}
                                                    onChange={this.onUsernameChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Enter email"
                                                    value={email}
                                                    onChange={this.onEmailChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password">New Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={this.onPasswordChange}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="confrim_password">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="confrim_password"
                                                    placeholder="Confirm Password"
                                                    value={confrimPassword}
                                                    onChange={this.onConfrimPasswordChange}
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <Alert>
                                        {alert => (
                                            <button
                                                type="button"
                                                className="btn btn-success"
                                                onClick={() => this.onUpdateUser(alert)}>Save changes</button>
                                        )}
                                    </Alert>
                                    <button type="button" className="btn btn-primary" data-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}