export interface MyInterface {
  name: string;
  age: number;
  isActive: boolean;
  principal: MyInterfaceChild;
  children: Array<MyInterfaceChild>;
  ok: Mirabolancia<string>;
  map: Map<string, MyInterfaceChild>;
}

interface MyInterfaceChild {
  name: string;
}

interface Mirabolancia<T> {
  value: T;
}
