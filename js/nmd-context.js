import HTMLParsedElement from "html-parsed-element";
import evaluateCode from "./code-evaluator";
import NmdBlock from "./nmd-b";

export default
class NmdContext extends HTMLParsedElement {
	/**
	 * Finds context element of supplied element.
	 * @param {HTMLElement} element 
	 * @returns {NmdContext?}
	 */
	static find(element){
		return element.closest("nmd-context");
	}

	/**
	 * Finds context element of supplied element and schedules update after you release control back to browser.
	 * @param {HTMLElement} element 
	 * @returns {NmdContext?}
	 */
	static findAndUpdate(element){
		let context = this.find(element);
		setTimeout(() => context.update());
		return context;
	}

	/**
	 * Update element. Either NmdBlock element or element containing nmd attributes.
	 * @param {HTMLElement} element 
	 */
	static updateElement(element){
		if(element instanceof NmdBlock)
			element.update();
		else 
			this.updateElementAttributes(element);
	}

	/**
	 * Update nmd attributes of element.
	 * @param {HTMLElement} element 
	 */
	static updateElementAttributes(element){
		let context = NmdContext.find(element);
		if(!(context instanceof NmdContext))
			throw new Error("Element does not have parent context element.");
		for(let attr of element.getAttributeNames()){
			let toAttr = null;
			if(attr.startsWith("data-nmd-"))
				toAttr = attr.substr(9);
			else if(attr.startsWith("nmd-"))
				toAttr = attr.substr(4);
			if(toAttr === null)
				continue;
			let result = evaluateCode(element.getAttribute(attr), context.getScope(), true);
			if(typeof(result) === "undefined")
				element.removeAttribute(toAttr);
			else
				element.setAttribute(toAttr, result);
		}
	}

	constructor(){
		super();
		/** @type {string?} variable name, null for "this". */
		this.name = null;
		this.value = {};
	}

	connectedCallback(){
		super.connectedCallback();
		this.initializeValue();
	}

	parsedCallback(){
		// NmdBlock elements will selfupdate, but attributes updates must be triggered now.
		this.updateElementAttributes();
	}

	/**
	 * Evaluates value attribute. Calling this will replace your previous value state.
	 */
	initializeValue(){
		if(this.hasAttribute("value")){
			let value = this.getAttribute("value");
			if(value)
				this.value = evaluateCode(value, [this, {}], true);
		}
	}

	/**
	 * Update children NmdBlock elements and other elements attributes.
	 */
	update(){
		for(/** @type {NmdBlock} */ let block of this.querySelectorAll("nmd-b")){
			if(block.isConnected)
				block.update();
		}

		this.updateElementAttributes();
	}

	/**
	 * Update children elements attributes.
	 */
	updateElementAttributes(){
		for(let element of this.querySelectorAll("[data-nmd-ctx], [nmd-ctx]")){
			NmdContext.updateElementAttributes(element);
		}
	}

	/**
	 * @returns {[any, Object]} scope for code evaluator
	 */
	getScope(){
		let parent = this.parentElement.closest("nmd-context");
		let scope = [undefined, {}];
		if(parent)
			scope = parent.getScope();
		if(this.name === null)
			scope[0] = this.value;
		else
			scope[1][this.name] = this.value;
		return scope;
	}
}