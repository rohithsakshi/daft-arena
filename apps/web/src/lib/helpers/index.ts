import mongoose from 'mongoose';

export class ObjectIdHelper {
  static isValid(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id);
  }

  static toObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  static toString(id: mongoose.Types.ObjectId): string {
    return id.toString();
  }
}

export class DateHelper {
  static now(): Date {
    return new Date();
  }

  static isBefore(date1: Date, date2: Date): boolean {
    return date1.getTime() < date2.getTime();
  }

  static isAfter(date1: Date, date2: Date): boolean {
    return date1.getTime() > date2.getTime();
  }

  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}

export class StringHelper {
  static capitalize(str: string): string {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export class ArrayHelper {
  static unique<T>(arr: T[]): T[] {
    return Array.from(new Set(arr));
  }

  static chunk<T>(arr: T[], size: number): T[][] {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }
}

export class AsyncHelper {
  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static async retry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) throw error;
      await this.sleep(delay);
      return this.retry(fn, retries - 1, delay * 2);
    }
  }
}

export class PaginationHelper {
  static getSkipAndLimit(page: number = 1, limit: number = 10) {
    const p = Math.max(1, page);
    const l = Math.max(1, limit);
    return { skip: (p - 1) * l, limit: l };
  }
}

export class SearchHelper {
  static escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
}
