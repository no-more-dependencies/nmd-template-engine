const { default: NmdBlock } = require("./nmd-b");
const { default: NmdContext } = require("./nmd-context");

Object.assign(window, {NmdContext, NmdBlock});

customElements.define("nmd-context", NmdContext);
customElements.define("nmd-b", NmdBlock);