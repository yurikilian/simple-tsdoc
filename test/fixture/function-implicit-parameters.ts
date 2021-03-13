interface FunctionResponse {
  name: string;
}

function utilWithImplicitParameters({
  name
}: {
  name: string;
}): FunctionResponse {
  console.log(`My name is ${name}`);

  return {
    name: 'ok'
  };
}
