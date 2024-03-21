import { Authentication } from '@nestjs-cognito/auth';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { SettingsService } from './settings.service';
import { CreateCompanyDTO } from '@app/common/dto/settings/CreateCompany.dto';
import { UpdateCompanyDTO } from '@app/common/dto/settings/UpdateCompany.dto';
import { Response } from 'express'; // Import Response from Express

@Controller()
@ApiTags('Settings')
@ApiBearerAuth()
@Authentication()
// @Authorization({ allowedGroups: [IUserRole.ADMIN] })
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post('/')
  async create(
    @Body() createCompanyDto: CreateCompanyDTO,
    @Res() res: Response
  ) {
    const newCompany = await this.settingsService.create(createCompanyDto);
    return res.status(201).json(newCompany); // Explicitly returning JSON response with status code
  }

  @Get('/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    const company = await this.settingsService.findOne(+id);
    return res.status(200).json(company); // Explicitly returning JSON response
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDTO,
    @Res() res: Response
  ) {
    const updatedCompany = await this.settingsService.update(
      +id,
      updateCompanyDto
    );
    return res.json(updatedCompany); 
  }

  @Delete('/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.settingsService.delete(+id);
    return res.status(204).send(); // Explicitly sending a response without content
  }
}
