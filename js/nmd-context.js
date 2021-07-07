import evaluateCode from "./code-evaluator";
import NmdBlock from "./nmd-b";

export default
class NmdContext extends HTMLElement {
	static find(element){
		return element.closest("nmd-context");
	}

	constructor(){
		super();
		/** @type {string?} */
		this.name = null;
		this.value = {};
	}

	connectedCallback(){
		if(this.hasAttribute("value")){
			let value = this.getAttribute("value");
			if(value)
				this.value = evaluateCode(value, [this, {}], true);
		}
	}

	update(){
		for(let block of this.querySelectorAll("nmd-b")){
			block.update();
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