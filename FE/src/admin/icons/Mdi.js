import React, { Component } from 'react'
import Table from 'react-bootstrap/Table';
import './Mdi.css'
export class Mdi extends Component {
    render() {
        return (
            <Table className='table-order'>
                <thead className='table-order-menu'>
                    <tr>
                        <th>STT</th>
                        <th>Order Code</th>
                        <th>Customer</th>
                        <th>Order Date</th>
                        <th className='table-order-status'>Status</th>
                        <th>Amount</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className='table-order-list'>
                    <tr>
                        <td>1</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td colSpan={2}>Larry the Bird</td>
                        <td>@twitter</td>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                    </tr>
                </tbody>
            </Table>
        )
    }
}

export default Mdi
