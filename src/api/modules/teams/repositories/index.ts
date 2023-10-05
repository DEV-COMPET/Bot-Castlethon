import { BaseRepository } from '../../../@types/repository';
import { TeamType } from '../entities/team.entity';
import { TeamData } from './defaultMongoDBRepository/teamRepository';
export abstract class Repository<T> implements BaseRepository<T> {
	public abstract create(data: T): Promise<T | undefined> | T | undefined;
	public abstract list(): Promise<T[]> | T[];
	public abstract getByName(nome: string): Promise<T | undefined> | T | undefined;
	public abstract deleteByName(nome: string): Promise<T | undefined> | T | undefined;
}

export type WithId<T> = { id: string } & T;

export type TeamRepository = Repository<TeamType> & { update: (nome: string, updatedData: TeamData) => Promise<TeamType | undefined> };
