import { Test, TestingModule } from '@nestjs/testing';
import { SettingsController } from './settings.controller';
import { SettingsService } from './settings.service';

describe('SettingsController', () => {
  let settingsController: SettingsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SettingsController],
      providers: [SettingsService],
    }).compile();

    settingsController = app.get<SettingsController>(SettingsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(settingsController.getHello()).toBe('Hello World!');
    });
  });
});
