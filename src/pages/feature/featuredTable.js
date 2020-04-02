import React, { Component } from 'react';

import { getCredentials } from '../../config/util';
import { GET_ITEM_IMAGE } from '../../config/config';

import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";

const $ = require("jquery");
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");


class FeaturedTable extends Component {

    makeFeaturedItem = (e) => {
        if (getCredentials().role === 'ADMIN') {
            const id = e.target.getAttribute('data-item');
            this.props.makeFeaturedItem(id);
        } else {
            alert("You are not admin.Permission denied !");
        }
    }

    componentDidMount() {
        this.setDataToTable(this.props.data);

        $('#featured_table').on('click', '.chk', this.makeFeaturedItem);
    }

    renderCheckbox(eachData) {
        if (eachData.isFeatured) {
            return (
                ' <input type="checkbox" style="margin: 5px" class="chk" data-item="' + eachData._id + '" checked/> '
            )
        }

        return (
            ' <input type="checkbox" style="margin: 5px" class="chk" data-item="' + eachData._id + '" /> '
        )
    }

    renderImages(media = []) {
        let div = '<div>';

        for (let i of media) {
            div += '<img src="' + GET_ITEM_IMAGE + i._id + '" width="60" height="60" class="img-rounded" style="margin: 5px" />'
        }

        div += '</div>';

        return div
    }


    setDataToTable(tbl_datas) {

        let l = [];

        for (let i = 0; i < tbl_datas.length; i++) {

            const data = tbl_datas[i];

            const checkbox = this.renderCheckbox(data);
            const images = this.renderImages(data.media);

            const obj = {
                name: data.itemName,
                code: data.itemCode,
                category: data.category ? data.category.name : 'Deleted Category',
                price: data.price,
                checkbox,
                size: data.size ? data.size : '-',
                gold_weight: data.gold_weight ? data.gold_weight : '-',
                diamond_weight: data.diamond_weight ? data.diamond_weight : '-',
                des: data.description,
                images
            };

            l.push(obj);
        }

        const columns = [
            { title: "Name", data: "name", width: 150 },
            { title: "Code", data: "code", width: 150 },
            { title: "Category", data: "category", width: 150 },
            { title: "Price", data: "price", width: 150 },
            { title: "Make Featured", data: "checkbox" },
            { title: "Size", data: "size", width: 150 },
            { title: "Gold Weight", data: "gold_weight", width: 150 },
            { title: "Diamond Weight", data: "diamond_weight", width: 150 },
            { title: "Description", data: "des" },
            { title: "Images", data: "images" }
        ]

        $(this.refs.featured_table).DataTable({
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
                    targets: [5, 6, 7, 8, 9]
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
            <table id="featured_table" ref="featured_table" className="table table-bordered" style={{ width: '100%' }} />
        );
    }
}

export default FeaturedTable;