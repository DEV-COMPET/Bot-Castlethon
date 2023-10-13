import type { MemberRepository as InterfaceMemberRepository } from "..";
import { DefaultMongoDBRepository } from ".";
import { Member, MemberModel, MemberType } from "../../entities/member.entity";

export type MemberData = {
  name?: string,
  profile_picture?: string,
  email?: string,
  role?: string,
  institution?: string,
  teamId?: string,
  created_at?: Date
  updated_at?: Date
};

export class MemberMongoDBRepository extends DefaultMongoDBRepository<MemberType> implements InterfaceMemberRepository {

  constructor(private memberModel = MemberModel) {
    super(memberModel);
  }

  public async list(): Promise<MemberType[]> {
    const members = this.memberModel.find();
    const result = (await members).map((member) => {
      const result: MemberType = member.toJSON();
      return result;
    });
    return result;
  }

  public async getByName(name: string): Promise<MemberType | undefined> {
    const member = await this.memberModel.findOne({ name });
    const result: MemberType | undefined = member?.toJSON();
    return result;
  }

  public async getByEmail(email: string): Promise<MemberType | undefined> {
    const member = await this.memberModel.findOne({ email });
    const result: MemberType | undefined = member?.toJSON();
    return result;
  }

  public async getByDiscordId(discord_id: string): Promise<MemberType | undefined> {
    const member = await this.memberModel.findOne({ discord_id });
    const result: MemberType | undefined = member?.toJSON();
    return result;
  }

  public async create(data: Member): Promise<MemberType | undefined> {
    const model = new this.memberModel(data._data);
    const createdData = await model.save();
    if (!createdData) {
      throw new Error("Failed to create new Data");
    }
    const result: MemberType = createdData.toJSON<MemberType>();
    return result;
  }

  public async deleteByName(nome: string): Promise<MemberType | undefined> {
    const deletedMember = await this.memberModel.findOne({ nome });
    if (!deletedMember) {
      return;
    }
    await deletedMember.deleteOne();
    return deletedMember.toJSON<MemberType>();
  }

  public async update(nome: string, data: MemberData): Promise<MemberType | undefined> {
    const updatedMember = await this.memberModel.findOneAndUpdate(
      { nome },
      data,
      { new: true }
    );
    if (!updatedMember) {
      return;
    }
    return updatedMember.toJSON<MemberType>();
  }
}
