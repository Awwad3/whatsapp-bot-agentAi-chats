"use strict";
(() => {
var exports = {};
exports.id = 538;
exports.ids = [538];
exports.modules = {

/***/ 142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 665:
/***/ ((module) => {

module.exports = require("raw-body");

/***/ }),

/***/ 202:
/***/ ((module) => {

module.exports = require("twilio");

/***/ }),

/***/ 623:
/***/ ((module) => {

module.exports = import("@openai/agents");;

/***/ }),

/***/ 583:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ agent)
/* harmony export */ });
/* harmony import */ var _openai_agents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(623);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(142);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_1__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_openai_agents__WEBPACK_IMPORTED_MODULE_0__]);
_openai_agents__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
// lib/openaiAgent.ts


dotenv__WEBPACK_IMPORTED_MODULE_1___default().config();
(0,_openai_agents__WEBPACK_IMPORTED_MODULE_0__.setDefaultOpenAIKey)(process.env.OPENAI_API_KEY || "");
const agent = new _openai_agents__WEBPACK_IMPORTED_MODULE_0__.Agent({
    name: "AI Assistant",
    instructions: `
    أنت مساعد ذكي تتواصل بالعربية عبر WhatsApp.
    ردودك يجب أن تكون ودية، مفهومة، وموجزة.
    لا تستخدم كلمات تقنية معقدة.
  `
});

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ 352:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config),
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(142);
/* harmony import */ var dotenv__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(dotenv__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var twilio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(202);
/* harmony import */ var twilio__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(twilio__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _lib_openaiAgent__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(583);
/* harmony import */ var raw_body__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(665);
/* harmony import */ var raw_body__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(raw_body__WEBPACK_IMPORTED_MODULE_3__);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_openaiAgent__WEBPACK_IMPORTED_MODULE_2__]);
_lib_openaiAgent__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
// pages/api/webhook.ts

dotenv__WEBPACK_IMPORTED_MODULE_0___default().config();



const config = {
    api: {
        bodyParser: false
    }
};
async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).end("Method Not Allowed");
    }
    try {
        const rawBody = await raw_body__WEBPACK_IMPORTED_MODULE_3___default()(req);
        const data = rawBody.toString();
        const params = new URLSearchParams(data);
        const userMessage = params.get("Body");
        const fromNumber = params.get("From");
        const messagingResponse = new twilio__WEBPACK_IMPORTED_MODULE_1__.twiml.MessagingResponse();
        if (!userMessage || !fromNumber) {
            messagingResponse.message("عذرًا، لم أفهم الرسالة المرسلة.");
            res.status(200).setHeader("Content-Type", "text/xml").send(messagingResponse.toString());
            return;
        }
        // تحليل الرسالة باستخدام OpenAI Agent
        const { finalOutput } = await Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 623)).then(({ run })=>run(_lib_openaiAgent__WEBPACK_IMPORTED_MODULE_2__/* .agent */ .W, userMessage));
        const reply = finalOutput || "عذرًا، لم أتمكن من الرد الآن.";
        messagingResponse.message(reply);
        res.status(200).setHeader("Content-Type", "text/xml").send(messagingResponse.toString());
    } catch (error) {
        console.error("Error processing message:", error);
        const messagingResponse = new twilio__WEBPACK_IMPORTED_MODULE_1__.twiml.MessagingResponse();
        messagingResponse.message("حدث خطأ أثناء معالجة الرسالة.");
        res.status(500).setHeader("Content-Type", "text/xml").send(messagingResponse.toString());
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(352));
module.exports = __webpack_exports__;

})();