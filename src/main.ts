import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);
	const logger = new Logger('START SERVER');

	// Swagger конфигурация
	const swaggerConfig = new DocumentBuilder()
		.setTitle('telegram example')
		.setDescription('The telegram API description')
		.setVersion('1.0')
		.addTag('Finova Bot telegram')
		.build();
	const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('swagger', app, swaggerDocument);

	// Получаем порт из env (ConfigService)
	const port = configService.getOrThrow<number>('HTTP_PORT');
	try {
		await app.listen(port);
		logger.log(`🚀 Server running on http://localhost:${port}`);
		logger.log(
			`📄 Swagger docs available at http://localhost:${port}/swagger`,
		);
	} catch (e) {
		logger.error(e);
		process.exit(1);
	}
}

bootstrap();
