import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {

  const PORT = process.env.APP_PORT ? Number(process.env.APP_PORT) : 4000
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    forbidNonWhitelisted: true,
    whitelist: true,
    exceptionFactory(errors) {
        let errorMsg = ""
        errors.forEach((err) => {
          errorMsg += `${Object.values(err.constraints as object).join(',')}, `;
        })
        throw new BadRequestException(errorMsg)
    },
  }))
  await app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
  });
}
bootstrap();
