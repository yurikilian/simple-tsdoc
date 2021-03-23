interface FunctionResponse {
  name: string;
}

interface FunctionInput {
  name: string;
}

/**
 * My Async Handler
 * another line of summary
 *
 * @remarks
 * This is a remark (observation) comment
 * another line of remark
 *
 * @param input - the function input
 * @returns A Promise with the Function Response
 *
 * @LambdaFunction
 */
async function asyncHandler(input: FunctionInput): Promise<FunctionResponse> {
  console.log(input);
  return {
    name: 'ok'
  };
}
