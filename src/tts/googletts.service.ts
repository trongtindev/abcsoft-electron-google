import { Injectable } from '@nestjs/common';
import { ApiService } from '@/modules/api/api.service';
import logger from 'electron-log';
import { FfmpegService } from '../../../ffmpeg/src/ffmpeg.service';
import fs from 'fs';
import path from 'path';
import * as uuid from 'uuid';
import { app } from 'electron';

@Injectable()
export class GooglettsService {
	private logger = logger.scope(GooglettsService.name);
	private prefixUrl = 'services/google/tts';

	constructor(
		private apiService: ApiService,
		private ffmpegService: FfmpegService
	) {}

	async getLanguages() {
		const result = await this.apiService.api.get<{
			total: number;
			items: any[];
		}>(`${this.prefixUrl}/languages`);
		return result.data;
	}

	async getVoices(params: { languageCode: string }) {
		const result = await this.apiService.api.get<{
			total: number;
			items: any[];
		}>(`${this.prefixUrl}/voices`, {
			params: params,
		});
		return result.data;
	}

	async generate(params: {
		text: string;
		voice: {
			name: string;
			languageCode: string;
			ssmlGender: string;
		};
		audioConfig: {
			speakingRate: number;
			pitch: number;
			volumeGainDb: number;
		};
		audioConfig2?: {
			speakingRate?: number;
			pitch?: number;
			volumeGainDb?: number;
			sampleRateHertz?: number;
		};
	}): Promise<string> {
		const result = await this.apiService.api.post<{ audioContent: string }>(this.prefixUrl, {
			text: params.text,
			voice: params.voice,
			audioConfig: params.audioConfig,
		});

		if (
			params.audioConfig2 &&
			(params.audioConfig2.pitch ||
				params.audioConfig2.speakingRate ||
				params.audioConfig2.volumeGainDb)
		) {
			params.audioConfig2.sampleRateHertz ??= 44100;

			const input = path.resolve(app.getPath('sessionData'), `${uuid.v4()}.mp3`);
			const output = path.resolve(app.getPath('sessionData'), `${uuid.v4()}_output.mp3`);
			fs.writeFileSync(input, Buffer.from(result.data.audioContent, 'base64'), 'binary');

			const pitch = params.audioConfig2.pitch ?? '1.0';
			const speed = params.audioConfig2.speakingRate ?? '1.0';
			const volume = params.audioConfig2.volumeGainDb ?? '1.0';
			const aresample = params.audioConfig2.sampleRateHertz;
			const command = `-i "${input}" -filter_complex "[0:a]volume=${volume}[aa];[aa]asetrate=${aresample}*${pitch}[bb];[bb]atempo=${speed}[cc]" -b:a 256k -ar ${aresample} -map "[cc]" "${output}"`;
			await this.ffmpegService.exec(`ffmpeg -hide_banner ${command}`);

			fs.unlinkSync(input);
			if (fs.existsSync(output)) {
				// update content
				result.data.audioContent = Buffer.from(fs.readFileSync(output)).toString('base64');

				// delete temp file
				fs.unlinkSync(output);
			} else {
				this.logger.warn(`file ${output} not found!`);
			}
		}

		return result.data.audioContent;
	}
}
