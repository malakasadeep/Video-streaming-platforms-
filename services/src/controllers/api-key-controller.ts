import { Controller, Get, Post, Body, Param, Delete, Req, UseGuards } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { ApiKeyService } from "src/services/api-key-services";


@Controller("api-keys")
@ApiTags("api-keys")
@ApiBearerAuth()    
export class ApiKeyController {
    constructor(private readonly apiKeyService: ApiKeyService) {}

    @Post()
    @ApiOperation({summary: "Create a new API key"})
    async createApiKey(@Req() req: any) {
        return this.apiKeyService.createApiKey(req.user.id );
    }

    @Get()
    @ApiOperation({summary: "List all API keys"})
    async listApiKeys(@Req() req: any) {
        return this.apiKeyService.listApiKeys(req.user.id);
    }

    @Delete(":id")
    @ApiOperation({summary: "Revoke/Delete an API key"})
    async deleteApiKey(@Req() req: any) {
        return this.apiKeyService.deleteApiKey(req.user.id);
    }

    @Post(":id/regenerate")
    @ApiOperation({summary: "Regenerate an API key"})
    async regenerateApiKey(@Req() req: any, @Param("id") id: string) {
        return this.apiKeyService.regenerateApiKey(req.user.id, id);
    }
    
}