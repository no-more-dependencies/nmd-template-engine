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

	static updateElement(element){
		if(element instanceof NmdBlock)
			element.update();
		else 
			this.updateElementAttributes(element);
	}

	static updateElementAttributes(element){
		for(let attr of element.getAttributeNames()){
			let toAttr = null;
			if(attr.startsWith("data-nmd-"))
				toAttr = attr.substr(9);
			else if(attr.startsWith("nmd-"))
				toAttr = attr.substr(4);
			if(toAttr === null)
				continue;
			let result = evaluateCode(element.getAttribute(attr), NmdContext.find(element).getScope(), true);
			element.setAttribute(toAttr, result);
		}
	}

	constructor(){
		super();
		/** @type {string?} */
		this.name = null;
		this.value = {};
	}

	connectedCallback(){
		super.connectedCallback();
		if(this.hasAttribute("value")){
			let value = this.getAttribute("value");
			if(value)
				this.value = evaluateCode(value, [this, {}], true);
		}
	}

	parsedCallback(){
		// NmdBlock elements will selfupdate, but attributes updates must be triggered now.
		this.updateElementAttributes();
	}

	update(){
		for(let block of this.querySelectorAll("nmd-b")){
			if(block.isConnected)
				block.update();
		}

		this.updateElementAttributes();
	}

	updateElementAttributes(){
		for(let element of this.querySelectorAll("[data-nmd-ctx], [nmd-ctx]")){
			NmdContext.updateElementAttributes(element);
		}
	}

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