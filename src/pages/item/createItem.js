import React, { Component } from 'react';
import { Header, Sidebar, LocalItemImage } from '../../components';
import { checkSession } from '../../config/util';
import { Login } from '../login';
import { Alert } from 'react-alert';
import { GET_ALL_CATEGORIES, CREATE_ITEM } from '../../config/config';

export class CreateItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            img: [],
            cateogry: [],
            cateogryLoading: false,
            categoryId: "",

            itemName: "",
            itemCode: "",
            selectedCategory: "",
            price: "",
            size: "",
            gold_weight: "",
            diamond_weight: "",
            description: ""
        }
    }

    componentDidMount() {
        this.setState({ cateogryLoading: true }, () => this.getAllCategory());
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
                this.setState({ cateogry: resJson, cateogryLoading: false });
            } else {
                console.log("Connection Problem, Try Again");
            }
        } catch (error) {
            console.log("Please connect to internet.");
        }
    }

    onImageChange = (event) => {
        event.preventDefault();
        const { img } = this.state;

        this.setState({ img: [...img, event.target.files[0]] });
    }

    _onRemoveImg = (index) => {
        const { img } = this.state;
        let _img = img;
        _img.splice(index, 1);
        this.setState({ img: _img });
    }

    onItemNameChange = (event) => {
        event.preventDefault();
        this.setState({ itemName: event.target.value });
    }

    onItemCodeChange = (event) => {
        event.preventDefault();
        this.setState({ itemCode: event.target.value });
    }

    onCategoryNameChange = (event) => {
        event.preventDefault();
        const id = this.categoryRef.selectedOptions[0].getAttribute('data-cid');
        console.log("id", id)
        this.setState({ selectedCategory: event.target.value, categoryId: id });
    }

    onPriceChange = (event) => {
        event.preventDefault();
        this.setState({ price: event.target.value });
    }

    onSizeChange = (event) => {
        event.preventDefault();
        this.setState({ size: event.target.value });
    }

    onGoldWeightChange = (event) => {
        event.preventDefault();
        this.setState({ gold_weight: event.target.value });
    }

    onDiamondWeightChange = (event) => {
        event.preventDefault();
        this.setState({ diamond_weight: event.target.value });
    }

    onDescriptionChange = (event) => {
        event.preventDefault();
        this.setState({ description: event.target.value });
    }

    onSubmit(alert) {
        const {
            itemName,
            itemCode,
            selectedCategory,
            categoryId,
            price,
            size,
            gold_weight,
            diamond_weight,
            description,
            img
        } = this.state;

        if (itemName.trim().length === 0 || itemName === "") {
            alert.show("Enter Item Name");
        } else if (itemCode.trim().length === 0 || itemCode === "") {
            alert.show("Enter Item Code");
        } else if (itemCode.trim().length === 0 || itemCode === "") {
            alert.show("Enter Item Code");
        } else if (selectedCategory === "Select Category" || selectedCategory === "") {
            alert.show("Select Category");
        } else if (price === "0") {
            alert.show("Enter Price");
        } else if (description === "") {
            alert.show("Enter Description of the item");
        } else if(img.length === 0) {
            alert.show("Please select images");
        } else {

            let data = new FormData();
            data.append("itemName", itemName);
            data.append("itemCode", itemCode);
            data.append("categoryId", categoryId);
            data.append("price", price);
            data.append("size", size);
            data.append("gold_weight", gold_weight);
            data.append("diamond_weight", diamond_weight);
            data.append("description", description);

            img.forEach((file, i) => {
                data.append("itemImage", file, file.name);
            })

            let config = {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                },
                body: data
            };


            fetch(CREATE_ITEM, config)
                .then((response) => {
                    if (response.status === 500) {
                        alert.show("Network Error");
                    } else if (response.status === 201) {
                        alert.show("Item Created Successfully");
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
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
        const {
            img,
            cateogry,
            cateogryLoading,
            itemName,
            itemCode,
            selectedCategory,
            price,
            size,
            gold_weight,
            diamond_weight,
            description
        } = this.state;

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
                                        <h3 className="box-title">Create New Item</h3>
                                    </div>
                                    <form role="form">
                                        <div className="box-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="item_name">Item Name</label>
                                                        <span style={{ color: "red", fontSize: 18, margin: 3 }}>*</span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="item_name"
                                                            placeholder="Enter Item Name"
                                                            value={itemName}
                                                            onChange={this.onItemNameChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="item_code">Item Code</label>
                                                        <span style={{ color: "red", fontSize: 18, margin: 3 }}>*</span>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="item_code"
                                                            placeholder="Enter Item Code"
                                                            value={itemCode}
                                                            onChange={this.onItemCodeChange} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Choose Category</label>
                                                <span style={{ color: "red", fontSize: 18, margin: 3 }}>*</span>
                                                <select
                                                    className="form-control select2"
                                                    style={{ width: '100%' }}
                                                    value={selectedCategory}
                                                    onChange={this.onCategoryNameChange}
                                                    ref={(cat) => this.categoryRef = cat}>>
                                                    <option value="Select Category">Select Category</option>
                                                    {
                                                        cateogryLoading ?
                                                            <div className="spinner-border text-light" role="status">
                                                                <span className="sr-only">Loading...</span>
                                                            </div>
                                                            :
                                                            cateogry.length > 0 ?
                                                                cateogry.map(cat => {
                                                                    return (
                                                                        <option
                                                                            key={cat._id}
                                                                            value={cat.name}
                                                                            data-cid={cat._id}>{cat.name}</option>
                                                                    )
                                                                })
                                                                :
                                                                null
                                                    }
                                                </select>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="price">Price In Kyats</label>
                                                        <span style={{ color: "red", fontSize: 18, margin: 3 }}>*</span>
                                                        <input
                                                            type="number"
                                                            min={1}
                                                            className="form-control"
                                                            id="price"
                                                            placeholder="0"
                                                            value={price}
                                                            onChange={this.onPriceChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="size">Size</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            id="size"
                                                            placeholder="0"
                                                            value={size}
                                                            onChange={this.onSizeChange} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="g_w">Gold Weight</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="g_w"
                                                            placeholder="0"
                                                            min={0}
                                                            value={gold_weight}
                                                            onChange={this.onGoldWeightChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="d_w">Diamond Weight</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="d_w"
                                                            placeholder="0"
                                                            min={0}
                                                            value={diamond_weight}
                                                            onChange={this.onDiamondWeightChange} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
                                                <span style={{ color: "red", fontSize: 18, margin: 3 }}>*</span>
                                                <textarea
                                                    rows={5}
                                                    type="text"
                                                    className="form-control"
                                                    id="description"
                                                    placeholder="Enter Description"
                                                    value={description}
                                                    onChange={this.onDescriptionChange} />
                                            </div>
                                        </div>
                                        <div className="box-footer">
                                            <Alert>
                                                {alert => (
                                                    <button
                                                        type="button"
                                                        className="btn btn-success"
                                                        onClick={() => this.onSubmit(alert)}>Create</button>
                                                )}
                                            </Alert>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="box box-primary">
                                    <div className="box-body" style={{ overflow: "auto", height: window.outerHeight - 110 }}>
                                        <div style={{ marginLeft: 5, marginRight: 5 }}>
                                            <button
                                                type="button"
                                                className="btn btn-info btn-flat btn-block"
                                                onClick={() => this.pickImage.click()}>Choose Item Image</button>
                                        </div>
                                        <input
                                            type="file"
                                            style={{ display: 'none' }}
                                            ref={(ref) => this.pickImage = ref}
                                            onChange={this.onImageChange} />
                                        {
                                            img.length > 0 ?
                                                img.map((path, index) => {
                                                    return (
                                                        <LocalItemImage
                                                            key={index}
                                                            path={path}
                                                            imgIndex={index}
                                                            onRemoveImg={this._onRemoveImg}
                                                        />
                                                    )
                                                })
                                                :
                                                null
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}