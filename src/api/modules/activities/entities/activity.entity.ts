import { Entity } from "@/api/@types/entity";
import { UniqueEntityID } from "@/api/@types/unique-entity-id";
import mongoose from "mongoose";
import { AnswerType, answerSchema } from "./answer.entity";

export type ActivityType = {
    name: string,
    description?: string,
    descriptionFileDir?: string,
    answers?: AnswerType[],
    created_at?: Date
    updated_at?: Date
};

export class Activity extends Entity<ActivityType> implements ActivityType {

    constructor(props: ActivityType, id?: UniqueEntityID) {
        super(props, id)
    }

    get name() { return this.props.name }
    get description() { return this.props.description }
    get descriptionFileDir() { return this.props.descriptionFileDir }
    get answers() { return this.props.answers }
    get created_at() { return this.props.created_at }
    get updated_at() { return this.props.updated_at }

}

export const activitySchema = new mongoose.Schema<ActivityType>(
    {
        name: { type: String, required: true },
        description: { type: String },
        descriptionFileDir: { type: String },
        answers: [answerSchema],
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
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

export const ActivityModel = mongoose.model<ActivityType>("activities", activitySchema);