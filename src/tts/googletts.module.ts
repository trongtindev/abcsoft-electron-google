import { Module } from '@nestjs/common';
import { GooglettsService } from './googletts.service';
import { FfmpegModule } from '../../../ffmpeg/src/ffmpeg.module';

@Module({
	imports: [FfmpegModule],
	providers: [GooglettsService],
	exports: [GooglettsService],
})
export class GooglettsModule {}
