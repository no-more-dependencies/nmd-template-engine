import NmdBlock from "./nmd-b";
import NmdContext from "./nmd-context";
import NmdCtx from "./nmd-ctx";

Object.assign(window, {NmdContext, NmdBlock, NmdCtx});

customElements.define("nmd-context", NmdContext);
customElements.define("nmd-b", NmdBlock);