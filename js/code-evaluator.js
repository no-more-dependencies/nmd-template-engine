/**
 * Evaluates code with additional variables and "this" context.
 * @param {string} code 
 * @param {[any, Object]} scope first item is value for "this", second contains other variables where property name is variable name.
 * @param {boolean} expectsReturn if true, evaluates as expression and returns value;
 */
export default
function evaluateCode(code, scope, expectsReturn = false){
	if(expectsReturn)
		code = "return " + code;
	return Function(...Object.keys(scope[1]), code).bind(scope[0])(...Object.values(scope[1]));
}