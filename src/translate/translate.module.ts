import { Module } from '@nestjs/common';
import { GoogleTranslateService } from './translate.service';

@Module({
	providers: [GoogleTranslateService],
	exports: [GoogleTranslateService],
})
export class GoogleTranslateModule {}
