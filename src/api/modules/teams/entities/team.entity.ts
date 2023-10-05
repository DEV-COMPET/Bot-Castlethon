import { Entity } from "@/api/@types/entity";
import { UniqueEntityID } from "@/api/@types/unique-entity-id";
import mongoose from "mongoose";
import { MemberModel, MemberType } from "../../members/entities/member.entity";

export type TeamType = {
    name: string,
    profile_picture?: string,
    members: MemberType[],
    institution: string,
    created_at?: Date
    updated_at?: Date
};

export class Team extends Entity<TeamType> implements TeamType {

    constructor(props: TeamType, id?: UniqueEntityID) {
        super(props, id)
    }

    get name() { return this.props.name }
    get profile_picture() { return this.props.profile_picture }
    get institution() { return this.props.institution }
    get members() { return this.props.members }
    get created_at() { return this.props.created_at }
    get updated_at() { return this.props.updated_at }
}

const schema = new mongoose.Schema<TeamType>(
    {
        name: { type: String, required: true },
        profile_picture: { type: String, required: true },
        institution: { type: String, required: true },
        members: { type: [MemberModel], required: true },
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

export const TeamModel = mongoose.model<TeamType>("membros", schema);