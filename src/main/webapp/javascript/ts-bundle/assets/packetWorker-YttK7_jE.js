(function(){"use strict";self.onmessage=function(e){try{let s=JSON.parse(e.data);Array.isArray(s)||(s=[s]),self.postMessage({packets:s})}catch{self.postMessage({error:"parse error",raw:e.data})}}})();
//# sourceMappingURL=packetWorker-YttK7_jE.js.map
