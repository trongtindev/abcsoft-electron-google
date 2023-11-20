import { ApiService } from '@/modules/api/api.service';
import { Injectable } from '@nestjs/common';
import logger from 'electron-log';
import { IGenerationTextParams, IGenerationTextResult } from './generative.interface';

@Injectable()
export class GoogleGenerativeService {
	private logger = logger.scope(GoogleGenerativeService.name);
	constructor(private apiService: ApiService) {}

	async text(params: IGenerationTextParams): Promise<IGenerationTextResult> {
		const result = await this.apiService.api.post<IGenerationTextResult>(
			'services/google/generative/text',
			{
				prompt: params.prompt,
				model: params.model,
				topP: params.topP,
				topK: params.topK,
				temperature: params.temperature,
			}
		);
		return result.data;
	}

	async textModels() {
		const result = await this.apiService.api.get<{
			items: {
				id: string;
				description: string;
			}[];
		}>('services/google/generative/text/models');
		return result.data;
	}
}
