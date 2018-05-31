export module ArrayHelper {

    export function arrTimeToMs(arr : number[]) : number {
        if (arr.length == 3) {
            arr[0] = arr[0] * 60 * 60 * 1000;
            arr[1] = arr[1] * 60 * 1000;
            arr[2] = arr[2] * 1000;
        } else if (arr.length == 2) {
            arr[0] = arr[0] * 60 * 1000;
            arr[1] = arr[1] * 1000;
        } else {
            arr[0] = arr[0] * 1000;
        }

        const sum = arr.reduce((prev : number, cur : number) => prev + cur, 0);
        return sum;
    }
}