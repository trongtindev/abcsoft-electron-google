import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { GoogleGenerativeEventEnum, IGenerationTextParams } from './generative.interface';
import { GoogleGenerativeService } from './generative.service';
import { AxiosError } from 'axios';

@Injectable()
export class GoogleGenerativeEvents {
	constructor(private googleAiService: GoogleGenerativeService) {}

	@OnEvent(GoogleGenerativeEventEnum.generationText)
	async onGenerationText(
		data: IGenerationTextParams,
		callback: (result: any, error?: any) => void
	) {
		this.googleAiService
			.text(data)
			.then((result) => {
				if (callback) callback(result);
			})
			.catch((error: any | AxiosError) => {
				if (error instanceof AxiosError) {
					return callback(null, error.response.data.message ?? error.response.data.toString());
				}
				callback(null, error);
			});
	}

	@OnEvent(GoogleGenerativeEventEnum.generationTextModels)
	async onGenerationTextModels(data: any, callback?: (result: any, error?: any) => void) {
		const result = await this.googleAiService.textModels();
		if (callback) callback(result);
	}
}
