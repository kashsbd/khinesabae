import React, { Component } from 'react';
import { Header, Sidebar } from '../../components';
import { checkSession } from '../../config/util';
import { Login } from '../login';
import { Alert } from 'react-alert';
import { CREATE_CATEGORY } from '../../config/config';

export class CreateCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            categoryName: ""
        }
    }

    onCategoryNameChange = (event) => {
        event.preventDefault();
        this.setState({ categoryName: event.target.value });
    }

    onSubmit(alert) {
        const { categoryName } = this.state;

        if (categoryName.trim().length === 0 || categoryName === "") {
            alert.show("Enter Category Name");
        } else {

            let data = {
                "name": categoryName
            }

            let config = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                },
                body: JSON.stringify(data)
            }

            fetch(CREATE_CATEGORY, config)
                .then((response) => {
                    if (response.status === 409) {
                        alert.show("Category Name already exit")
                        this.setState({ email: "" });
                    } else if (response.status === 201) {
                        alert.show("Category Created Successfully")
                        this.setState({ categoryName: "" });
                    } else {
                        alert.show("Connection Problem, Try Again")
                    }
                })
                .catch((error) => {
                    alert.show("Can't Connect . Try Again")
                })
        }
    }

    render() {
        const { categoryName } = this.state;

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
                                        <h3 className="box-title">Create Category</h3>
                                    </div>
                                    <form role="form">
                                        <div className="box-body">
                                            <div className="form-group">
                                                <label htmlFor="name">Category Name</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="name"
                                                    placeholder="Enter Category Name"
                                                    value={categoryName}
                                                    onChange={this.onCategoryNameChange} />
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