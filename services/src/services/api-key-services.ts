import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { count, eq } from "drizzle-orm";
import { DRIZZLE_DB } from "src/database/database.module";
import { api_key } from "src/database/schema";
import { randomBytes } from "crypto";
import * as crypto from "crypto";
import  argon2  from "argon2";


@Injectable()
export class ApiKeyService {
    constructor(
        @Inject(DRIZZLE_DB) private readonly db:any,
    ){}

    private generateKey(): { plaintextKey:string, keyId: string} {
        //create key Id
        const keyId =  crypto.randomUUID().replace(/-/g, "");
        const secret = randomBytes(32).toString("base64url");
        const plaintextKey = `VMX_${keyId}_${secret}`;
        return {plaintextKey, keyId};
    }

    async createApiKey(userId: string) {
        //Enforce max 5 keys limit
        const [result] = await this.db.select({ count: count() }).from(api_key).where(eq(api_key.user_id, userId));

        if(result.count >= 5){
            throw new BadRequestException("Max 5 API keys allowed per user")
        }

        const {plaintextKey, keyId} = this.generateKey()

        const hash = await argon2.hash(plaintextKey, {
                type: argon2.argon2id,
                timeCost: 3,
                memoryCost: 1 << 16,
                parallelism: 1
            }
        );

        const prefix = plaintextKey.substring(0,18) + "..."

        await this.db.insert(api_key).values({
            id: keyId,
            user_id: userId,
            name: name,
            value:hash,
            prefix,
        })

        return {key: plaintextKey}

        
    }

    async listApiKeys(userId: string) {

    }

    async deleteApiKey(userId: string) {
        
    }

    async regenerateApiKey(userId: string, id: string) {
        
    }
}