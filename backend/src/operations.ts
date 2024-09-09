import { HandlerContext, TransactionContext, Transaction, GetApi, PostApi, DeleteApi, ArgSource, ArgSources } from '@dbos-inc/dbos-sdk';
import { Knex } from 'knex';

// Define the interface for Question and Level
interface Question {
  title: string;
  text: string;
  details: {
    questionText: string;
    options: string[];
    correctOption: string;
  };
}

interface Level {
  id?: number;
  level: number;
  questions: Question[];
}

export class LevelOperations {

  // Create the 'levels' table if it doesn't exist
  @Transaction()
  static async createLevelsTable(ctxt: TransactionContext<Knex>) {
    const tableExists = await ctxt.client.schema.hasTable('levels');
    
    if (!tableExists) {
      await ctxt.client.schema.createTable('levels', (table) => {
        table.increments('id').primary();
        table.integer('level').notNullable();
        table.jsonb('questions').defaultTo('[]');  // Store questions as JSON
      });
      ctxt.logger.info('Table "levels" created successfully');
    } else {
      ctxt.logger.info('Table "levels" already exists');
    }
  }

  // API Endpoint to get all levels
  @GetApi('/levels')
  @Transaction({ readOnly: true })
  static async getAllLevels(ctxt: TransactionContext<Knex>) {
    const levels = await ctxt.client<Level>('levels').select('*');
    return levels;
  }

  // API Endpoint to create a new level
  @PostApi('/levels')
  @Transaction()
  static async createLevel(ctxt: TransactionContext<Knex>, @ArgSource(ArgSources.BODY) levelData: Level) {
    const [level] = await ctxt.client('levels').insert(levelData).returning('*'); // Returning the inserted row
    ctxt.logger.info(`Level ${levelData.level} created in the database!`);
    return level;
  }

  // API Endpoint to add a question to a level
  @PostApi('/levels/:levelId/questions')
  @Transaction()
  static async addQuestionToLevel(
    ctxt: TransactionContext<Knex>, 
    @ArgSource(ArgSources.URL) levelId: number,
    @ArgSource(ArgSources.BODY) question: Question
  ) {
    const level = await ctxt.client<Level>('levels').where('id', levelId).first();
    if (!level) throw new Error(`Level ${levelId} not found`);

    const updatedQuestions = [...level.questions, question];
    await ctxt.client('levels').where('id', levelId).update({ questions: updatedQuestions });
    ctxt.logger.info(`Question added to Level ${levelId}`);
    return question;
  }

  // API Endpoint to delete a level
  @DeleteApi('/levels/:levelId')
  @Transaction()
  static async deleteLevel(ctxt: TransactionContext<Knex>, @ArgSource(ArgSources.URL) levelId: number) {
    await ctxt.client('levels').where('id', levelId).delete();
    ctxt.logger.info(`Level ${levelId} deleted from the database.`);
    return `Level ${levelId} deleted successfully!`;
  }

  // API Endpoint to delete a question in a level
  @DeleteApi('/levels/:levelId/questions/:questionId')
  @Transaction()
  static async deleteQuestion(
    ctxt: TransactionContext<Knex>, 
    @ArgSource(ArgSources.URL) levelId: number, 
    @ArgSource(ArgSources.URL) questionId: number
  ) {
    const level = await ctxt.client<Level>('levels').where('id', levelId).first();
    if (!level) throw new Error(`Level ${levelId} not found`);
    if (!level.questions[questionId]) throw new Error(`Question ${questionId} not found in Level ${levelId}`);

    const updatedQuestions = level.questions.filter((_, index) => index !== questionId);
    await ctxt.client('levels').where('id', levelId).update({ questions: updatedQuestions });
    ctxt.logger.info(`Question ${questionId} deleted from Level ${levelId}`);
    return `Question ${questionId} deleted successfully!`;
  }

  // API Endpoint to update a question in a level
  @PostApi('/levels/:levelId/questions/:questionId')
  @Transaction()
  static async updateQuestion(
    ctxt: TransactionContext<Knex>, 
    @ArgSource(ArgSources.URL) levelId: number, 
    @ArgSource(ArgSources.URL) questionId: number,
    @ArgSource(ArgSources.BODY) questionUpdate: Partial<Question>
  ) {
    const level = await ctxt.client<Level>('levels').where('id', levelId).first();
    if (!level) throw new Error(`Level ${levelId} not found`);

    if (!level.questions[questionId]) throw new Error(`Question ${questionId} not found in Level ${levelId}`);

    const updatedQuestions = level.questions.map((q, index) =>
      index === questionId ? { ...q, ...questionUpdate } : q
    );

    await ctxt.client('levels').where('id', levelId).update({ questions: updatedQuestions });
    ctxt.logger.info(`Question ${questionId} in Level ${levelId} updated successfully.`);
    return updatedQuestions[questionId];
  }
}
