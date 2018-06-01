import * as mongoose from "mongoose";
import { JsonResponse } from "../helpers/response";

type Answer = JsonResponse.IResult;

interface IRepository<T> {
    create(fields: any): Promise<Answer>;

    updateById(id: string, fields: any): Promise<Answer>;

    read(id: string): Promise<Answer>;

    remove(id: string): Promise<Answer>;
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

    async create(fields: any): Promise<Answer> {
        let M = this.model;
        let tmp = new M(fields);
        try {
            let res = await this.model.create(tmp);
            return JsonResponse.success(res);
        } catch (err) {
            return JsonResponse.error(err, 500);
        }

    }

    async updateById(id: string, fields: any): Promise<Answer>  {
        try {
            let res = await this.model.updateOne({ _id: id }, fields);
            return JsonResponse.success(res);
        } catch (err) {
            return JsonResponse.error(err, 500);
        }
    }

    async read(id: string): Promise<Answer> {
        try {
            let res = await this.model.findById(id);
            return JsonResponse.success(res);
        } catch (err) {
            return JsonResponse.error(err, 500);
        }
    }


    async remove(id: string): Promise<Answer> {
        try {
           let res = await this.model.findOneAndRemove({ _id : id})
           return JsonResponse.success(res);
        } catch (err) {
            return JsonResponse.error(err, 500);
        }
    }



} 