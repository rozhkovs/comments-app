import getAppDatabase, { GetDatabase } from './get-database';
import { UserDbModel } from './user-repository';

export interface CommentDbModel {
  id: number;
  message: string;
  replyParentId: number | null;
  createdAt: string;
  userId: number;
  user: UserDbModel;
}

export type CommentCreateDbModel = Pick<
  CommentDbModel,
  'message' | 'replyParentId' | 'userId'
>;

class CommentRepository {
  private readonly getDatabase: GetDatabase;

  constructor({ getDatabase }: { getDatabase: GetDatabase }) {
    this.getDatabase = getDatabase;
  }

  getCascadeList = async ({
    page,
    perPage,
  }: {
    page: number;
    perPage: number;
  }): Promise<CommentDbModel[]> => {
    const db = await this.getDatabase();

    const sql = `
      WITH RECURSIVE comment_recursive AS (
      SELECT
        c.id,
        c.message,
        c.reply_parent_id,
        c.created_at,
        c.user_id,
        substr("0000000000" || (CURRENT_TIMESTAMP - CAST(strftime('%s', c.created_at) AS INTEGER)), -10, 10) AS path
      from comments c
      where c.reply_parent_id IS NULL
    
      UNION
    
      SELECT
        c.id,
        c.message,
        c.reply_parent_id,
        c.created_at,
        c.user_id,
        cr.path || '-' || substr("0000000000" || (CURRENT_TIMESTAMP - CAST(strftime('%s', c.created_at) AS INTEGER)), -10, 10) AS path
      FROM comments c
        JOIN comment_recursive cr ON c.reply_parent_id = cr.id
    ) 
    
    SELECT
      c.id,
      c.message,
      c.path,
      c.reply_parent_id as replyParentId,
      strftime('%Y-%m-%dT%H:%M:%fZ', c.created_at) as createdAt, -- example: '2024-07-22T09:02:25.143Z'
      c.user_id as userId,
      u.email as userEmail,
      u.name as userName
    FROM comment_recursive c
      LEFT JOIN users u ON u.id = c.user_id
    ORDER BY c.path, c.id desc
    LIMIT $perPage OFFSET $page * $perPage
    `;

    const rawList = await db.getAllAsync<any>(sql, {
      ['$page']: page,
      ['$perPage']: perPage,
    });

    return rawList.map(CommentRepository.mapToModel);
  };

  getById = async (
    id: CommentDbModel['id'],
  ): Promise<CommentDbModel | null> => {
    const db = await this.getDatabase();
    const sql = `
      SELECT 
        c.id,
        c.message,
        c.reply_parent_id as replyParentId,
        strftime('%Y-%m-%dT%H:%M:%fZ', c.created_at) as createdAt, -- example: '2024-07-22T09:02:25.143Z'
        c.user_id as userId,
        u.email as userEmail,
        u.name as userName
      FROM comments c
        JOIN users u ON c.user_id = u.id
      WHERE c.id = $id
    `;
    const rawData = await db.getFirstAsync<any>(sql, {
      ['$id']: id,
    });

    return rawData ? CommentRepository.mapToModel(rawData) : null;
  };

  create = async ({
    message,
    replyParentId,
    userId,
  }: CommentCreateDbModel): Promise<CommentDbModel['id']> => {
    const db = await this.getDatabase();
    const sql =
      'INSERT INTO comments (message, reply_parent_id, user_id) VALUES (?, ?, ?)';
    const result = await db.runAsync(sql, message, replyParentId, userId);
    return result.lastInsertRowId;
  };

  private static mapToModel = (rawData: any): CommentDbModel => ({
    id: rawData.id,
    message: rawData.message,
    replyParentId: rawData.replyParentId,
    createdAt: rawData.createdAt,
    userId: rawData.userId,
    user: {
      id: rawData.userId,
      email: rawData.userEmail,
      name: rawData.userName,
    },
  });
}

export default new CommentRepository({ getDatabase: getAppDatabase });
