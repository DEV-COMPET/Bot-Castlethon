import { BaseRepository } from '../../../@types/repository';
import { ActivityType } from '../entities/activity.entity';
import { AnswerType } from '../entities/answer.entity';
import { ActivityData } from './defaultMongoDBRepository/activityRepository';
import { AnswerData } from './defaultMongoDBRepository/answerRepository';
export abstract class Repository<T> implements BaseRepository<T> {
	public abstract create(data: T): Promise<T | undefined> | T | undefined;
	public abstract list(): Promise<T[]> | T[];
	public abstract getByName(nome: string): Promise<T | undefined> | T | undefined;
	public abstract deleteByName(nome: string): Promise<T | undefined> | T | undefined;
}

export type WithId<T> = { id: string } & T;

export type ActivityRepository = Repository<ActivityType> 
	& { update: (nome: string, updatedData: ActivityData) => Promise<ActivityType | undefined> }
	& { open: (name: string) => Promise<ActivityType | undefined> }
	& { close: (name: string) => Promise<ActivityType | undefined> };

export type AnswerRepository = Repository<AnswerType> 
	& { update: (nome: string, updatedData: AnswerData) => Promise<AnswerType | undefined> }
	& { getByTeamNameActivityName: (teamName: string, activityName: string) => Promise<AnswerType | undefined> }
	& { deleteByTeamNameActivityName: (teamName: string, activityName: string) => Promise<AnswerType | undefined> }


	
