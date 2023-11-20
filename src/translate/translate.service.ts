import { ApiService } from '@/modules/api/api.service';
import { Injectable } from '@nestjs/common';
import { IGoogleTranslateResult } from './translate.interface';

@Injectable()
export class GoogleTranslateService {
	constructor(private apiService: ApiService) {}

	async translate(params: {
		contents: string[];
		targetLanguageCode: string;
		sourceLanguageCode?: string;
	}) {
		const result = await this.apiService.api.post<IGoogleTranslateResult>(
			'services/google/translate',
			params
		);
		return result.data;
	}
}
