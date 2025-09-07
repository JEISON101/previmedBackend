import {Client} from 'pg';
import dns from "dns";

export const client = new Client({
    port:Number(process.env.DB_PORT), //parseo a number y no genere error
    user:process.env.DB_MOTOR,
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    password:process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
    lookup: (hostname:any, callback:any) => {
    dns.lookup(hostname, { family: 4 }, callback) // fuerza IPv4
  }
}as any)
client.connect();