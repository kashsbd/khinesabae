import React, { Component } from 'react';
import { Header, Sidebar } from '../../components';
import { checkSession, getCredentials } from '../../config/util';
import { Login } from '../login';
import { GET_ALL_ITEMS, FEATURE_ITEM, GET_ITEM_IMAGE } from '../../config/config';
import FeaturedTable from './featuredTable';

export class CreateFeatureItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            loading: false,
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

    renderImages(media) {
        const tmp_img = [];
        media.map(img => {
            tmp_img.push(
                <img
                    key={img._id}
                    src={GET_ITEM_IMAGE + img._id}
                    width="60"
                    height="60"
                    className="img-rounded"
                    style={{ margin: 5 }} />
            )
        })
        return tmp_img
    }

    onFeaturedItem = async (_id) => {

        const data = { _id, featuredBy: getCredentials().uid };

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("token")
            },
            body: JSON.stringify(data)
        }

        try {
            const res = await fetch(FEATURE_ITEM, config);

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


    render() {
        const { loading, items } = this.state;

        if (!checkSession()) {
            return <Login redirectPath='/createUser' />
        }

        return (
            <div className="wrapper">
                <Header />
                <Sidebar />
                <div className="content-wrapper">
                    {
                        loading ?
                            <div className="spinner-border text-danger" role="status">
                                <span className="sr-only">Loading</span>
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
                                                <FeaturedTable
                                                    data={items}
                                                    makeFeaturedItem={this.onFeaturedItem}
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