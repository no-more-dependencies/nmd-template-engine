/**
 * 
 * @param {string} code 
 * @param {[any,Object]} scope 
 * @param {*} expectsReturn 
 */
export default
function evaluateCode(code, scope, expectsReturn){
	// TODO: Consider this: Function(...Object.keys(scope), "console.log(a,b);")(...Object.values(scope))
	if(expectsReturn)
		code = "return " + code;
	return Function(...Object.keys(scope[1]), code).bind(scope[0])(...Object.values(scope[1]));
}