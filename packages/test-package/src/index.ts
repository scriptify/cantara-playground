class Greeter {
  private username: string;
  constructor(name: string) {
    this.username = name;
  }
  public greet() {
    console.log(`Hello, ${this.username}`);
  }
}

export function greetUser(username: string) {
  const greeter = new Greeter(username);
  greeter.greet();
}
