import type { TeamRepository as InterfaceTeamRepository } from "..";
import { DefaultMongoDBRepository } from ".";
import { Team, TeamModel, TeamType } from "../../entities/team.entity";
import { MemberType } from "@/api/modules/members/entities/member.entity";

export type TeamData = {
  name?: string,
  profile_picture?: string,
  members?: MemberType[],
  institution?: string,
  created_at?: Date
  updated_at?: Date
};

export class TeamMongoDBRepository extends DefaultMongoDBRepository<TeamType> implements InterfaceTeamRepository {

  constructor(private teamModel = TeamModel) {
    super(teamModel);
  }

  public async list(): Promise<TeamType[]> {
    const teams = this.teamModel.find();
    const result = (await teams).map((team) => {
      const result: TeamType = team.toJSON();
      return result;
    });
    return result;
  }

  public async getByName(nome: string): Promise<TeamType | undefined> {
    const team = await this.teamModel.findOne({ nome });
    const result: TeamType | undefined = team?.toJSON();
    return result;
  }

  public async create(data: Team): Promise<TeamType | undefined> {
    
    const model = new this.teamModel(data._data)
    
    const createdData = await model.save();

    if (!createdData) {
      throw new Error("Failed to create new Data");
    }

    const result: TeamType = createdData.toJSON<TeamType>();
    
    return result;
  }

  public async deleteByName(nome: string): Promise<TeamType | undefined> {
    const deletedTeam = await this.teamModel.findOne({ nome });
    if (!deletedTeam) {
      return;
    }
    await deletedTeam.deleteOne();
    return deletedTeam.toJSON<TeamType>();
  }

  public async update(nome: string, data: TeamData): Promise<TeamType | undefined> {
    const updatedTeam = await this.teamModel.findOneAndUpdate(
      { nome },
      data,
      { new: true }
    );
    if (!updatedTeam) {
      return;
    }
    return updatedTeam.toJSON<TeamType>();
  }
}
