/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 838:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 18:
/***/ ((module) => {

module.exports = eval("require")("@actions/exec");


/***/ }),

/***/ 766:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__nccwpck_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__nccwpck_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__nccwpck_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__nccwpck_require__.o(definition, key) && !__nccwpck_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__nccwpck_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__nccwpck_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__nccwpck_require__.r(__webpack_exports__);
/* harmony export */ __nccwpck_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0__ = __nccwpck_require__(838);
/* harmony import */ var _actions_core__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__nccwpck_require__.n(_actions_core__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1__ = __nccwpck_require__(766);
/* harmony import */ var _actions_github__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__nccwpck_require__.n(_actions_github__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _actions_exec__WEBPACK_IMPORTED_MODULE_2__ = __nccwpck_require__(18);
/* harmony import */ var _actions_exec__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__nccwpck_require__.n(_actions_exec__WEBPACK_IMPORTED_MODULE_2__);




async function increment() {
    try {
        // const awsAccessKeyId = core.getInput('AWS_ACCESS_KEY_ID');
        // const awsSecretAccessKey = core.getInput('AWS_SECRET_ACCESS_KEY');
        // const awsDefaultRegion = core.getInput('AWS_DEFAULT_REGION');

        const dynamoTableName = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('DYNAMO_TABLE_NAME');
        const dynamoPartitionKey = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('DYNAMO_PARTITION_KEY');
        const productId = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('PRODUCT_ID');

        // const dynamoTableName = "build-numbers"
        // const dynamoPartitionKey = "product-id"
        // const productId = "My Product"

        let stdout = '';
        let stderr = '';

        const options = {
            listeners: {
                stdout: (data) => {
                    stdout += data.toString();
                },
                stderr: (data) => {
                    stderr += data.toString();
                }
            }
        };

        const keyJson = { [dynamoPartitionKey]: { "S": `${productId}` } };        
        const key = JSON.stringify(keyJson);
        const tableName = `${dynamoTableName}`;
        const incrExpression = {":incr":{"N":"1"}};
        const incrJson = JSON.stringify(incrExpression);

        await (0,_actions_exec__WEBPACK_IMPORTED_MODULE_2__.exec)("aws", [
            "dynamodb", 
            "update-item", 
            "--table-name",
            tableName,
            "--key",
            key,
            "--update-expression",
            "SET VERSION = VERSION + :incr",
            "--expression-attribute-values",
            incrJson,
            "--return-values",
            "UPDATED_NEW",
            "--output",
            "text",
        ], options);

        // console.log(`stdOutResults ${stdout}, stdErrResults ${stderr}`)

        const result = stdout.match(/\w+\s+(\d+)/)[1];
        // console.log(`result ${result}`)
        _actions_core__WEBPACK_IMPORTED_MODULE_0__.setOutput("result", result);
    } catch (error) {
        if (error instanceof Error) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(error.message); // Properly log the error message and fail the action
        } else {
            console.log('Failed to increment');
        }
    }
}

async function set() {
    try {
        // const awsAccessKeyId = core.getInput('AWS_ACCESS_KEY_ID');
        // const awsSecretAccessKey = core.getInput('AWS_SECRET_ACCESS_KEY');
        // const awsDefaultRegion = core.getInput('AWS_DEFAULT_REGION');

        const dynamoTableName = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('DYNAMO_TABLE_NAME');
        const dynamoPartitionKey = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('DYNAMO_PARTITION_KEY');
        const productId = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('PRODUCT_ID');
        const value = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('VALUE');
        // const dynamoTableName = "build-numbers"
        // const dynamoPartitionKey = "product-id"
        // const productId = "My Product"
        // const value = "77";

        let stdout = '';
        let stderr = '';
    
        const options = {
            listeners: {
                stdout: (data) => {
                    console.log(`stdout: <${data.toString()}>`)
                    stdout += data.toString();
                },
                stderr: (data) => {
                    console.log(`stderr: <${data.toString()}>`)
                    stderr += data.toString();
                }
            }
        };    

        // const item = `{"${dynamoPartitionKey}": {"S": "${productId}"}, "VERSION": {"N": "${value}"} }`
        // const tableName = `${dynamoTableName}`;
        // var returnValue = await exec("aws", [
        //     "dynamodb", 
        //     "put-item", 
        //     "--table-name",
        //     tableName,
        //     "--item",
        //     item
        // ], options);
        // console.log(`returnValue ${returnValue} stdOutResults ${stdout}, stdErrResults ${stderr}`)

        const item = {
            [dynamoPartitionKey]: { "S": `${productId}` }, // Use productId as the value
            "VERSION": { "N": `${value}` }
        };
        const itemJson = JSON.stringify(item);
        // console.log(`itemJson ${itemJson}`);

        const awsCommand = `aws dynamodb put-item --table-name ${dynamoTableName} --item `;
        // console.log(`${awsCommand}`);
        var returnValue = await (0,_actions_exec__WEBPACK_IMPORTED_MODULE_2__.exec)(awsCommand, [itemJson], options);
        // console.log(`returnValue ${returnValue} stdOutResults ${stdout}, stdErrResults ${stderr}`)

        _actions_core__WEBPACK_IMPORTED_MODULE_0__.setOutput("result", value);
    } catch (error) {
        if (error instanceof Error) {
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed(error.message); // Properly log the error message and fail the action
        } else {
            console.log('Failed to set');
        }
    }
}

async function main() {
    const op = _actions_core__WEBPACK_IMPORTED_MODULE_0__.getInput('OPERATION');
    switch (op) {
        case "increment":
            await increment();
            break;
        case "set":
            await set();
            break;
        default:
            _actions_core__WEBPACK_IMPORTED_MODULE_0__.setFailed("OPERATION must be one of [set | increment]")
    }
}

main();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({ main, set, increment });


})();

module.exports = __webpack_exports__;
/******/ })()
;