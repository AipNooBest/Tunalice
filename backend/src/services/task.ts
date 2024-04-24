import {ApiError} from "../exceptions/apiError";

export default {
    list: (error: boolean) => {
        return new Promise<Array<Object>>((resolve, reject) => {
            if (error) {
                throw new ApiError()
            }
            resolve([
                {
                    name: "task1",
                    difficulty: "medium",
                    path: "task1",
                    theory_id: 1
                }
            ])
        })
    }
}