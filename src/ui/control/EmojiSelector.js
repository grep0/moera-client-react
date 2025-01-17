import React from 'react';
import PropType from 'prop-types';
import cx from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { REACTION_EMOJIS } from "api";
import Twemoji from "ui/twemoji/Twemoji";
import "./EmojiSelector.css";

const EmojiChoice = ({negative, emoji, invisible, dimmed, marked, onClick}) => {
    const re = !negative ? REACTION_EMOJIS.positive[emoji] : REACTION_EMOJIS.negative[emoji];
    return (
        <div className={cx("choice", {invisible})} onClick={e => onClick(negative, emoji)}>
            <Twemoji key={emoji} code={emoji} title={re ? re.title : ""}/>
            {dimmed && <div className="dimmer" title={re ? re.title : ""}/>}
            {marked && <div className="marker"><FontAwesomeIcon icon="certificate"/></div> }
        </div>
    );
};

export class EmojiSelector extends React.PureComponent {

    static propTypes = {
        negative: PropType.bool,
        reactions: PropType.arrayOf(PropType.shape({
            emoji: PropType.number,
            invisible: PropType.bool,
            dimmed: PropType.bool,
            marked: PropType.bool
        })),
        fixedWidth: PropType.bool,
        autoFocus: PropType.bool,
        onClick: PropType.func
    };

    componentDidMount() {
        if (this.props.autoFocus && this.domNode) {
            this.domNode.focus();
        }
    }

    render() {
        const {negative, reactions, fixedWidth, onClick} = this.props;
        return (
            <div className="emoji-selector" tabIndex="-1" style={{width: fixedWidth ? "15rem" : "auto"}}
                 ref={dom => {this.domNode = dom}}>
                {reactions.map(({emoji, invisible, dimmed, marked}) =>
                    <EmojiChoice key={emoji} negative={negative} emoji={emoji} invisible={invisible} dimmed={dimmed}
                                    marked={marked} onClick={onClick}/>
                )}
            </div>
        );
    }

}
