"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(model) {
        this.model = model;
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.query.name) {
                    const response = yield this.model.find({ name: req.query.name });
                    res.send(response);
                }
                else {
                    const response = yield this.model.find();
                    res.send(response);
                }
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findById(req.params.id);
                res.send(response);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.create(req.body);
                res.status(201).send(response);
            }
            catch (error) {
                res.status(406).send(error.message);
            }
        });
    }
    put(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findByIdAndUpdate(req.params.id, req.body, { new: true });
                res.send(response);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.model.findByIdAndDelete(req.params.id);
                res.send(response);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.BaseController = BaseController;
const createController = (model) => {
    return new BaseController(model);
};
exports.default = createController; // Maybe unnecessary, if all controllers are extended - change
//# sourceMappingURL=base_controller.js.map