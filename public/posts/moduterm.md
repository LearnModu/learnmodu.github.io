# Make your own Terminal (with Modu v0.5.0!)
Image: ./banners/blank.png
ID: 3
Date: 2025-01-04
Author: paintdev (404PageN0tFound)

Modu is in all respects a **beginner** programming language, so how would we make a Terminal? Luckily you've found this tutorial, and I'll explain step-by-step in how to make your own Terminal.
**You need Modu installed to follow this tutorial. Using the Web IDE won't work. Click [here](https://learnmodu.org/post.html?id=2) to view a tutorial stating how to install Modu.**

## Let's start!
Okay, firstly, we need to import os and we need to add a variable containing input.
```rs
import "os" as os;
let cmd = input("LearnModu Terminal, Enter a command:\n")
```
Now, when we run this code, it should ask for what command you want, and you can type anything, but nothing will happen. Let's fix that.
Expanding onto our code, let's add an os.exec to actually make this work.
```rs
import "os" as os;
let cmd = input("LearnModu Terminal, Enter a command:\n")
os.exec(cmd)
```
Now, when we run this code, it'll ask for input, and after execute the given command!
This is quite basic, but you can edit this to your liking!

\
Thanks for reading!
