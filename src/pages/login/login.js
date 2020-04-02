import React, { Component } from 'react';
import { Alert } from 'react-alert';
import { USER_LOGIN } from '../../config/config';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        }
    }

    onEmailChange = (event) => {
        event.preventDefault();
        this.setState({ email: event.target.value });
    }

    onPasswordChange = (event) => {
        event.preventDefault();
        this.setState({ password: event.target.value });
    }

    onLogin = (alert) => {
        const { email, password } = this.state;
        const { redirectPath } = this.props;
        const tmp_path = redirectPath ? redirectPath : "/createUser";

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


        if (email.trim().length === 0 || email === "") {
            alert.show("Enter an email address")
        } else if (!re.test(email)) {
            alert.show("Enter a valid email")
        } else if (password.trim().length === 0 || password === "") {
            alert.show("Enter password")
        }else {
            let data = {
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

            fetch(USER_LOGIN, config)
                .then((response) => {
                    console.log(response);
                    if (response.status === 200) {
                        sessionStorage.setItem("loggedEmail", email);
                        return response.json()
                    }else if (response.status === 401) {
                        alert.show("Unable to login!.");
                    }
                })
                .then(resJson => {
                    sessionStorage.setItem("token", resJson.token);
                    window.location.href = tmp_path;
                    window.location.reload();
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    render() {
        const { email, password } = this.state;

        return (
            <div className="login-box">
                <div className="login-logo">
                    <a href="#"><b>Khine</b>Sabae</a>
                </div>
                <div className="login-box-body">
                    <p className="login-box-msg">Sign in to start your session</p>
                    <form action="#" method="post">
                        <div className="form-group has-feedback">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={this.onEmailChange}
                            />
                            <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                        </div>
                        <div className="form-group has-feedback">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={this.onPasswordChange}
                            />
                            <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                        </div>
                        <Alert>
                            {alert => (
                                <button
                                    type="button"
                                    className="btn btn-primary btn-block btn-flat"
                                    onClick={() => this.onLogin(alert)}>Sign In</button>
                            )}
                        </Alert>
                    </form>
                </div>
            </div>
        )
    }
}