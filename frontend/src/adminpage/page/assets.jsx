import React from "react";
import "../../assets/import.css";
import { Link } from "react-router-dom";

const AssetsList = (props) => {
    return (
        <>
            <section className="content p-4">
                <div className="row">
                    <div className="col-lg-6">
                        <h3>Assets </h3>
                    </div>
                    <div className="col-lg-6 text-right">
						<Link to="/admin/add-assets" className="btn btn-dark ml-3"><i class="fa fa-plus mr-1" aria-hidden="true"></i> Add New Assets</Link>
						<Link to="/admin/assets-category" className="btn btn-dark ml-3"><i class="fa fa-box mr-1" aria-hidden="true"></i> Category</Link>
					</div>
                </div>

                <div className="container-fluid card mt-3">
                    <div className="table_cont table-responsive">
                        <table class="table table-hover text-nowrap">
                            <thead>
                                <tr>
                                    <th width="8%" scope="col">ID</th>
                                    <th width="40%" scope="col">ITEM</th>
                                    <th width="20%" scope="col">CATEGORY</th>
                                    <th width="12%" scope="col" className="text-center">TOTAL</th>
                                    <th width="12%" scope="col" className="text-center">IN STOCK</th>
                                    <th width="8%" scope="col" className="text-center">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td >1</td>
                                    <td>Dell UltraBook</td>
                                    <td>laptop lowend</td>
                                    <td className="text-center">14</td>
                                    <td className="text-center">3</td>
                                    <td className="text-center">
                                        <Link className="btn btn-dark" to="/admin/assigned-list/1"><i class="fa fa-eye" aria-hidden="true"></i></Link>
                                    </td>
                                </tr>
                                <tr>
                                    <td >1</td>
                                    <td>Headphone with Speaker</td>
                                    <td>Headphone</td>
                                    <td className="text-center">14</td>
                                    <td className="text-center">3</td>
                                    
                                    <td className="text-center">
                                        <Link className="btn btn-dark" to="/admin/assigned-list/1"><i class="fa fa-eye" aria-hidden="true"></i></Link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
};
export default AssetsList;
