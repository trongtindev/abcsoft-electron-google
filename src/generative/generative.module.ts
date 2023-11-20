import { Module } from '@nestjs/common';
import { GoogleGenerativeService } from './generative.service';
import { GoogleGenerativeEvents } from './generative.events';

@Module({
	providers: [GoogleGenerativeService, GoogleGenerativeEvents],
	exports: [GoogleGenerativeService],
})
export class GoogleGenerativeModule {}
