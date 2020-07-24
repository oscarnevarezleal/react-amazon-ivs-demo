import * as React from "react";

import {Button, Classes, Dialog, Tooltip} from "@blueprintjs/core";
import {Radio, RadioGroup} from "@blueprintjs/core";
import {TextMetadataCue} from "amazon-ivs-player";
import {Callout, Code, H5, Intent, Switch} from "@blueprintjs/core";

export interface IQuestionDialogState {

}

interface OnSkipHandler {
    (): any
}

export interface QuestionType {
    question: string,
    answers: Array<string>,
    correctIndex: number
}

export interface QuestionDialogProps {
    question: QuestionType | any,
    onSkip: OnSkipHandler | undefined,
    autoFocus?: boolean;
    canEscapeKeyClose?: boolean;
    canOutsideClickClose?: boolean;
    enforceFocus?: boolean;
    isOpen: boolean;
    title: string,
    usePortal?: boolean;
}

export default class QuestionDialog extends React.PureComponent<QuestionDialogProps, IQuestionDialogState> {
    public state: IQuestionDialogState = {
        autoFocus: true,
        canEscapeKeyClose: true,
        canOutsideClickClose: true,
        enforceFocus: true,
        usePortal: true,
    };

    public render() {
        return (
            <Dialog
                {...this.state}
                {...this.props}
            >
                <div className={Classes.DIALOG_BODY}>
                    {this.props.question &&
                    <div>
                        <span className={'bp3-text-large'}>{this.props.question.question}</span>
                        <br/>
                        <br/>
                        <RadioGroup
                            onChange={e => console.log('Answer was provided', e)}
                            label="Please provide your answer">
                            {this.props.question.answers.map((a: string, index: number) => <Radio label={a}
                                                                                                  value={index}/>)}
                        </RadioGroup>
                    </div>
                    }
                </div>
                <div className={Classes.DIALOG_FOOTER}>
                    <div className={Classes.DIALOG_FOOTER_ACTIONS}>
                        <Tooltip content="Close this dialog.">
                            <Button onClick={this.handleSkip}>Skip</Button>
                        </Tooltip>
                    </div>
                </div>
            </Dialog>
        );
    }

    private handleOpen = () => this.setState({isOpen: true});
    private handleClose = () => this.setState({isOpen: false});
    private handleSkip = () => this.props.onSkip && this.props.onSkip()

}
