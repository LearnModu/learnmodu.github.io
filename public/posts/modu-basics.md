# Learn the basics of Modu in a single post
Image: ./banners/modu-basics.png
ID: 2
Date: 2025-01-04
Author: aquiffoo

Modu is a relatively new programming language developed by [Cyteon](https://cyteon.tech/modu). It debuted in December 11, 2024 and instantly received love from the community, for its simplicity and constant updates. Nowadays, there are whole Discord cults related to it! I created one of them myself, to show my love to the language. Today, I'm going to guide you, a begginer on Modu, on your journey - Here you will learn the basics to become the CHAD Modu User.

## Install Modu first
Here you could take two different paths:

### 1. Through Cargo
1. First, i'd recommend you [install Rust](https://www.rust-lang.org/tools/install) (it's what Modu was made with and comes with Cargo, the main source for installing it)
2. Check if cargo is installed by running `cargo --version`:\
![In my case, it is.](./public/posts/assets/screenshot-cargo-version.png)
3. Now that you have cargo up and running, run `cargo +nightly install modu` to get Modu installed on your machine.
4. Check if it's up and running with `modu`
Obs. IF YOU ARE USING VSCODE, you can download the [extension on GitHub](https://github.com/Cyteon/modu/blob/main/extensions/vscode/modu-lang-0.0.1.vsix)

### 2. Through the Binaries
By doing this approach, Rust is not necessary. However, to update it, you have to download new binaries every time.
1. [Download the latest Modu binaries on GitHub actions](https://github.com/Cyteon/modu/actions/workflows/rust.yml)
2. Put it on your PATH environment variable
3. Check if it's up and running with `modu`

## Input/Output
Modu's syntax was designed for being simple, reliable and keeping you focused on writing code, instead of arguing with your compiler. (i'm looking at you, Rust!)\
To make a simple Hello World program, you don't even need a main function, like in Go or Kotlin:
```rust
// this is a comment, the interpreter does not treat them as code
print("Hello, World!"); //semicolons are optional too fyi!
```
This program just shows the string `Hello, World!` on the console, nothing much. Let's take it to the next level!
```rs
let string = input("Print something: ")
print(string)
```
Now, the program is taking an input from the user, adding interaction to it. Inputs are taken as strings.

## Variables and types
In Modu, we have variables, that we can assign values to, to keep them in memory whenever we need to get them again.
```rs
let string = "this is text"
let integer = 34
let anotherInt = integer + 35
let decimal = 8.1
let boolean = true
let anotherBoolean = 3 != 1 + 2 //false
```
Declare and modify variables using the `let` keyword in front of the variable's name, then `=` and a value. The interpreter will assign the type of the variable by itself with no hassle.

## If statements
You can check if a condition is true using `if` statements. Start with `if`, then a boolean condition, like `3 == 1 + 2` or `4 != 2 * 2`
```rust
let a = 3;
let b = 4;

if a == b {
    print("a (", a, ") and b (", b, ") are equal!")
} if a !== b {
    print("a (", a, ") and b (", b, ") are not equal!")    
}

// the program above prints "a (3) and b (4) are not equal!"
```
Notice that we also used concatenation on the `print` function, that supports multiple args, separating statements by commas, to put them together.

## Custom Functions
You can declare functions, blocks of code that can be called repeatedly to run a specific action, using the `fn` keyword.
```rust
fn wave(person) {
    print("Hello, ", person, "!")
}

let name = input("What is your name? ");
wave(name); //says "Hello, [User Input]"
```
The function `wave()` does a specific action, use the console to greet the user, in this case.

## Import statements
You can import libraries to Modu to increase its functionality. You use the `import` statement on the top of your program to include the lib's functions and variables:
```rust
import "math" as m
import "os" as os
import "file" as * //does not require calling library "file" for accessing its functions
```
Current libraries include:
- math: Includes functions like `div`, `mul`, `abs`, `random_int`, `random`, `floor`, `ceil`, `sqrt` and `pow`, and constants like `PI`
- file: Includes the `read` and `write` functions for managing external files.
- os: Lets you run commands with `exec` and check your os with `name`.

### You can import your own files too
We can create a file `something.modu` and import it to another, `main.modu`.\
something.modu:
```rust
import "os" as os;

fn doSomething() {
    print("doing something...")
}

fn mkdir(dirname) {
    os.exec("mkdir " + dirname); //you can concatenate 2 STRINGS with + on functions that don't have infinite args
    let pwd = os.exec("pwd");
    print("directory ", dirname, " created on ", pwd, ".");
}
```
main.modu:
```rust
import "something.modu" as sm;

let dir = input("Create a dir called: ");
doSomething();
mkdir(dir);
```

### Modu Packages
You can also post packages for other people to use with Modu Packages. Soon there'll be a post dedicated to it.

## Conclusion
Well, that's it! I've teached you all the basics about Modu. Share this to anyone who insterested in learning this amazing programming language.\
\
Peace!
