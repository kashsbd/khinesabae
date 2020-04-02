import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'

import { Header, Sidebar } from '../../components';
import { checkSession, getCredentials } from '../../config/util';
import { Login } from '../login';
import { GET_ALL_ITEMS, DELETE_ITEM } from '../../config/config';
import ItemTable from './itemTable';

export class EditItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: false,

            itemName: "",
            itemCode: "",
            category: "",
            price: "",
            size: "",
            gold_weight: "",
            diamond_weight: "",
            description: "",
            toUpdatePage: false,
            item_id: ''
        }
    }

    componentDidMount() {
        this.setState({ loading: true }, () => this.getAllItems());
    }

    async getAllItems() {

        const config = {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            }
        }

        try {
            const res = await fetch(GET_ALL_ITEMS, config);
            if (res.status === 500) {
                console.log("Error On The Server");
            } else if (res.status === 200) {
                const resJson = await res.json();
                this.setState({ items: resJson.docs, loading: false });
            } else {
                console.log("Connection Problem, Try Again");
            }
        } catch (error) {
            console.log("Please connect to internet.");
        }
    }

    onDeleteItem = async (id) => {

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
            const res = await fetch(DELETE_ITEM, config);
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

    _onUpdate = (id) => this.setState({ item_id: id, toUpdatePage: true });

    render() {
        const { loading, items, toUpdatePage, item_id } = this.state;

        if (!checkSession()) {
            return <Login redirectPath='/createUser' />
        }

        if (toUpdatePage) {
            return (
                <Redirect
                    to={{ pathname: "/updateItem", data: { _id: item_id } }} />
            )
        }

        return (
            <div className="wrapper">
                <Header />
                <Sidebar />
                <div className="content-wrapper">
                    {
                        loading ?
                            <div className="spinner-border text-light" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            :
                            <section className="content">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="box box-primary">
                                            <div className="box-header">
                                                <h3 className="box-title">Edit Item</h3>
                                            </div>
                                            <div className="box-body">
                                                <ItemTable
                                                    data={items}
                                                    onDelete={this.onDeleteItem}
                                                    onUpdate={this._onUpdate}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                    }
                </div>
            </div>
        )
    }
}