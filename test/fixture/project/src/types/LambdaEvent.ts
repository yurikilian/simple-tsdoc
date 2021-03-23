export default interface LambdaEvent {
  name: string;
  age: number;
  product: LambdaProduct;

  categories: Array<string>;
}

export interface LambdaProduct {
  category: string;
}
