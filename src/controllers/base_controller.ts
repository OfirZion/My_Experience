import {Model} from "mongoose"; 
import { Request, Response } from "express";

export class BaseController<T> {
    model: Model<T>;
    constructor(model: Model<T>){
        this.model = model;
    }

    async get(req: Request, res: Response){
        try {
            if(req.query.name){ 
                const response = await this.model.find({name: req.query.name});
                res.status(200).json({
                    data: response,
                    message: "Data found - get",
                    status: 200
                })
            } else {
                const response = await this.model.find(); 
                res.status(200).json({
                    data: response,
                    message: "Data found - get",
                    status: 200
                });
            }   
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const response = await this.model.findById(req.params.id);
            res.status(200).json({
                data: response,
                message: "Data found - getById",
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                    message: error.message,
                    status: 500
                });
        }
    }



    async post(req: Request, res: Response) {
        try {
            const response = await this.model.create(req.body);
            res.status(201).send({
                data: response,
                message: "Data created - post",
                status: 201
            });
        } catch (error) {
            res.status(406).json({
                message: error.message,
                status: 406
            });
        }
    }

    async put(req: Request, res: Response) {
        try {
            const response = await this.model.findByIdAndUpdate(req.params.id, req.body, {new: true});
            res.status(200).json({
                data: response,
                message: "Data updated - put",
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const response = await this.model.findByIdAndDelete(req.params.id);
            res.status(200).json({
                data: response,
                message: "Data deleted - delete",
                status: 200
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
                status: 500
            });
        }
    }
} 

const createController = <T>(model: Model<T>) => {
    return new BaseController<T>(model);
} 

export default createController; // Maybe unnecessary, if all controllers are extended - change



