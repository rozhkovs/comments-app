import getAppDatabase, { GetDatabase } from '@/shared/database/get-database';

export interface UserDbModel {
  id: number;
  email: string;
  name: string;
}

export type UserCreateDbModel = Pick<UserDbModel, 'name' | 'email'>;

class UserRepository {
  private readonly getDatabase: GetDatabase;

  constructor({ getDatabase }: { getDatabase: GetDatabase }) {
    this.getDatabase = getDatabase;
  }

  getById = async (id: UserDbModel['id']): Promise<UserDbModel | null> => {
    const db = await this.getDatabase();
    const sql = 'SELECT * FROM users WHERE id = ?';
    return await db.getFirstAsync<UserDbModel>(sql, id);
  };

  create = async ({
    email,
    name,
  }: UserCreateDbModel): Promise<UserDbModel['id']> => {
    const db = await this.getDatabase();
    const sql = 'INSERT INTO users (email, name) VALUES (?, ?)';
    const result = await db.runAsync(sql, email, name);
    return result.lastInsertRowId;
  };
}

export default new UserRepository({ getDatabase: getAppDatabase });
