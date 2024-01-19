import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();

    // Inserts seed entries
    await knex("users").insert([
        {id: 1, email: 'a', password: 'b'},
        {id: 2, email: 'a', password: 'b'},
        {id: 3, email: 'a', password: 'b'},
    ]);
};
