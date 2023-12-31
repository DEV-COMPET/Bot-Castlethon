import { Entity } from "@/api/@types/entity";
import { UniqueEntityID } from "@/api/@types/unique-entity-id";
import mongoose from "mongoose";
import { AnswerType, answerSchema } from "./answer.entity";

export type ActivityMessage = {
    messsageId: string,
    textChannelName: string
}

export type ActivityType = {
    name: string,
    description?: string,
    descriptionFileDir?: string,
    answers?: AnswerType[],
    chatMessagesIds: ActivityMessage[], // ids das mensagens de envio de tarefas (para pessoas receberem tarefa)
    opened_at: Date | null,
    closed_at: Date | null,
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
    get chatMessagesIds() { return this.props.chatMessagesIds }
    get opened_at() { return this.props.opened_at }
    get closed_at() { return this.props.closed_at }
    get created_at() { return this.props.created_at }
    get updated_at() { return this.props.updated_at }

}

export const activitySchema = new mongoose.Schema<ActivityType>(
    {
        name: { type: String, required: true },
        description: { type: String },
        descriptionFileDir: { type: String },
        answers: [answerSchema],
        chatMessagesIds: [{
            _id: false,
            messsageId: { type: String, required: true },
            textChannelName: { type: String, required: true },
        }],
        opened_at: { type: Date, default: null },
        closed_at: { type: Date, default: null },
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