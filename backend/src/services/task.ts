import ApiResponse from "../models/ApiResponse";

export default {
    list: (error: boolean) => {
        return new Promise<Array<Object>>((resolve, reject) => {
            if (error) {
                reject(new ApiResponse(500, "Ошибка"));
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