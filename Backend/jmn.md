❌ Bad Code:
```javascript
function sum(){return a+b;}
```

🔍 Issues:
*   ❌ Missing input parameters.
*   ❌ `a` and `b` are not defined within the function scope.

✅ Recommended Fix:

```javascript
function sum(a, b) {
  return a + b;
}
```

💡 Improvements:
*   ✔ Takes `a` and `b` as parameters.
*   ✔ Returns the sum of `a` and `b`.
