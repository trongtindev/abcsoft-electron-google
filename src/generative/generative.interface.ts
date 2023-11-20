export enum GoogleGenerativeEventEnum {
	generationText = 'google:ai.generationText',
	generationTextModels = 'google:ai.generationTextModels',
}

export interface IGenerationTextParams {
	model: string;
	topP: number;
	topK: number;
	temperature: number;
	prompt: string;
}

export interface IGenerationTextResult {
	items: {
		content: string;
	}[];
}
