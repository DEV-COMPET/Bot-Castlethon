import { Entity } from "@/api/@types/entity";
import { UniqueEntityID } from "@/api/@types/unique-entity-id";
import mongoose from "mongoose";

export type MemberType = {
    name: string,
    profile_picture?: string,
    email: string,
    role: string,
    institution: string,
    teamName?: string,
    created_at?: Date
    updated_at?: Date
};

export class Member extends Entity<MemberType> {

    constructor(props: MemberType, id?: UniqueEntityID) {
        super(props, id)
    }

    get name() { return this.props.name }
    get profile_picture() { return this.props.profile_picture }
    get email() { return this.props.email }
    get role() { return this.props.role }
    get institution() { return this.props.institution }
    get teamName() { return this.props.teamName }
    get created_at() { return this.props.created_at }
    get updated_at() { return this.props.updated_at }
}

export const memberSchema = new mongoose.Schema<MemberType>(
    {
        name: { type: String, required: true },
        profile_picture: { type: String, required: false },
        email: { type: String, required: true },
        role: { type: String, required: true },
        teamName: { type: String, required: false },
        institution: { type: String, required: true },
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

export const MemberModel = mongoose.model<MemberType>("members", memberSchema);