import { Entity } from "@/api/@types/entity";
import { UniqueEntityID } from "@/api/@types/unique-entity-id";
import mongoose from "mongoose";

export type AnswerType = {
    teamName: string,
    answerText?: string,
    answerDir?: string,
    created_at?: Date
    updated_at?: Date
};

export class Answer extends Entity<AnswerType> implements AnswerType {

    constructor(props: AnswerType, id?: UniqueEntityID) {
        super(props, id)
    }

    get teamName() { return this.props.teamName }
    get answerText() { return this.props.answerText }
    get answerDir() { return this.props.answerDir }
    get created_at() { return this.props.created_at }
    get updated_at() { return this.props.updated_at }

}

export const answerSchema = new mongoose.Schema<AnswerType>(
    {
        teamName: { type: String, required: true },
        answerText: { type: String, required: false },
        answerDir: { type: String, required: false },
        created_at: { type: Date, required: true },
        updated_at: { type: Date, required: true },
    },
    {
        versionKey: false,
        toJSON: {
            transform: (_, ret): void => {
                ret.id = ret._id.toString();
                delete ret._id;
                delete ret.__v;
            },
        },
    }
);

export const AnswerModel = mongoose.model<AnswerType>("answers", answerSchema);