import React from 'react';
import {Nav} from 'react-bootstrap';
import {connect} from 'react-redux';

const MainMenuLink = ({rootLocation, href, children}) => (
    <Nav.Link href={rootLocation + href}>{children}</Nav.Link>
);

export default connect(
    (state) => ({rootLocation: state.root.location})
)(MainMenuLink);
