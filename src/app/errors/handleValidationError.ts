import { Prisma } from '@prisma/client';

export const handleValidationError = (error: Prisma.PrismaClientValidationError) => {
  const message = error.message
    .split('\n')
    .find(line => line.trim().startsWith('Argument'))
    ?.replace('Argument', 'Missing field')
    ?.replace(':', '')
    ?.trim() || 'Invalid data provided to Prisma client.';

  return {
    statusCode: 400,
    message: 'Validation Error',
    error: message,
  };
};
