import React,{ Component } from "react";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router-dom/cjs/react-router-dom";
import ChangePassword from "./ChangePassword";

class DoiMatKhau extends Component {

    state = {}

    render() {
        return (
            <div style={{ marginTop: "50px" }}>
                <ChangePassword />
            </div>
        );
    }
}

export default withTranslation()(withRouter(DoiMatKhau));