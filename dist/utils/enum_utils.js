"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumUtils = void 0;
/**
 * 枚举工具类
 */
class EnumUtils {
    /**
     * 将字符串转换为枚举值
     * @param enumObj 枚举对象
     * @param value 字符串值
     * @param defaultValue 默认值（可选）
     */
    static fromString(enumObj, value, defaultValue) {
        // 检查值是否直接匹配枚举值
        const enumValues = Object.values(enumObj);
        if (enumValues.includes(value)) {
            return value;
        }
        // 检查值是否匹配枚举键
        if (value in enumObj) {
            return enumObj[value];
        }
        // 尝试不区分大小写匹配
        const lowerValue = value.toLowerCase();
        for (const [key, enumValue] of Object.entries(enumObj)) {
            if (typeof enumValue === "string" && enumValue.toLowerCase() === lowerValue) {
                return enumValue;
            }
            if (key.toLowerCase() === lowerValue) {
                return enumObj[key];
            }
        }
        return defaultValue;
    }
    /**
     * 安全转换（带错误处理）
     */
    static safeFromString(enumObj, value) {
        const result = this.fromString(enumObj, value);
        if (result === undefined) {
            throw new Error(`Invalid enum value: ${value} for enum ${enumObj.constructor.name}`);
        }
        return result;
    }
    /**
     * 获取枚举的所有值
     */
    static getValues(enumObj) {
        return Object.values(enumObj).filter(v => typeof v === "string" || typeof v === "number");
    }
    /**
     * 获取枚举的所有键
     */
    static getKeys(enumObj) {
        return Object.keys(enumObj).filter(key => isNaN(Number(key)) // 过滤掉数字键（反向映射）
        );
    }
}
exports.EnumUtils = EnumUtils;
