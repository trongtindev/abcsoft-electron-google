export interface IGoogleTranslateResult {
	total: number;
	items: {
		translatedText: string;
		detectedLanguageCode: string;
	}[];
}
