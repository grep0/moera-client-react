import React from 'react';
import { connect as connectFormik } from 'formik';

import ComposeIconButton from "ui/compose/ComposeIconButton";

const ComposePublishAtButton = ({formik}) => {
    const changed = formik.values.publishAt.getTime() !== formik.values.publishAtDefault.getTime();
    return <ComposeIconButton icon={["far", "clock"]} name="publishAtVisible" changed={changed}
                              tooltip="Change post date/time"/>
};

export default connectFormik(ComposePublishAtButton);
