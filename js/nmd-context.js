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
			this.value = evaluateCode(value, null, true);
		this.update();
	}

	update(){
		for(let block of this.querySelectorAll("nmd-b")){
			block.update();
		}
	}
}