import type { UsersModel } from './../../models/users.model';
import type { Pool } from 'mysql2/promise';
import bcrypt from 'bcrypt';

class User implements UsersModel {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  phoneNumber: string;
  streetAddress: string;
  county: string;
  state: string;
  zipCode: string;
  subscriber: string;
  subscriptionLevel: number;
  verified: boolean;
  adminAuthorized: boolean;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    passwordHash: string,
    phoneNumber: string,
    streetAddress: string,
    county: string,
    state: string,
    zipCode: string,
    subscriber: string,
    subscriptionLevel: number,
    verified: boolean,
    adminAuthorized: boolean
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.passwordHash = passwordHash;
    this.phoneNumber = phoneNumber;
    this.streetAddress = streetAddress;
    this.county = county;
    this.state = state;
    this.zipCode = zipCode;
    this.subscriber = subscriber;
    this.subscriptionLevel = subscriptionLevel;
    this.verified = verified;
    this.adminAuthorized = adminAuthorized; 
  }
}   

export class UsersController {

  static create(mySqlPool: Pool): any {

    let passwordHash: string = '';

    return async (req: any, res: any) => {
      if (req.body) {
        if (req.body.password) {
          bcrypt.hash(req.body.password, Number(process.env.SALT_ROUNDS), function(err, hash) {
            if (err) {
              console.log('Error hashing password: ', err);
              return res.status(500).send('Error hashing password');
            }
            else {
              passwordHash = hash;
            }  
          });    
        }
      }  

      const user = new User(
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        passwordHash,
        req.body.phoneNumber,
        req.body.streetAddress,
        req.body.county,
        req.body.state,
        req.body.zipCode,
        req.body.subscriber,
        req.body.subscriptionLevel,
        true,
        false
      );
        
      const sql = 'INSERT INTO Users (first_name, last_name, email, password_hash, phone_number, ' +
          'street_address, county, state, zip_code, subscriber, subscription_level, verified, ' +
          'created_at, admin_authorized VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)';
      
      const values = [
          user.firstName,
          user.lastName,
          user.email,
          user.passwordHash,
          user.phoneNumber,
          user.streetAddress, 
          user.county,
          user.state,
          user.zipCode,
          user.subscriber,
          user.subscriptionLevel,
          user.verified,
          user.adminAuthorized
        ]

        try {
          const [results, fields] = await mySqlPool.execute(sql, values);

          console.log('results: ', results);
          console.log('fields: ', fields);

          return res.send(results);
        }  
        catch(err) {
          return res.status(500).send(err);
        }    
           
  }
}

static checkEmailUniqueness(mySqlPool: Pool): any {
  return (req: any, res: any) => {
    if (req.body && req.body.email) {
    }
  }
}

static verifyEmail(mySqlPool: Pool): any {
  return (req: any, res: any) => {
    if (req.body && req.body.email) {
    }
  }
}    


/* static readById(pgSqlPool: Pool): any {
  return (req, res) => {
    if (req.params && req.params.id) {
      const id = req.params.id;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE id = $1',
        values: [id]
      };
      pgSqlPool.query(query)
      .then(result => {
        if (result && result.rows) {
          res.send(result.rows);
        }
        else {
          res.send([]);
        }
      })
      .catch(e => {
        console.error('in error');
        console.error(e.stack);
        return res.status(500).send(e);
      });
    }
    else {
      return res.status(500).send('invalid request');
    }
  }
}

static readByQuizId(pgSqlPool: Pool): any {
  return (req, res) => {
    if (req.params && req.params.quizId) {
      const quizId = req.params.quizId;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE quiz_id = $1 ORDER BY id',
        values: [quizId]
      };
      pgSqlPool.query(query)
      .then(result => {
        if (result && result.rows) {
          res.send(result.rows);
        }
        else {
          res.send([]);
        }
      })
      .catch(e => {
        console.error('in error');
        console.error(e.stack);
        return res.status(500).send(e);
      });
    }
    else {
      return res.status(500).send('invalid request');
    }
  }
}

static readByQuestionId(pgSqlPool: Pool): any {
  return (req, res) => {
    if (req.params && req.params.questionId) {
      const questionId = req.params.questionId;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE question_id = $1 ORDER BY id',
        values: [questionId]
      };
      pgSqlPool.query(query)
      .then(result => {
        if (result && result.rows) {
          res.send(result.rows);
        }
        else {
          res.send([]);
        }
      })
      .catch(e => {
        console.error('in error');
        console.error(e.stack);
        return res.status(500).send(e);
      });
    }
    else {
      return res.status(500).send('invalid request');
    }
  }
}

static readByResultId(pgSqlPool: Pool): any {
  return (req, res) => {
    if (req.params && req.params.resultId) {
      const resultId = req.params.resultId;
      const query = {
        text: 'SELECT * FROM QuizAnswers WHERE result_id = $1 ORDER BY id',
        values: [resultId]
      };
      pgSqlPool.query(query)
      .then(result => {
        if (result && result.rows) {
          res.send(result.rows);
        }
        else {
          res.send([]);
        }
      })
      .catch(e => {
        console.error('in error');
        console.error(e.stack);
        return res.status(500).send(e);
      });
    }
    else {
      return res.status(500).send('invalid request');
    }
  }
}

static update(pgSqlPool: Pool): any {
  return (req, res) => {
    if (req.body && req.params && req.params.id) {
      const answer = new Answer(
        req.body.quizId,
        req.body.questionId,
        req.body.resultId,
        req.body.answeredCorrectly,
        req.body.timeToAnswer,
        req.body.textAnswer,
        req.body.booleanAnswer,
        req.body.dateAnswer,
        req.body.dateStartAnswer,
        req.body.dateEndAnswer,
        req.body.locationAnswers,
        req.body.integerAnswer,
        req.body.integerStartAnswer,
        req.body.integerEndAnswer,
        req.body.realAnswer,
        req.body.realStartAnswer,
        req.body.realEndAnswer
      );
      const id = req.params.id;
      const query = {
        text: 'UPDATE QuizAnswers SET quiz_id = $1, question_id = $2, result_id = $3, ' +
        'answered_correctly = $4, time_to_answer = $5, text_answer = $6, boolean_answer = $7, ' +
        'date_answer = $8, date_start_answer = $9, date_end_answer = $10, location_answers = $11, ' +
        'integer_answer = $12, integer_start_answer = $13, integer_end_answer = $14, real_answer = $15, ' +
        'real_start_answer = $16, real_end_answer = $17 WHERE id = $18',
        values: [
          answer.quizId,
          answer.questionId,
          answer.resultId,
          answer.answeredCorrectly,
          answer.timeToAnswer,
          answer.textAnswer,
          answer.booleanAnswer,
          answer.dateAnswer,
          answer.dateStartAnswer,
          answer.dateEndAnswer,
          answer.locationAnswers,
          answer.integerAnswer,
          answer.integerStartAnswer,
          answer.integerEndAnswer,
          answer.realAnswer,
          answer.realStartAnswer,
          answer.realEndAnswer,
          id
        ]
      };
      pgSqlPool.query(query)
      .then(result => {
        if (result) {
          res.send(result);
        }
        else {
          res.send([]);
        }
      })
      .catch(e => {
        console.error('in error');
        console.error(e.stack);
        return res.status(500).send(e);
      });
    }
    else {
      return res.status(500).send('invalid request');
    }
  }
}

static delete(pgSqlPool: Pool): any {
  return (req, res) => {
    if (req.params && req.params.id) {
      const id = req.params.id;
      const query = {
        text: 'DELETE FROM QuizAnswers WHERE id = $1',
        values: [id]
      };
      pgSqlPool.query(query)
      .then(result => {
        if (result) {
          res.send(result);
        }
        else {
          res.send([]);
        }
      })
      .catch(e => {
        console.error('in error');
        console.error(e.stack);
        return res.status(500).send(e);
      });
    }
    else {
      return res.status(500).send('invalid request');
    }
  }
} */
} 
