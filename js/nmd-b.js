import evaluateCode from "./code-evaluator";

export default
class NmdBlock extends HTMLElement {
	constructor(){
		super();
	}

	connectedCallback(){
		this.update();
	}

	checkCondition(){
		let condition = this.getAttribute("if");
		if(typeof(condition) === "undefined"){
			this.hidden = false;
			return;
		}
		let context = this.closest("nmd-context");
		let result = evaluateCode(condition, context.value, true);
		console.log(result);
		this.hidden = !result;
	}

	runLoop(){
		let def = this.getAttribute("for");
		if(typeof(def) === "undefined"){
			this.hidden = false;
			return;
		}
		let parts = def.split("of");
		if(parts.length != 3){
			console.error(`Wrong for syntax. Expected "item of items".`, this);
			this.hidden = true;
			return;
		}
		let varName = parts[0].trim();
		let collection = eval(parts[2]);
		let iterator = collection.entries();
		// TODO
	}

	update(){
		this.checkCondition();
	}
}