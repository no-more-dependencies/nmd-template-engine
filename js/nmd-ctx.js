import NmdContext from "./nmd-context";

/**
 * Helpers for shorter code in attributes.
 * @param {HTMLElement} element reference element for the context search
 * @param {string?} name name of the variable to return, "this" if this parameter is undefined
 * @returns {*} value for context variable based on name attribute
 */
export default function NmdCtx(element, name = undefined){
	let scope = NmdContext.find(element).getScope();
	if(name)
		return scope[1][name];
	return scope[0];
}

/**
 * Get context value and update root context later after browser gains control.
 * @param {HTMLElement} element reference element for the context search
 * @param {string?} name name of the variable to return, "this" if this parameter is undefined
 * @returns {*} value for context variable based on name attribute
 */
NmdCtx.u = function(element, name = undefined){
	/** @type {NmdContext} */
	let rootContext = element.closest("nmd-context:not(nmd-context nmd-context)");
	setTimeout(() => rootContext.update());
	return this(element, name);
}