import LambdaResponse from './types/LambdaResponse';
import LambdaEvent from './types/LambdaEvent';

export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  return new Promise((resolve) => {
    resolve({
      message: 'Hello world for ' + event.name
    });
  });
}
