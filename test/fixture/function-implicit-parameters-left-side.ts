interface FunctionResponse {
  name: string;
}

interface FunctionInput {
  name: string;
}

function utilWithImplicitParameters({ name }: FunctionInput): FunctionResponse {
  console.log(`My name is ${name}`);

  return {
    name: 'ok'
  };
}
