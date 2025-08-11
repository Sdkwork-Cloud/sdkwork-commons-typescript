/**
 * 枚举工具类
 */
export class EnumUtils {
    /**
     * 将字符串转换为枚举值
     * @param enumObj 枚举对象
     * @param value 字符串值
     * @param defaultValue 默认值（可选）
     */
    static fromString<T extends Record<string, string | number>>(
      enumObj: T,
      value: string,
      defaultValue?: T[keyof T]
    ): T[keyof T] | undefined {
      // 检查值是否直接匹配枚举值
      const enumValues = Object.values(enumObj);
      if (enumValues.includes(value)) {
        return value as T[keyof T];
      }
      
      // 检查值是否匹配枚举键
      if (value in enumObj) {
        return enumObj[value as keyof T];
      }
      
      // 尝试不区分大小写匹配
      const lowerValue = value.toLowerCase();
      for (const [key, enumValue] of Object.entries(enumObj)) {
        if (typeof enumValue === "string" && enumValue.toLowerCase() === lowerValue) {
          return enumValue as T[keyof T];
        }
        
        if (key.toLowerCase() === lowerValue) {
          return enumObj[key as keyof T];
        }
      }
      
      return defaultValue;
    }
  
    /**
     * 安全转换（带错误处理）
     */
    static safeFromString<T extends Record<string, string | number>>(
      enumObj: T,
      value: string
    ): T[keyof T] {
      const result = this.fromString(enumObj, value);
      if (result === undefined) {
        throw new Error(`Invalid enum value: ${value} for enum ${enumObj.constructor.name}`);
      }
      return result;
    }
  
    /**
     * 获取枚举的所有值
     */
    static getValues<T extends Record<string, string | number>>(enumObj: T): T[keyof T][] {
      return Object.values(enumObj).filter(
        v => typeof v === "string" || typeof v === "number"
      ) as T[keyof T][];
    }
  
    /**
     * 获取枚举的所有键
     */
    static getKeys<T extends Record<string, string | number>>(enumObj: T): string[] {
      return Object.keys(enumObj).filter(
        key => isNaN(Number(key)) // 过滤掉数字键（反向映射）
      );
    }
  }