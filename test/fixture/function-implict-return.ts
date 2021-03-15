interface Input {
  name: string;
}

function utilImplicitReturn(input: Input) {
  console.log(`My name is ${input.name}`);

  return {
    name: 'ok'
  };
}
