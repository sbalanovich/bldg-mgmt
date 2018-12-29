"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("./app"));
test('should return Hello World!', done => {
    supertest_1.default(app_1.default)
        .get('/')
        .expect(200, 'Hello World!')
        .end(err => {
        if (err) {
            return done(err);
        }
        done();
    });
});
//# sourceMappingURL=app.test.js.map