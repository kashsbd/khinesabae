import React, { Component } from 'react';
import { getCredentials } from '../config/util';

export class Sidebar extends Component {
    render() {
        return (
            <aside className="main-sidebar">
                <section className="sidebar">
                    <div className="user-panel">
                        <div className="pull-left image">
                            <img src={require('../assets/img/avatar.png')} className="img-circle" alt="User Image" />
                        </div>
                        <div className="pull-left info">
                            <p className="text-uppercase">{getCredentials().username}</p>
                            <a href="#"><i className="fa fa-circle text-success"></i> Online</a>
                        </div>
                    </div>
                    <ul className="sidebar-menu" data-widget="tree">
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-users"></i> <span>User Set Up</span>
                                <span className="pull-right-container">
                                    <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </a>
                            <ul className="treeview-menu">
                                <li>
                                    <a href="/"><i className="fa fa-circle-o"></i> Create User</a>
                                </li>
                                <li>
                                    <a href="/editUser"><i className="fa fa-circle-o"></i> Edit User</a>
                                </li>
                            </ul>
                        </li>
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-list-alt"></i> <span>Category Set Up</span>
                                <span className="pull-right-container">
                                    <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </a>
                            <ul className="treeview-menu">
                                <li>
                                    <a href="/createCategory"><i className="fa fa-circle-o"></i> Create Category</a>
                                </li>
                                <li>
                                    <a href="/editCategory"><i className="fa fa-circle-o"></i> Edit Category</a>
                                </li>
                            </ul>
                        </li>
                        <li className="treeview">
                            <a href="#">
                                <i className="fa fa-list"></i> <span>Item Set Up</span>
                                <span className="pull-right-container">
                                    <i className="fa fa-angle-left pull-right"></i>
                                </span>
                            </a>
                            <ul className="treeview-menu">
                                <li>
                                    <a href="/createItem"><i className="fa fa-circle-o"></i> Create Item</a>
                                </li>
                                <li>
                                    <a href="/editItem"><i className="fa fa-circle-o"></i> Edit Item</a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a href="/featureItem"><i className="fa fa-bar-chart"></i> <span>Feature Item Set Up</span></a>                        </li>
                    </ul>
                </section>
            </aside>
        )
    }
}