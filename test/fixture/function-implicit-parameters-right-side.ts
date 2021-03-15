interface FunctionResponse {
  name: string;
}

function utilWrongBoth(input: { name: string }): FunctionResponse {
  console.log(`My name is ${input.name}`);

  return {
    name: 'ok'
  };
}
