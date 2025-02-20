import React from "react";
import { Table, Button } from "react-bootstrap";

const Users = () => {
    return (
        <div>
            <h3>User Management</h3>
            <Button variant="success" className="mb-3">
                Add New User
            </Button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>John Doe</td>
                        <td>john@example.com</td>
                        <td>Admin</td>
                        <td>
                            <Button variant="warning">Edit</Button>
                        </td>
                    </tr>
                    {/* Add more rows as needed */}
                </tbody>
            </Table>
        </div>
    );
};

export default Users;
