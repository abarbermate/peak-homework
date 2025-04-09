import { ObjectLiteral, Repository } from 'typeorm';

export type MockQueryBuilder = {
  leftJoinAndSelect: jest.Mock;
  innerJoinAndSelect: jest.Mock;
  leftJoin: jest.Mock;
  innerJoin: jest.Mock;
  where: jest.Mock;
  andWhere: jest.Mock;
  orWhere: jest.Mock;
  having: jest.Mock;
  andHaving: jest.Mock;
  orHaving: jest.Mock;
  orderBy: jest.Mock;
  addOrderBy: jest.Mock;
  select: jest.Mock;
  addSelect: jest.Mock;
  update: jest.Mock;
  delete: jest.Mock;
  insert: jest.Mock;
  getOne: jest.Mock;
  getMany: jest.Mock;
  getRawOne: jest.Mock;
  getRawMany: jest.Mock;
  getCount: jest.Mock;
  execute: jest.Mock;
  setParameters: jest.Mock;
  limit: jest.Mock;
  offset: jest.Mock;
};

export const createMockQueryBuilder = (): MockQueryBuilder => ({
  leftJoinAndSelect: jest.fn().mockReturnThis(),
  innerJoinAndSelect: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  innerJoin: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  having: jest.fn().mockReturnThis(),
  andHaving: jest.fn().mockReturnThis(),
  orHaving: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  addOrderBy: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  addSelect: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockResolvedValue(undefined),
  getMany: jest.fn().mockResolvedValue([]),
  getRawOne: jest.fn().mockResolvedValue(undefined),
  getRawMany: jest.fn().mockResolvedValue([]),
  getCount: jest.fn().mockResolvedValue(0),
  execute: jest.fn().mockResolvedValue(undefined),
  setParameters: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  offset: jest.fn().mockReturnThis(),
});

export type MockRepository<T extends ObjectLiteral> = Partial<Record<keyof Repository<T>, jest.Mock>> & {
  createQueryBuilder: jest.Mock & (() => MockRepository<T>);
};

export const createMockRepository = <T extends ObjectLiteral>(): MockRepository<T> => {
  return {
    average: undefined,
    decrement: undefined,
    existsBy: undefined,
    extend: undefined,
    findAndCountBy: undefined,
    findOneByOrFail: undefined,
    getId: undefined,
    hasId: undefined,
    increment: undefined,
    maximum: undefined,
    merge: undefined,
    minimum: undefined,
    preload: undefined,
    queryRunner: undefined,
    sum: undefined,
    target: undefined,
    upsert: undefined,
    createQueryBuilder: jest.fn().mockImplementation(() => createMockQueryBuilder()),

    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findOneOrFail: jest.fn(),
    find: jest.fn(),
    findBy: jest.fn(),
    findAndCount: jest.fn(),

    save: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    softDelete: jest.fn(),
    restore: jest.fn(),

    count: jest.fn(),
    countBy: jest.fn(),
    exists: jest.fn(),

    remove: jest.fn(),
    softRemove: jest.fn(),

    query: jest.fn(),
    clear: jest.fn(),
  };
};
