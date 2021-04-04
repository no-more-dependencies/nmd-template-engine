export default
function evaluateCode(code, scope, expectsReturn){
	// TODO: Consider this: Function(...Object.keys(scope), "console.log(a,b);")(...Object.values(scope))
	if(expectsReturn)
		code = "return " + code;
	return Function(code).bind(scope)();
}