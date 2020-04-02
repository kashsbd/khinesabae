import React, { Component } from 'react';

import { getCredentials } from '../../config/util';

import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";

const $ = require("jquery");
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");


class UserTable extends Component {

    constructor(props) {
        super(props);

        this.handleDelete = this.handleDelete.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleDelete(e) {
        if (getCredentials().role === 'ADMIN') {
            const user_id = e.target.getAttribute('data-delete');
            this.props.onDeleteUser(user_id);

        } else {
            alert("You are not admin.Permission denied !");
        }
    }

    handleUpdate(e) {
        let user = e.target.getAttribute('data-update');
        user = $.parseJSON(user);
        this.props.onUpdateUser(user);
    }

    componentDidMount() {
        this.setDataToTable(this.props.data);

        $('.btnUpdate').click(this.handleUpdate);

        $('.btnDelete').click(this.handleDelete);
    }

    renderDeleteBtn(eachUser) {
        return (
            ' <button type="button" class="btn btn-danger btnDelete" data-delete="' + eachUser._id + '" > Delete </button> '
        )
    }

    _onUpdate(eachUser) {

    }

    renderUpdateBtn(eachUser) {

        if (getCredentials().role === 'ADMIN') {
            return (
                ' <button type="button" class="btn btn-info btnUpdate" data-toggle="modal" data-target="#modal_primary" data-update=' + JSON.stringify(eachUser) + '> Update</button>'
            )
        }

        return (
            ' <button type="button" class="btn btn-info" onClick={alert("Permission Denied")}>Update</button> '
        )
    }


    setDataToTable(users) {

        let l = [];

        for (let i = 0; i < users.length; i++) {

            const data = users[i];

            const updateTxt = this.renderUpdateBtn(data);
            const deleteTxt = this.renderDeleteBtn(data);

            const obj = {
                name: data.name,
                email: data.email,
                delete: deleteTxt,
                update: updateTxt,
            };

            l.push(obj);
        }

        let editCol = [
            { title: "User Name", data: "name" },
            { title: "Email", data: "email" },
            { title: "Delete User", data: "delete" },
            { title: "Update User", data: "update" }
        ]

        $(this.refs.user_table).DataTable({
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
            <table id="user_table" ref="user_table" className="table table-bordered" style={{ width: '100%' }}></table>
        );
    }
}

export default UserTable;