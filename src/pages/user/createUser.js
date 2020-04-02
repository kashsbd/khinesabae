import React, { Component } from 'react';
import { Header, Sidebar } from '../../components';
import { checkSession, getCredentials } from '../../config/util';
import { Login } from '../login';
import { Alert } from 'react-alert';
import { USER_SIGNUP } from '../../config/config';


export class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            email: "",
            password: ""
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

    onSubmit(alert) {
        const { username, email, password } = this.state;

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (getCredentials().role !== 'ADMIN') {
            alert.show("Permission Denied");
        } else if (username.trim().length === 0 || username === "") {
            alert.show("Enter a username");
        } else if (email.trim().length === 0 || email === "") {
            alert.show("Enter an email address")
        } else if (!re.test(email)) {
            alert.show("Enter a valid email")
        } else if (password.trim().length === 0 || password === "") {
            alert.show("Enter password")
        } else if (password.trim().length < 6) {
            alert.show("Password must be at least 6 characters")
        } else {
            let data = {
                username: username,
                email: email,
                password: password
            }

            let config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }

            fetch(USER_SIGNUP, config)
                .then((response) => {
                    console.log(response)
                    if (response.status === 409) {
                        alert.show("Email already exit")
                        this.setState({ email: "" });
                    } else if (response.status === 201) {
                        alert.show("User is successfully created")
                        window.location.reload();
                    } else {
                        alert.show("Connection Problem, Try Again")
                    }
                })
                .catch((error) => {
                    console.log(error)
                    alert.show("Can't Connect . Try Again")
                })
        }
    }

    render() {
        const { username, email, password } = this.state;

        if (!checkSession()) {
            return <Login redirectPath='/createUser' />
        }

        return (
            <div className="wrapper">
                <Header />
                <Sidebar />
                <div className="content-wrapper">
                    <section className="content">
                        <div className="row">
                            <div className="col-md-8">
                                <div className="box box-primary">
                                    <div className="box-header with-border">
                                        <h3 className="box-title">Create New User</h3>
                                    </div>
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
                                                    onChange={this.onUsernameChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email Address</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    placeholder="Enter email"
                                                    value={email}
                                                    onChange={this.onEmailChange} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="password">Password</label>
                                                <input
                                                    type="password"
                                                    className="form-control"
                                                    id="password"
                                                    placeholder="Password"
                                                    value={password}
                                                    onChange={this.onPasswordChange} />
                                            </div>
                                        </div>
                                        <div className="box-footer">
                                            <Alert>
                                                {alert => (
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={() => this.onSubmit(alert)} >Submit</button>
                                                )}
                                            </Alert>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}