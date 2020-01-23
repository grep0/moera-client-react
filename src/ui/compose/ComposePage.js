import React from 'react';
import { connect } from 'react-redux';
import { Form, withFormik } from 'formik';
import * as yup from 'yup';
import moment from 'moment';

import { Page } from "ui/page/Page";
import { Button, ConflictWarning, Loading } from "ui/control";
import { InputField, TextField } from "ui/control/field";
import ComposeIconButton from "ui/compose/ComposeIconButton";
import ComposeBodyFormatButton from "ui/compose/ComposeBodyFormatButton";
import ComposeBodyFormat from "ui/compose/ComposeBodyFormat";
import ComposePublishAt from "ui/compose/ComposePublishAt";
import ComposeReactions from "ui/compose/ComposeReactions";
import ComposeSubmitButton from "ui/compose/ComposeSubmitButton";
import { goToPosting } from "state/navigation/actions";
import { composeConflictClose, composePost } from "state/compose/actions";
import { getSetting } from "state/settings/selectors";

import "./ComposePage.css";

class ComposePage extends React.PureComponent {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.posting != null && prevProps.posting == null) {
            this.props.resetForm();
        }
    }

    render() {
        const {loadingFeatures, subjectPresent, sourceFormats, loadingPosting, postingId, conflict, beingPosted,
               goToPosting, composeConflictClose} = this.props;
        const title = postingId == null ? "New Post" : "Edit Post";
        return (
            <Page>
                <h2>
                    {title}
                    {postingId != null &&
                        <Button variant="outline-secondary" size="sm" onClick={e => goToPosting(postingId)}
                                className="ml-3">
                            &larr; Post
                        </Button>
                    }
                    <Loading active={loadingFeatures || loadingPosting}/>
                </h2>

                <div className="composer">
                    <Form>
                        <ConflictWarning text="The post was edited by somebody." show={conflict}
                                         onClose={composeConflictClose}/>
                        {subjectPresent &&
                            <InputField name="subject" title="Title" anyValue disabled={loadingPosting}/>
                        }
                        <TextField name="body" anyValue autoFocus disabled={loadingPosting}/>

                        <ComposeBodyFormat sourceFormats={sourceFormats}/>
                        <ComposePublishAt/>
                        <ComposeReactions/>

                        <ComposeBodyFormatButton sourceFormats={sourceFormats}/>
                        <ComposeIconButton icon="clock" name="publishAtCustomized"/>
                        <ComposeIconButton icon="thumbs-up" name="reactionsCustomized"/>

                        <ComposeSubmitButton loading={beingPosted} update={postingId != null}/>
                    </Form>
                </div>
            </Page>
        );
    }

}

const composePageLogic = {

    mapPropsToValues(props) {
        return {
            subject: props.subject
                || (props.posting != null && props.posting.bodySrc.subject != null ? props.posting.bodySrc.subject : ""),
            body: props.body || (props.posting != null ? props.posting.bodySrc.text : ""),
            bodyFormatCustomized: false,
            bodyFormat: props.bodyFormat || (props.posting != null ? props.posting.bodySrcFormat : "markdown"),
            publishAtCustomized: props.publishAtCustomized || false,
            publishAt: props.publishAt
                || (props.posting != null ? moment.unix(props.posting.publishedAt).toDate() : new Date()),
            reactionsCustomized: props.reactionsCustomized || false,
            reactionsPositive: props.reactionsPositive != null
                ? props.reactionsPositive
                : (props.posting != null ? props.posting.acceptedReactions.positive : props.reactionsPositiveDefault),
            reactionsNegative: props.reactionsNegative != null
                ? props.reactionsNegative
                : (props.posting != null ? props.posting.acceptedReactions.negative : props.reactionsNegativeDefault)
        };
    },

    validationSchema: yup.object().shape({
        body: yup.string().trim().required("Must not be empty")
    }),

    handleSubmit(values, formik) {
        formik.props.composePost(
            formik.props.postingId, {
                bodySrc: JSON.stringify({
                        subject: formik.props.subjectPresent ? values.subject.trim() : null,
                        text: values.body.trim()
                    }),
                bodySrcFormat: values.bodyFormat.trim(),
                publishAt: values.publishAtCustomized ? moment(values.publishAt).unix() : null,
                acceptedReactions: values.reactionsCustomized
                    ? {positive: values.reactionsPositive, negative: values.reactionsNegative}
                    : (formik.props.posting == null
                        ? {
                              positive: formik.props.reactionsPositiveDefault,
                              negative: formik.props.reactionsNegativeDefault
                          }
                        : null)
            }
        );
        formik.setSubmitting(false);
    }

};

export default connect(
    state => ({
        loadingFeatures: state.compose.loadingFeatures,
        subjectPresent: state.compose.subjectPresent,
        sourceFormats: state.compose.sourceFormats,
        loadingPosting: state.compose.loadingPosting,
        postingId: state.compose.postingId,
        posting: state.compose.posting,
        conflict: state.compose.conflict,
        beingPosted: state.compose.beingPosted,
        reactionsPositiveDefault: getSetting(state, "posting.reactions.positive.default"),
        reactionsNegativeDefault: getSetting(state, "posting.reactions.negative.default")
    }),
    { goToPosting, composePost, composeConflictClose }
)(withFormik(composePageLogic)(ComposePage));