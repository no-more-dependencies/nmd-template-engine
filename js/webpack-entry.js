const { default: NmdBlock } = require("./nmd-b");
const { default: NmdContext } = require("./nmd-context");

customElements.define("nmd-context", NmdContext);
customElements.define("nmd-b", NmdBlock);