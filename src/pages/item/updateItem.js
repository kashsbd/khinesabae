import React, { Component } from 'react';
import { Header, Sidebar, ItemImage } from '../../components';
import { Alert } from 'react-alert';
import { GET_ALL_CATEGORIES, UPDATE_ITEM, GET_ITEM_IMAGE, GET_ALL_ITEMS } from '../../config/config';
import { Redirect } from 'react-router-dom';

export class UpdateItem extends Component {

    constructor(props) {
        super(props);
        this.state = {
            onlineImg: [],
            img: [],
            cateogry: [],
            cateogryLoading: false,
            categoryId: "",
            itemId: "",
            itemName: "",
            itemCode: "",
            selectedCategory: "",
            price: "",
            gold_weight: "",
            diamond_weight: "",
            size: "",
            description: "",
            error: false,
        }
    }

    componentDidMount() {
        this.setState({ cateogryLoading: true }, () => { this.getItem(); this.getAllCategory() });
    }

    async getItem() {
        const id_obj = this.props.location.data;

        if (id_obj && id_obj._id) {

            const item_id = id_obj._id;

            const config = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                }
            }

            try {
                const res = await fetch(GET_ALL_ITEMS + '/' + item_id, config);

                if (res.status === 500) {
                    console.log("Error On The Server");
                    this.setState({ error: true });
                } else if (res.status === 200) {
                    const data = await res.json();

                    this.setState({
                        cateogryLoading: true,
                        itemName: data.itemName,
                        itemCode: data.itemCode,
                        price: data.price,
                        size: data.size,
                        gold_weight: data.gold_weight,
                        diamond_weight: data.diamond_weight,
                        description: data.description,
                        selectedCategory: data.category ? data.category.name : 'Delected Category',
                        categoryId: data.category ? data.category._id : '',
                        onlineImg: data.media,
                        itemId: data._id
                    });

                } else {
                    this.setState({ error: true });
                    console.log("Connection Problem, Try Again");
                }
            } catch (error) {
                console.log(error);
                console.log("Please connect to internet.");
            }
        } else {
            this.setState({ error: true });
        }
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

    _onRemoveImg = (each_img) => {
        const { img, onlineImg } = this.state;

        if (each_img.type === 'online') {
            let _onlineImg = onlineImg;
            _onlineImg.splice(each_img.index, 1);
            this.setState({ onlineImg: _onlineImg });
        } else {
            let _img = img;
            _img.splice(each_img.index, 1);
            this.setState({ img: _img });
        }
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
            description,
            img,
            onlineImg,
            itemId,
            gold_weight,
            diamond_weight,
        } = this.state;

        const concated_img = onlineImg.concat(img);

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
        } else if (concated_img.length === 0) {
            alert.show("Please select images.");
        } else {

            console.log(gold_weight);

            let data = new FormData();
            data.append("_id", itemId);
            data.append("itemName", itemName);
            data.append("itemCode", itemCode);
            data.append("categoryId", categoryId);
            data.append("price", price);
            data.append("size", size);
            data.append("gold_weight", gold_weight);
            data.append("diamond_weight", diamond_weight);
            data.append("description", description);
            data.append("img", JSON.stringify(onlineImg));

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

            fetch(UPDATE_ITEM, config)
                .then((response) => {
                    if (response.status === 500) {
                        alert.show("Network Error");
                    } else if (response.status === 200) {
                        alert.show("Item Updated Successfully");
                        setTimeout(() => {
                            window.location.href = '/editItem';
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
            description,
            onlineImg,
            error
        } = this.state;

        const concated_img = onlineImg.concat(img);
        let tmp_img = [];

        for (let i = 0; i < concated_img.length; i++) {
            if (concated_img[i]._id) {
                const each_img = GET_ITEM_IMAGE + concated_img[i]._id;
                tmp_img.push({ path: each_img, type: 'online', index: onlineImg[concated_img[i]._id] });
            } else {
                tmp_img.push({ path: concated_img[i], type: 'local', index: img[concated_img[i]] });
            }
        }

        if (error) {
            return <Redirect to="/createItem" />
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
                                                <select
                                                    className="form-control select2"
                                                    style={{ width: '100%' }}
                                                    value={selectedCategory}
                                                    onChange={this.onCategoryNameChange}
                                                    ref={(cat) => this.categoryRef = cat}
                                                >
                                                    <option value="Select Category">Select Category</option>
                                                    {
                                                        cateogryLoading ?
                                                            <option>Loading...</option>
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
                                                        <input
                                                            type="number"
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
                                                        <label htmlFor="gw">Gold Weight</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="gw"
                                                            placeholder="0"
                                                            min={0}
                                                            value={gold_weight}
                                                            onChange={this.onGoldWeightChange} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label htmlFor="dw">Diamond Weight</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            id="dw"
                                                            min={0}
                                                            placeholder="0"
                                                            value={diamond_weight}
                                                            onChange={this.onDiamondWeightChange} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="description">Description</label>
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
                                                        onClick={() => this.onSubmit(alert)}>Update</button>
                                                )}
                                            </Alert>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="box box-primary">
                                    <div className="box-body" style={{ overflow: "auto", height: window.outerHeight - 125 }}>
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
                                            tmp_img.length > 0 ?
                                                tmp_img.map((img, index) => {
                                                    return (
                                                        <ItemImage
                                                            key={index}
                                                            path={img}
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