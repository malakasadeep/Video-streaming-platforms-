import { Module, Global } from '@nestjs/common';
import {Pool, neonConfig} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import * as schema from './schema';

export const DRIZZLE_DB = "DRIZZLE_DB";

neonConfig.webSocketConstructor = ws;

@Global()
@Module({
    providers:[
        {
            provide: DRIZZLE_DB,
            useFactory: () => {
                const connectionString = process.env.DATABASE_URL;
                if (!connectionString) {
                    throw new Error('DATABASE_URL environment variable is not set');
                }
                const pool = new Pool({ connectionString });
                return drizzle(pool, { schema: schema });
            }
        }
    ],
    exports: [DRIZZLE_DB]
})

export class DatabaseModule {}
