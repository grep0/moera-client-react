import React from 'react';
import { connect } from 'react-redux';
import { Manager, Popper, Reference } from 'react-popper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { isStandaloneMode } from "state/navigation/selectors";
import { Browser } from "ui/browser";
import "./DropdownMenu.css";

class DropdownMenuImpl extends React.PureComponent {

    state = {
        visible: false
    };

    toggle = e => {
        if (!this.state.visible) {
            this.show();
        } else {
            this.hide();
        }
        e.preventDefault();
    };

    show() {
        this.setState({visible: true});
        document.getElementById("app-root").addEventListener("click", this.hide);
    }

    hide = () => {
        this.setState({visible: false});
        document.getElementById("app-root").removeEventListener("click", this.hide);
    };

    buildItems() {
        const items = [];
        let divider = false;
        for (let item of this.props.items) {
            if (item.divider) {
                divider = true;
                continue;
            }
            if (!item.show) {
                continue;
            }
            items.push({
                title: item.title,
                href: !this.props.standalone ? item.href : Browser.passedLocation(item.href),
                onClick: item.onClick,
                divider: divider && items.length > 0
            });
            divider = false;
        }
        return items;
    }

    render() {
        return (
            <Manager>
                <Reference>
                    {({ref}) => (
                        <div className="menu" ref={ref} onClick={this.toggle}>
                            <FontAwesomeIcon icon="chevron-down" className="chevron"/>
                            <Popper placement="bottom-end">
                                {({ref, style, placement}) => {
                                    if (!this.state.visible) {
                                        return null;
                                    }
                                    const items = this.buildItems();
                                    return (
                                        <div ref={ref} style={style}
                                             className={`bs-popover-${placement} fade dropdown-menu shadow-sm show`}>
                                            {items.length > 0 ?
                                                items.map((item, index) => (
                                                    <React.Fragment key={index}>
                                                        {item.divider && <div className="dropdown-divider"/>}
                                                        <a className="dropdown-item" href={item.href}
                                                           onClick={e => {item.onClick(); e.preventDefault()}}>
                                                            {item.title}
                                                        </a>
                                                    </React.Fragment>
                                                ))
                                            :
                                                <span className="dropdown-item disabled no-actions">No actions</span>
                                            }
                                        </div>
                                    );
                                }}
                            </Popper>
                        </div>
                    )}
                </Reference>
            </Manager>
        );
    }

}

export const DropdownMenu = connect(
    state => ({
        standalone: isStandaloneMode(state)
    })
)(DropdownMenuImpl);
