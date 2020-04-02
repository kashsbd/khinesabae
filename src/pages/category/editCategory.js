import React, { Component } from 'react';
import { Header, Sidebar } from '../../components';
import { checkSession, getCredentials } from '../../config/util';
import { Login } from '../login';
import { Alert } from 'react-alert';
import { GET_ALL_CATEGORIES, DELETE_CATEGORY, UPDATE_CATEGORY } from '../../config/config';
import CategoryTable from './categoryTable';

export class EditCategory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cateogry: [],
            loading: false,
            cateogryName: "",
            cateogryId: ""
        }
    }

    componentDidMount() {
        this.setState({ loading: true }, () => this.getAllCategory());
    }

    async getAllCategory() {

        const config = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        }

        try {
            const res = await fetch(GET_ALL_CATEGORIES, config);
            if (res.status === 500) {
                console.log("Error On The Server");
            } else if (res.status === 200) {
                const resJson = await res.json();
                this.setState({ cateogry: resJson, loading: false });
            } else {
                console.log("Connection Problem, Try Again");
            }
        } catch (error) {
            console.log("Please connect to internet.");
        }
    }

    async onDeleteCategory(id) {

        const data = {
            "_id": id,
            "deletedBy": getCredentials().uid
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
            const res = await fetch(DELETE_CATEGORY, config);
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

    _onUpdate = (category) => this.setState({ cateogryName: category.name, cateogryId: category._id });

    async onUpdateCategory(alert) {
        const { cateogryName, cateogryId } = this.state;

        const data = {
            "cid": cateogryId,
            "name": cateogryName
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
            const res = await fetch(UPDATE_CATEGORY, config);
            switch (res.status) {
                case 200:
                    window.location.reload();
                    break;
                case 404:
                    alert("Not Found");
                    break;
                case 500:
                    alert("Error On The Network");
                    break;
            }
        } catch (error) {
            console.log("Please connect to internet.");
        }
    }

    onCategoryNameChange = (event) => {
        event.preventDefault();
        this.setState({ cateogryName: event.target.value });
    }


    render() {
        const { cateogry, loading, cateogryName } = this.state;

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
                                                <h3 className="box-title">Edit Category</h3>
                                            </div>
                                            <div className="box-body">
                                                <CategoryTable
                                                    data={cateogry}
                                                    onDelete={this.onDeleteCategory}
                                                    onUpdate={this._onUpdate}
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
                                    <h4 className="modal-title">Update Category</h4>
                                </div>
                                <div className="modal-body">
                                    <form role="form">
                                        <div className="box-body">
                                            <div className="form-group">
                                                <label htmlFor="category">Category Name</label>
                                                <input
                                                    type="category"
                                                    className="form-control"
                                                    id="category"
                                                    placeholder="Enter Category Name"
                                                    value={cateogryName}
                                                    onChange={this.onCategoryNameChange}
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
                                                onClick={() => this.onUpdateCategory(alert)}
                                            >Save changes</button>
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