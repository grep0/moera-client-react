import React from 'react';
import { connect } from 'react-redux';
import { connect as connectFormik } from 'formik';

import { Button } from "ui/control";
import "./SettingsButtons.css";

const SettingsButtons = ({updating, formik}) => {
    const {dirty, handleReset} = formik;

    return (
        <div className="settings-buttons">
            <Button variant="secondary" className="col-sm-2 col-5" disabled={!dirty} onClick={handleReset}>
                Cancel
            </Button>
            <Button variant="primary" type="submit" className="col-sm-2 col-5" disabled={!dirty} loading={updating}>
                Save
            </Button>
        </div>
    );
};

export default connectFormik(
    connect(
        state => ({
            updating: state.settings.updating
        })
    )(SettingsButtons)
);
