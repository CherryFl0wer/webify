export module JsonResponse {
    export interface IResult {
        type: string;
        message?: any;
        code: number;
    }

    export function success(data: any): IResult {
        return {
            type: "success",
            message: data,
            code: 200
        }
    }

    export function error(data: any, code: number): IResult {
        return {
            type: "error",
            message: data,
            code: code
        }
    }


}