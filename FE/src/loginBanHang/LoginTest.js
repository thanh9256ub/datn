import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from "react-i18next";
import LoginBanHang from './LoginBanHang';

class LoginTest extends Component {
    state = {};

    render() {
        return (
            <div style={{ marginTop: "50px" }}>
                <LoginBanHang />
            </div>
        );
    }

}

export default withTranslation()(withRouter(LoginTest));