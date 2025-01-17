import React from 'react';
import { connect } from 'react-redux';
import { connect as connectFormik } from 'formik';

import { ClientSettings } from "api";
import { getSetting } from "state/settings/selectors";
import { settingsUpdate } from "state/settings/actions";
import "./ComposeFormattingHelp.css";

class ComposeFormattingHelp extends React.PureComponent {

    constructor(props, context) {
        super(props, context);

        this.state = {
            show: this.props.show
        };
    }

    toggleHelp(show) {
        this.setState({show});
        this.props.settingsUpdate([{
            name: ClientSettings.PREFIX + "posting.body-src-format.show-help",
            value: show.toString()
        }]);
    }

    showHelp = () => {
        this.toggleHelp(true);
    };

    hideHelp = () => {
        this.toggleHelp(false);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.show !== prevProps.show) {
            this.setState({show: this.props.show});
        }
    }

    render() {
        if (this.props.formik.values.bodyFormat !== "markdown") {
            return null;
        }
        if (this.state.show) {
            return (
                <div className="dialog-help">
                    <button type="button" className="close" onClick={this.hideHelp}>&times;</button>
                    <b>Markdown:</b> see{" "}
                    <a href="https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet">cheatsheet</a>
                    {" or "}<a href="https://www.markdowntutorial.com/">tutorial</a> to see how to do more.
                    See also <a href="https://www.webfx.com/tools/emoji-cheat-sheet/">emoji cheatsheet</a>.
                </div>
            );
        } else {
            return (
                <div className="formatting-help-show" onClick={this.showHelp}>Show formatting hint</div>
            );
        }
    }

}

export default connectFormik(
    connect(
        state => ({
            show: getSetting(state, "posting.body-src-format.show-help")
        }),
        { settingsUpdate }
    )(ComposeFormattingHelp)
);
