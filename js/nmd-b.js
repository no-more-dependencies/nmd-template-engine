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
		try {
			if(!this.hasAttribute("for")) // If it does not require content to be parsed, update it now.
				this.update();
		} catch(e){
			console.error(this, e);
		}
	}

	parsedCallback(){
		try {
			if(this.hasAttribute("for")){ // Update for loop after content is parsed.
				if(!(this.firstElementChild instanceof HTMLTemplateElement)){
					/** @type {HTMLTemplateElement} */
					let templateElement = document.createElement("template");
					let nodes = [...this.childNodes];
					for(let child of nodes){
						templateElement.content.append(child);
					}
					this.append(templateElement);
				}
				if(this.isUpdatable())
					this.runLoop();
			}
		} catch(e){
			console.error(this, e);
		}
	}

	get template(){
		let firstChild = this.firstElementChild;
		if(firstChild instanceof HTMLTemplateElement)
			return firstChild.content;
		return undefined;
	}

	/**
	 * @returns {NmdContext?}
	 */
	getContext(){
		return this.parentElement.closest("nmd-context");
	}

	getScope(){
		return this.getContext().getScope();
	}

	evaluateCode(code){
		try {
			return evaluateCode(code, this.getScope(), true);
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
		while(this.firstElementChild?.nextElementSibling){
			this.removeChild(this.firstElementChild.nextElementSibling);
		}
		let parts = def.split(/\s+of\s+/);
		if(parts.length != 2){
			console.error(`Wrong for syntax. Expected "item of items".`, this);
			return;
		}
		let varName = parts[0].trim();
		let collection = this.evaluateCode(parts[1]);

		for(let item of collection){
			let itemContent = this.template.cloneNode(true);

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
		// Selectors order determines priority
		let el = this.parentElement.closest("nmd-b[hidden],template,nmd-context,nmd-b[for]");
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