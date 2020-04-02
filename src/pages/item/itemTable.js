import React, { Component } from 'react';

import { getCredentials } from '../../config/util';
import { GET_ITEM_IMAGE } from '../../config/config';

import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";

const $ = require("jquery");
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");


class ItemTable extends Component {

    handleDelete = (e) => {
        if (getCredentials().role === 'ADMIN') {
            const id = e.target.getAttribute('data-delete');
            this.props.onDelete(id);

        } else {
            alert("You are not admin.Permission denied !");
        }
    }

    handleUpdate = (e) => {
        const id = e.target.getAttribute('data-update');
       // window.location.href = 'updateItem/?_id='+id;
       this.props.onUpdate(id);
       
    }
    
    componentDidMount() {
        this.setDataToTable(this.props.data);

        $('#item_table').on('click', '.btnUpdate', this.handleUpdate);

        $('#item_table').on('click', '.btnDelete', this.handleDelete);

    }

    renderDeleteBtn(eachData) {
        return (
            ' <button type="button" class="btn btn-danger btnDelete" data-delete="' + eachData._id + '" > Delete </button> '
        )
    }

    renderUpdateBtn(eachData) {
        return (
            ' <button type="button" class="btn btn-info btnUpdate" data-update="' + eachData._id + '"> Update </button>'
        )
    }

    renderImages(media = []) {
        let div = '<div>';

        for (let i of media) {
            div += '<img src="' + GET_ITEM_IMAGE + i._id + '" width="60" height="60" class="img-rounded imgTest" style="margin: 5px" />'
        }

        div += '</div>';

        return div
    }


    setDataToTable(tbl_datas) {

        let l = [];

        for (let i = 0; i < tbl_datas.length; i++) {

            const data = tbl_datas[i];

            const updateTxt = this.renderUpdateBtn(data);
            const deleteTxt = this.renderDeleteBtn(data);
            const images = this.renderImages(data.media);

            const obj = {
                name: data.itemName,
                code: data.itemCode,
                category: data.category ? data.category.name : 'Deleted Category',
                price: data.price,
                size: data.size ? data.size : '-',
                gold_weight: data.gold_weight ? data.gold_weight : '-',
                diamond_weight: data.diamond_weight ? data.diamond_weight : '-',
                des: data.description,
                images,
                delete: deleteTxt,
                update: updateTxt,
            };

            l.push(obj);
        }

        const columns = [
            { title: "Name", data: "name", width: 150 },
            { title: "Code", data: "code", width: 150 },
            { title: "Category", data: "category", width: 150 },
            { title: "Price", data: "price", width: 150 },
            { title: "Size", data: "size", width: 150 },
            { title: "Gold Weight", data: "gold_weight", width: 150 },
            { title: "Diamond Weight", data: "diamond_weight", width: 150 },
            { title: "Description", data: "des" },
            { title: "Images", data: "images" },
            { title: "Delete", data: "delete" },
            { title: "Update", data: "update" },
        ]

        $(this.refs.item_table).DataTable({
            data: l,
            columns,
            responsive: {
                breakpoints: [
                    { name: 'screen-xs', width: 600 }
                ]
            },
            pagingType: 'full_numbers',
            autoWidth: false,
            columnDefs: [
                {
                    className: 'screen-xs',
                    targets: [7, 8, 9, 10]
                }
            ]
        });
    }

    shouldComponentUpdate(nextProps) {
        if (nextProps.data.length !== this.props.data.length) {
            this.setDataToTable(nextProps.data);
        }
        return false;
    }

    render() {
        return (
            <table id="item_table" ref="item_table" className="table table-bordered" style={{ width: '100%' }} />
        );
    }
}

export default ItemTable;