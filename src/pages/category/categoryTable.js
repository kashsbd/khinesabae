import React, { Component } from 'react';

import { getCredentials } from '../../config/util';

import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";

const $ = require("jquery");
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");


class CategoryTable extends Component {

    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleDelete(e) {
        if (getCredentials().role === 'ADMIN') {
            const id = e.target.getAttribute('data-delete');
            this.props.onDelete(id);
        } else {
            alert("You are not admin.Permission denied !");
        }
    }

    handleUpdate(e) {
        let each_data = e.target.getAttribute('data-update');
        each_data = $.parseJSON(each_data);
        this.props.onUpdate(each_data);
    }

    componentDidMount() {
        this.setDataToTable(this.props.data);

        $('#category_table').on('click', '.btnUpdate', this.handleUpdate);

        $('#category_table').on('click', '.btnDelete', this.handleDelete);
    }

    renderDeleteBtn(eachData) {
        return (
            ' <button type="button" class="btn btn-danger btnDelete" data-delete="' + eachData._id + '" > Delete </button> '
        )
    }

    renderUpdateBtn(eachData) {
        const data = JSON.stringify(eachData);

        if (getCredentials().role === 'ADMIN') {
            return (
                ' <button type="button" class="btn btn-info btnUpdate" data-toggle="modal" data-target="#modal_primary" data-update="' + data + '"> Update</button>'
            )
        }

        return (
            ' <button type="button" class="btn btn-info" onClick={alert("Permission Denied")}>Update</button> '
        )
    }


    setDataToTable(tbl_datas) {

        let l = [];

        for (let i = 0; i < tbl_datas.length; i++) {

            const data = tbl_datas[i];

            const updateTxt = this.renderUpdateBtn(data);
            const deleteTxt = this.renderDeleteBtn(data);

            const obj = {
                name: data.name,
                delete: deleteTxt,
                update: updateTxt,
            };

            l.push(obj);
        }

        let editCol = [
            { title: "Category Name", data: "name" },
            { title: "Delete Category", data: "delete" },
            { title: "Update Category", data: "update" }
        ]

        $(this.refs.category_table).DataTable({
            data: l,
            columns: editCol,
            responsive: true,
            pagingType: 'full_numbers',
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
            <table id="category_table" ref="category_table" className="table table-bordered" style={{ width: '100%' }}></table>
        );
    }
}

export default CategoryTable;