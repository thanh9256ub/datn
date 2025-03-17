import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from "react-i18next";
import LoginBanHang from './LoginBanHang';
import SettingsPanel from '../admin/shared/SettingsPanel';
import Footer from '../admin/shared/Footer';

class LoginTest extends Component {
    state = {};

    render() {
        let SettingsPanelComponent = !this.state.isFullPageLayout ? <SettingsPanel /> : '';
        let footerComponent = !this.state.isFullPageLayout ? <Footer /> : '';
        return (
            <div className="container-scroller">
                <div className="container-fluid page-body-wrapper">
                    <div className="main-panel">
                        <div className="content-wrapper">
                            <LoginBanHang />
                            {SettingsPanelComponent}
                        </div>
                        {footerComponent}
                    </div>
                </div>
            </div>
        );
    }

    // componentDidUpdate(prevProps) {
    //     if (this.props.location !== prevProps.location) {
    //         this.onRouteChanged();
    //     }
    // }

    // onRouteChanged() {
    //     console.log("ROUTE CHANGED");
    //     const { i18n } = this.props;
    //     const body = document.querySelector('body');
    //     if (this.props.location.pathname === '/layout/RtlLayout') {
    //         body.classList.add('rtl');
    //         i18n.changeLanguage('ar');
    //     }
    //     else {
    //         body.classList.remove('rtl');
    //         i18n.changeLanguage('en');
    //     }
    //     window.scrollTo(0, 0);
    //     const fullPageLayoutRoutes = ['/user-pages/login-1', '/user-pages/register-1', '/user-pages/lockscreen', '/error-pages/error-404', '/error-pages/error-500', '/general-pages/landing-page'];
    //     for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
    //         if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
    //             this.setState({
    //                 isFullPageLayout: true
    //             });
    //             document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
    //             break;
    //         } else {
    //             this.setState({
    //                 isFullPageLayout: false
    //             });
    //             document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
    //         }
    //     }
    // }
}

export default withTranslation()(withRouter(LoginTest));
