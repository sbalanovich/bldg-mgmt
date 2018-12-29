"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(process.env.PORT || 5000, () => console.log('Example app listening on port ', process.env.PORT || 5000, '!'));
//# sourceMappingURL=server.js.map