export async function up(knex) {
    return knex.schema.createTable('levels', table => {
      table.increments('id').primary();  // Primary key
      table.integer('level').notNullable();  // Level number
      table.jsonb('questions').defaultTo('[]');  // Store questions as JSON array
    });
  }
  
  export async function down(knex) {
    return knex.schema.dropTable('levels');  // Rollback
  }
  