import LambdaResponse from './types/LambdaResponse';
import LambdaEvent from './types/LambdaEvent';

interface LambdaContext {
  jobExecutionId: number;
}

/**
 * My lambda handler
 *
 * @remarks
 * This method handles the AWS lambda event received from a SQS
 *
 * @param event - The lambda input
 * @param context - The execution context from lambda
 * @returns The lambda response having all events
 *
 * @LambdaFunction
 */
export async function handler(
  event: LambdaEvent,
  context: LambdaContext
): Promise<LambdaResponse> {
  return new Promise((resolve) => {
    resolve({
      message: 'Hello world for ' + event.name + context.jobExecutionId
    });
  });
}
