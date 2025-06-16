import {Client} from 'pg';

export const client = new Client({
    port:process.env.DB_PORT,
    user:process.env.DB_MOTOR,
    host:process.env.HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD
})
client.connect();