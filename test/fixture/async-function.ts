interface FunctionResponse {
  name: string;
}

interface FunctionInput {
  name: string;
}

async function asyncHandler(input: FunctionInput): Promise<FunctionResponse> {
  return {
    name: 'ok'
  };
}
