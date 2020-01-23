import React from 'react';
import PropType from 'prop-types';
import { Field } from 'formik';
import cx from 'classnames';
import selectn from 'selectn';

import { Column, FormGroup } from "ui/control";

export class SelectField extends React.PureComponent {

    static propTypes = {
        name: PropType.string,
        title: PropType.string,
        horizontal: PropType.bool,
        groupClassName: PropType.string,
        col: PropType.string,
        size: PropType.string,
        choices: PropType.arrayOf(PropType.object),
        multiple: PropType.bool,
        autoFocus: PropType.bool,
        anyValue: PropType.bool,
        className: PropType.string,
        autoComplete: PropType.string,
        noFeedback: PropType.bool
    };

    constructor(props) {
        super(props);
        this.inputDom = null;
    }

    componentDidMount() {
        if (this.props.autoFocus && this.inputDom) {
            this.inputDom.focus();
        }
    }

    render() {
        const {
            name, title, horizontal = false, groupClassName, col, size, choices, multiple, anyValue, className,
            autoComplete, noFeedback = false
        } = this.props;

        return (
            <FormGroup title={title} name={name} horizontal={horizontal} groupClassName={groupClassName}>
                <Field name={name}>
                    {({field, form}) => {
                        const touched = selectn(field.name, form.touched);
                        const error = selectn(field.name, form.errors);
                        return (
                            <Column className={col}>
                                <select
                                    {...field}
                                    id={name}
                                    className={cx(
                                        "form-control", {
                                            "form-control-sm": size === "sm",
                                            "form-control-lg": size === "lg",
                                            "is-valid": !anyValue && touched && !error,
                                            "is-invalid": !anyValue && touched && error,
                                            [className]: !!className
                                        })}
                                    multiple={multiple}
                                    autoComplete={autoComplete}
                                    ref={dom => this.inputDom = dom}
                                >
                                    {choices.map(c => <option key={c.value} value={c.value}>{c.title}</option>)}
                                </select>
                                {!noFeedback && touched && error && <div className="invalid-feedback">{error}</div>}
                            </Column>
                        );
                    }}
                </Field>
            </FormGroup>
        );
    }

}