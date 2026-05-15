class User /* extends UsersModel */ {}

  constructor(
    reqQuizId: number,
    reqQuestionId: number,
    reqResultId: number,
    reqAnsweredCorrectly: boolean,
    reqTimeToAnswer: string,
    reqTextAnswer: string,
    reqBooleanAnswer: boolean,
    reqDateAnswer: Date,
    reqDateStartAnswer: Date,
    reqDateEndAnswer: Date,
    reqLocationAnswers: [object],
    reqIntegerAnswer: number,
    reqIntegerStartAnswer: number,
    reqIntegerEndAnswer: number,
    reqRealAnswer: number,
    reqRealStartAnswer: number,
    reqRealEndAnswer: number
  ) {
    super();

    this.quizId = reqQuizId;
    this.questionId = reqQuestionId;
    this.resultId = reqResultId;
    this.answeredCorrectly = reqAnsweredCorrectly;
    this.timeToAnswer = reqTimeToAnswer;
    this.textAnswer = reqTextAnswer;
    this.booleanAnswer = reqBooleanAnswer;
    this.dateAnswer = reqDateAnswer;
    this.dateStartAnswer = reqDateStartAnswer;
    this.dateEndAnswer = reqDateEndAnswer;
    this.locationAnswers = reqLocationAnswers;
    this.integerAnswer = reqIntegerAnswer;
    this.integerStartAnswer = reqIntegerStartAnswer;
    this.integerEndAnswer = reqIntegerEndAnswer;
    this.realAnswer =  reqRealAnswer;
    this.realStartAnswer =  reqRealStartAnswer;
    this.realEndAnswer =  reqRealEndAnswer;
  }
}

export class UsersController {

  static create(pgSqlPool: Pool): any {
    return (req, res) => {
      if (req.body) {
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
        const query = {
          text: 'INSERT INTO QuizAnswers(quiz_id, question_id, result_id, answered_correctly, time_to_answer, ' +
            'text_answer, boolean_answer, date_answer, date_start_answer, date_end_answer, location_answers, ' +
            'integer_answer, integer_start_answer, integer_end_answer, real_answer, real_start_answer, ' +
            'real_end_answer) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)',
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
            answer.realEndAnswer
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

  static readById(pgSqlPool: Pool): any {
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
  }
} */
