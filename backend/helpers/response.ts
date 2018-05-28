export module JsonResponse {
    export function error(msg: string, code: number) : any {
        return {
            type: "error",
            message: msg,
            code: code
        }
    }

    export function success(data: any) : any {
        return {
            type: "success",
            data: data,
            code: 200
        }
    }

    export function error2(data : any, code : number) : any {
        return {
            type: "error",
            message: data,
            code: code
        }
    }


}