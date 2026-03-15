interface User {
  name: string;
  lastName: string;
  age: number;
  isAdmin: boolean;
}

const user: User = {
  name: "Gustavo",
  lastName: "Bodziak",
  age: 22,
  isAdmin: true,
};

console.log(`Hello world ${user.name}!`);
