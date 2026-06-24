import type { Pool } from 'mysql2/promise';

export class AdminController {

  static getData(mySqlPool: Pool): any {
    return async (req: any, res: any, next: any) => {
      
      const sql = 'SELECT county, state, subscription_level, created_at FROM Users WHERE subscriber=true AND verified=true';
      
      try {
        const [results] = await mySqlPool.execute(sql);
        res.json(results);
      }
      catch(err) {
        console.error('error executing SQL: ', err);
        return res.status(500).send('Database error');
      }
    }
  }
}  