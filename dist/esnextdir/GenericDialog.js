/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import * as React from "react";
import { Button, Classes, Dialog, Tooltip } from "@blueprintjs/core";
export default class GenericDialog extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            autoFocus: true,
            canEscapeKeyClose: true,
            canOutsideClickClose: true,
            enforceFocus: true,
            usePortal: true,
        };
        this.handleOpen = () => this.setState({ isOpen: true });
        this.handleClose = () => this.setState({ isOpen: false });
    }
    render() {
        return (React.createElement(Dialog, Object.assign({ icon: "info-sign" }, this.props, this.state),
            React.createElement("div", { className: Classes.DIALOG_BODY }, this.props.children),
            React.createElement("div", { className: Classes.DIALOG_FOOTER },
                React.createElement("div", { className: Classes.DIALOG_FOOTER_ACTIONS },
                    React.createElement(Tooltip, { content: "Close this dialog." },
                        React.createElement(Button, { onClick: this.handleClose }, "Close"))))));
    }
}
