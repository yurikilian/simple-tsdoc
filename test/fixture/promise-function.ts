interface FunctionResponse {
  name: string;
}

interface FunctionInput {
  name: string;
}

function handler(input: FunctionInput): Promise<FunctionResponse> {
  return new Promise<FunctionResponse>((resolve) => {
    return resolve({
      name: 'ok'
    });
  });
}
