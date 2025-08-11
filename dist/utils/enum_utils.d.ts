/**
 * 枚举工具类
 */
export declare class EnumUtils {
    /**
     * 将字符串转换为枚举值
     * @param enumObj 枚举对象
     * @param value 字符串值
     * @param defaultValue 默认值（可选）
     */
    static fromString<T extends Record<string, string | number>>(enumObj: T, value: string, defaultValue?: T[keyof T]): T[keyof T] | undefined;
    /**
     * 安全转换（带错误处理）
     */
    static safeFromString<T extends Record<string, string | number>>(enumObj: T, value: string): T[keyof T];
    /**
     * 获取枚举的所有值
     */
    static getValues<T extends Record<string, string | number>>(enumObj: T): T[keyof T][];
    /**
     * 获取枚举的所有键
     */
    static getKeys<T extends Record<string, string | number>>(enumObj: T): string[];
}
