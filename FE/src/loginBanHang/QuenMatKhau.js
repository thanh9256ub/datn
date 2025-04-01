import React,{ Component } from "react";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import ForgotPassword from "./ForgotPassword";

class QuenMatKhau extends Component {

    state = {}

    render() {
        return (
            <div style={{ marginTop: "50px" }}>
                <ForgotPassword />
            </div>
        );
    }
}

export default withTranslation()(withRouter(QuenMatKhau));