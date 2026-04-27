import { DocumentBuilder } from '@nestjs/swagger';

const port = process.env.PORT ?? 3000;

export const configSwagger = new DocumentBuilder()
  .setTitle('Sistema de Ventas')
  .setDescription('API REST para el sistema de ventas')
  .setVersion('1.0')
  .addServer(`http://localhost:${port}`)
  .setContact(
    'Jesus Francisco Cortez Torres',
    'https://rito-torri-mi-portfolio.netlify.app/',
    'cortezfrancisco025@gmail.com',
  )
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Ingresa tu token JWT',
      in: 'header',
    },
    'access-token', // Este es el nombre interno de la estrategia
  )
  .build();
