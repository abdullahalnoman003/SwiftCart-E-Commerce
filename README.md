### 1) What is the difference between `null` and `undefined`?

#### Answer: 
Null means it is kept null intentionally by developer to keep the value empty. on the otherhand undefined means, a variable is declared but its value is not set. undefined is set by JavaScript to identify that there is no value.
Both means empty one is from developer and one is form JavaScript

### 2) What is the use of the `map()` function in JavaScript? How is it different from `forEach()`?

#### Answer: 
map() function is used in array to transform an array, it is always returns a new array or transformed array, we use it only when we need to transform an array.
forEach() is used just to loop through the array, it doesn't return any array, it returns undefined.

### 3) What is the difference between `==` and `===`?
#### Answer: 
The difference between == and === is,
=== checks value and type and doesnot performes any type conversion. on the otherhand == checks only the value, it performs type conversion like 5 == "5" it will return true.

### 4) What is the significance of `async`/`await` in fetching API data?

#### Answer: 
The significance of async await is very crucial in JavaScript.
when we want to fetch data from an API, it may take time to load. async await makes the code run smoothly without waiting for response to load. it helps us to write asynchronous code like normal code. it returns a promise whether the req will be solved or rejected.

### 5) Explain the concept of Scope in JavaScript (Global, Function, Block).

#### Answer: 
Scope in JavaScript means variables are accessible from where. like if we declare a variable in the top of a code then it will be accessible in the whole code, but if it is declared in a function then only that function can use that variable.  