import type { AnswerRepository as InterfaceAnswerRepository } from "..";
import { DefaultMongoDBRepository } from ".";
import { Answer, AnswerModel, AnswerType } from "../../entities/answer.entity";

export type AnswerData = {
  teamName?: string,
  answerText?: string,
  answerDir?: string,
  created_at?: Date
  updated_at?: Date
};

export class AnswerMongoDBRepository extends DefaultMongoDBRepository<AnswerType> implements InterfaceAnswerRepository {

  constructor(private answerModel = AnswerModel) {
    super(answerModel);
  }

  public async list(): Promise<AnswerType[]> {
    const answers = this.answerModel.find();
    const result = (await answers).map((answer) => {
      const result: AnswerType = answer.toJSON();
      return result;
    });
    return result;
  }answerExists

  public async getByName(name: string): Promise<AnswerType | undefined> {
    
    const answer = await this.answerModel.findOne({ name });
    const result: AnswerType | undefined = answer?.toJSON();
    return result;
  }

  public async create(data: Answer): Promise<AnswerType | undefined> {
    
    const model = new this.answerModel(data._data)
    
    const createdData = await model.save();

    if (!createdData) {
      throw new Error("Failed to create new Data");
    }

    const result: AnswerType = createdData.toJSON<AnswerType>();
    
    return result;
  }

  public async deleteByName(nome: string): Promise<AnswerType | undefined> {
    const deletedAnswer = await this.answerModel.findOne({ nome });
    if (!deletedAnswer) {
      return;
    }
    await deletedAnswer.deleteOne();
    return deletedAnswer.toJSON<AnswerType>();
  }

  public async update(nome: string, data: AnswerData): Promise<AnswerType | undefined> {
    const updatedAnswer = await this.answerModel.findOneAndUpdate(
      { nome },
      data,
      { new: true }
    );
    if (!updatedAnswer) {
      return;
    }
    return updatedAnswer.toJSON<AnswerType>();
  }
}
