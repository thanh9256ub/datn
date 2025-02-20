import React from "react";
import { Card, Button } from "react-bootstrap";

const Dashboard = () => {
    return (
        <div>
            <Card>
                <Card.Header>Dashboard Overview</Card.Header>
                <Card.Body>
                    <h5>Welcome to the Admin Dashboard</h5>
                    <Button variant="primary">View Stats</Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default Dashboard;
