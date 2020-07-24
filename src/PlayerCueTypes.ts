export type CueQuestionType = {
    startTime: bigint,
    endTime: bigint,
    type: string,
    description: string,
    text: string // json encoded
}