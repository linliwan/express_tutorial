// 通用的 API 响应类型
// 用于增删改操作的响应
export interface CUDResponse {
    success: boolean;
    message?: string;
    error?: string;
}