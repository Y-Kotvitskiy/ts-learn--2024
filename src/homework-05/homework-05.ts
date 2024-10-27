// 1. Вам потрібно створити тип DeepReadonly який буде робити доступними тільки для читання навіть властивості вкладених обʼєктів.

type ReadonlyMember<T> = {
  readonly [P in keyof T]: T[P];
};

type DeepReadonly<K extends keyof any, U> = {
  [P in K]: ReadonlyMember<U>;
};

// 2. Вам потрібно створити тип DeepRequireReadonly який буде робити доступними тільки для читання навіть властивості вкладених обʼєктів та ще й робити їх обовʼязковими.

type ReadonlyRequireMember<T> = {
  readonly [P in keyof T]-?: T[P];
};

type DeepRequireReadonly<K extends keyof any, U> = {
  [P in K]: ReadonlyRequireMember<U>;
};

// 3. Вам потрібно створити тип UpperCaseKeys, який буде приводити всі ключі до верхнього регістру

type toUpperCase<T extends string> = Uppercase<T>;

type UpperCaseMember<T> = {
  [P in keyof T & string as toUpperCase<P>]: T[P];
};

type UpperCaseKeys<K extends keyof any, U> = {
  [P in K]: UpperCaseMember<U>;
};

// 4. І саме цікаве. Створіть тип ObjectToPropertyDescriptor, який перетворює звичайний обʼєкт на обʼєкт де кожне value є дескриптором.

type DescriptorMember<T> = {
  [P in keyof T]: PropertyDescriptor | undefined;
};

type DescriptorRecord<K extends keyof any, U> = {
  [P in K]: DescriptorMember<U>;
};
