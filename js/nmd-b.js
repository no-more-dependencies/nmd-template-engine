import HTMLParsedElement from 'html-parsed-element';
import evaluateCode from "./code-evaluator";
import NmdContext from './nmd-context';

export default
class NmdBlock extends HTMLParsedElement {
	constructor(){
		super();
	}

	connectedCallback(){
		super.connectedCallback();
		this.update();
	}

	parsedCallback(){
		if(this.hasAttribute("for")){
			/** @type {HTMLTemplateElement} */
			let templateElement = document.createElement("template");
			let nodes = [...this.childNodes];
			this.append(templateElement);
			for(let child of nodes){
				templateElement.content.append(child);
			}
			this.templateElement = templateElement;
			this.runLoop();
		}
	}

	getContext(){
		let context = this.parentElement.closest("nmd-context");
		return context.getScope();
	}

	evaluateCode(code){
		try {
			return evaluateCode(code, this.getContext(), true);
		} catch(e){
			console.error("Error evaluating code for nmd-b", this, e);
		}
		return undefined;
	}

	checkCondition(){
		let condition = this.getAttribute("if");
		if(condition === null){
			this.hidden = false;
			return;
		}
		let result = this.evaluateCode(condition);
		this.hidden = !result;
	}

	runLoop(){
		let def = this.getAttribute("for");
		if(def === null)
			return;
		let parts = def.split(/\s+of\s+/);
		if(parts.length != 2){
			console.error(`Wrong for syntax. Expected "item of items".`, this);
			return;
		}
		let varName = parts[0].trim();
		let collection = this.evaluateCode(parts[1]);

		for(let item of collection){
			let itemContent = this.templateElement.content.cloneNode(true);

			/** @type {NmdContext} */
			let itemContext = document.createElement("nmd-context");
			itemContext.name = varName;
			itemContext.value = item;

			itemContext.appendChild(itemContent);
			this.appendChild(itemContext);
		}
	}

	updateText(){
		let expr = this.getAttribute("text");
		if(expr === null){
			return;
		}
		let result = this.evaluateCode(expr);
		this.innerText = result;
	}

	isUpdatable(){
		let el = this.closest("template,nmd-context,nmd-b[for]");
		return el instanceof NmdContext;
	}

	update(){
		if(!this.isUpdatable())
			return;
		this.checkCondition();
		this.runLoop();
		this.updateText();
	}
}