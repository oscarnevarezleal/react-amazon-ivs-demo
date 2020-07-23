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

import {Button, Classes, Dialog, Tooltip} from "@blueprintjs/core";


export interface IGenericDialogState {

}

export interface GenericDialogProps {
    autoFocus?: boolean;
    canEscapeKeyClose?: boolean;
    canOutsideClickClose?: boolean;
    enforceFocus?: boolean;
    isOpen: boolean;
    usePortal?: boolean;
}

export default class GenericDialog extends React.PureComponent<GenericDialogProps, IGenericDialogState> {
    public state: IGenericDialogState = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        usePortal: true,
    };

    public render() {
        return (
            <Dialog
                icon="info-sign"
                {...this.props}
                {...this.state}
            >
                <div className={Classes.DIALOG_BODY}>
                    {this.props.children}
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Tooltip content="Close this dialog.">
                            <Button onClick={this.handleClose}>Close</Button>
                        </Tooltip>
                    </div>
                </div>
            </Dialog>
        );
    }

    private handleOpen = () => this.setState({isOpen: true});
    private handleClose = () => this.setState({isOpen: false});

}
