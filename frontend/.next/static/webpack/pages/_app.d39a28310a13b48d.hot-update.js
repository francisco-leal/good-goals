"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/_app",{

/***/ "./src/providers.ts":
/*!**************************!*\
  !*** ./src/providers.ts ***!
  \**************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   chains: function() { return /* binding */ chains; },\n/* harmony export */   wagmiConfig: function() { return /* binding */ wagmiConfig; }\n/* harmony export */ });\n/* harmony import */ var wagmi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! wagmi */ \"./node_modules/.pnpm/wagmi@1.4.7_@types+react@18.2.37_react-dom@18.2.0_react@18.2.0_typescript@5.2.2_viem@1.19.3/node_modules/wagmi/dist/index.js\");\n/* harmony import */ var _rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @rainbow-me/rainbowkit */ \"./node_modules/.pnpm/@rainbow-me+rainbowkit@1.2.0_@types+react@18.2.37_react-dom@18.2.0_react@18.2.0_viem@1.19.3_wagmi@1.4.7/node_modules/@rainbow-me/rainbowkit/dist/index.js\");\n/* harmony import */ var wagmi_chains__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! wagmi/chains */ \"./node_modules/.pnpm/wagmi@1.4.7_@types+react@18.2.37_react-dom@18.2.0_react@18.2.0_typescript@5.2.2_viem@1.19.3/node_modules/wagmi/dist/chains.js\");\n/* harmony import */ var wagmi_providers_public__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! wagmi/providers/public */ \"./node_modules/.pnpm/wagmi@1.4.7_@types+react@18.2.37_react-dom@18.2.0_react@18.2.0_typescript@5.2.2_viem@1.19.3/node_modules/wagmi/dist/providers/public.js\");\n\n\n\n\n{}const chains = [\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_0__.mainnet,\n    wagmi_chains__WEBPACK_IMPORTED_MODULE_0__.goerli\n];\nconst { publicClient, webSocketPublicClient } = (0,wagmi__WEBPACK_IMPORTED_MODULE_1__.configureChains)(chains, [\n    (0,wagmi_providers_public__WEBPACK_IMPORTED_MODULE_2__.publicProvider)()\n]);\nconst { connectors } = (0,_rainbow_me_rainbowkit__WEBPACK_IMPORTED_MODULE_3__.getDefaultWallets)({\n    appName: \"ENS Frontend Template\",\n    projectId: WALLETCONNECT_ID,\n    chains\n});\nconst wagmiConfig = (0,wagmi__WEBPACK_IMPORTED_MODULE_1__.createConfig)({\n    autoConnect: true,\n    connectors,\n    publicClient,\n    webSocketPublicClient\n});\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9zcmMvcHJvdmlkZXJzLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFxRDtBQUNLO0FBQ1o7QUFDUztBQUV2RCxDQUtFLENBQ0ssTUFBTU0sU0FBUztJQUFDRixpREFBT0E7SUFBRUQsZ0RBQU1BO0NBQUM7QUFFdkMsTUFBTSxFQUFFSSxZQUFZLEVBQUVDLHFCQUFxQixFQUFFLEdBQUdSLHNEQUFlQSxDQUFDTSxRQUFRO0lBQ3RFRCxzRUFBY0E7Q0FDZjtBQUVELE1BQU0sRUFBRUksVUFBVSxFQUFFLEdBQUdQLHlFQUFpQkEsQ0FBQztJQUN2Q1EsU0FBUztJQUNUQyxXQUFXQztJQUNYTjtBQUNGO0FBRU8sTUFBTU8sY0FBY1osbURBQVlBLENBQUM7SUFDdENhLGFBQWE7SUFDYkw7SUFDQUY7SUFDQUM7QUFDRixHQUFFIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL3NyYy9wcm92aWRlcnMudHM/MWRjZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb25maWd1cmVDaGFpbnMsIGNyZWF0ZUNvbmZpZyB9IGZyb20gJ3dhZ21pJ1xuaW1wb3J0IHsgZ2V0RGVmYXVsdFdhbGxldHMgfSBmcm9tICdAcmFpbmJvdy1tZS9yYWluYm93a2l0J1xuaW1wb3J0IHsgZ29lcmxpLCBtYWlubmV0IH0gZnJvbSAnd2FnbWkvY2hhaW5zJ1xuaW1wb3J0IHsgcHVibGljUHJvdmlkZXIgfSBmcm9tICd3YWdtaS9wcm92aWRlcnMvcHVibGljJ1xuXG57LyogY29uc3QgV0FMTEVUQ09OTkVDVF9JRCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1dBTExFVENPTk5FQ1RfSURcblxuaWYgKCFXQUxMRVRDT05ORUNUX0lEKSB7XG4gIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBORVhUX1BVQkxJQ19XQUxMRVRDT05ORUNUX0lEJylcbn1cbiovfVxuZXhwb3J0IGNvbnN0IGNoYWlucyA9IFttYWlubmV0LCBnb2VybGldXG5cbmNvbnN0IHsgcHVibGljQ2xpZW50LCB3ZWJTb2NrZXRQdWJsaWNDbGllbnQgfSA9IGNvbmZpZ3VyZUNoYWlucyhjaGFpbnMsIFtcbiAgcHVibGljUHJvdmlkZXIoKSxcbl0pXG5cbmNvbnN0IHsgY29ubmVjdG9ycyB9ID0gZ2V0RGVmYXVsdFdhbGxldHMoe1xuICBhcHBOYW1lOiAnRU5TIEZyb250ZW5kIFRlbXBsYXRlJyxcbiAgcHJvamVjdElkOiBXQUxMRVRDT05ORUNUX0lELFxuICBjaGFpbnMsXG59KVxuXG5leHBvcnQgY29uc3Qgd2FnbWlDb25maWcgPSBjcmVhdGVDb25maWcoe1xuICBhdXRvQ29ubmVjdDogdHJ1ZSxcbiAgY29ubmVjdG9ycyxcbiAgcHVibGljQ2xpZW50LFxuICB3ZWJTb2NrZXRQdWJsaWNDbGllbnQsXG59KVxuIl0sIm5hbWVzIjpbImNvbmZpZ3VyZUNoYWlucyIsImNyZWF0ZUNvbmZpZyIsImdldERlZmF1bHRXYWxsZXRzIiwiZ29lcmxpIiwibWFpbm5ldCIsInB1YmxpY1Byb3ZpZGVyIiwiY2hhaW5zIiwicHVibGljQ2xpZW50Iiwid2ViU29ja2V0UHVibGljQ2xpZW50IiwiY29ubmVjdG9ycyIsImFwcE5hbWUiLCJwcm9qZWN0SWQiLCJXQUxMRVRDT05ORUNUX0lEIiwid2FnbWlDb25maWciLCJhdXRvQ29ubmVjdCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/providers.ts\n"));

/***/ })

});