import React from "react";
import { Form, Button } from "react-bootstrap";

const Settings = () => {
    return (
        <div>
            <h3>Settings</h3>
            <Form>
                <Form.Group controlId="formEmail">
                    <Form.Label>Email Notifications</Form.Label>
                    <Form.Check type="checkbox" label="Enable email notifications" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save Changes
                </Button>
            </Form>
        </div>
    );
};

export default Settings;
