declare module 'lib/prisma' {
  declare let global: typeof globalThis & { prisma: any };
  interface IWed {
    name: string;
    age: string;
  }
}
// declare namespace prisma {
//   declare let global: typeof globalThis & { prisma: any };
//   interface IWed {
//     name: string;
//     age: string;
//   }
// }
// node_modules/@types/node/globals.global.d.ts
