import evaluateCode from "./code-evaluator";

export default
class NmdContext extends HTMLElement {
	constructor(){
		super();
		this.value = {};
	}

	connectedCallback(){
		let value = this.getAttribute("value");
		if(value)
			this.value = evaluateCode(value, [this, {}], true);
		this.update();
	}

	update(){
		for(let block of this.querySelectorAll("nmd-b")){
			block.update();
		}
	}

	getScope(){
		let parent = this.closest("nmd-context");
		let scope = [undefined, {}];
		if(parent)
			scope = parent.getScope();
		let name = this.getAttribute("name");
		if(name === null)
			scope[0] = this.value;
		else
			scopde[1][name] = this.value;
		return scope;
	}
}