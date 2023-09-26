export type FirstArgument<T> = T extends (arg1: infer U, ...args: any[]) => any
  ? U
  : any;

export type SecondArgument<T> = T extends (
  arg1: any,
  arg2: infer U,
  ...args: any[]
) => any
  ? U
  : any;

export type ThirdArgument<T> = T extends (
  arg1: any,
  arg2: any,
  arg3: infer U,
  ...args: any[]
) => any
  ? U
  : any;

export interface GenericElementFn<Type extends (...args: any) => any> {
  (arg?: SecondArgument<Type>): ReturnType<Type>;
}
