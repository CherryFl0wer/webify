import * as mongoose from "mongoose";
import { JsonResponse } from "../helpers/response";

interface IResult {
    err?: string;
    res?: any;
}

interface IRepository<T> {
    create(fields: any): Promise<IResult>;

    updateById(id: string, fields: any): Promise<IResult>;

    read(id: string): Promise<IResult>;

    remove(id: string): Promise<IResult>;
}

export class Repository<T extends mongoose.Model<mongoose.Document>> implements IRepository<T> {
    private model: T;

    constructor(model: T) {
        this.model = model;

        this.create = this.create.bind(this)
        this.updateById = this.updateById.bind(this)
        this.read = this.read.bind(this)
        this.remove = this.remove.bind(this)
    }

    async create(fields: any): Promise<IResult> {
        let M = this.model;
        let tmp = new M(fields);
        try {
            let res = await this.model.create(tmp);
            return JsonResponse.success(res);
        } catch (err) {
            return JsonResponse.error2(err, 500);
        }

    }

    async updateById(id: string, fields: any): Promise<IResult>  {
        try {
            let res = await this.model.updateOne({ _id: id }, fields);
            return JsonResponse.success(res);
        } catch (err) {
            return JsonResponse.error2(err, 500);
        }
    }

    async read(id: string): Promise<IResult> {
        try {
            let res = await this.model.findById(id);
            return JsonResponse.success(res);
        } catch (err) {
            return JsonResponse.error2(err, 500);
        }
    }


    async remove(id: string): Promise<IResult> {
        try {
           let res = await this.model.findOneAndRemove({ _id : id})
           return JsonResponse.success(res);
        } catch (err) {
            return JsonResponse.error2(err, 500);
        }
    }



} 