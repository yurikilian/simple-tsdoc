interface FunctionResponse {
  name: string;
}

interface FunctionInput {
  name: string;
}

function utilCorrect(input: FunctionInput): FunctionResponse {
  console.log(`My name is ${input.name}`);

  return {
    name: 'ok'
  };
}
