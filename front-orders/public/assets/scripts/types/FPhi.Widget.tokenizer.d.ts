export class TokenizerUtils {
  static clear(bundlePath: string): void;
  static getDocumentData(bundlePath: string): any;
  static addDocumentData(bundlePath: string, mapDocumentData: any): void;
  static removeDocumentDataWithKeyStartedByKey(
    bundlePath: string,
    startingKey: string
  ): boolean;
  static getExtraData(bundlePath: string): any;
  static addExtraData(bundlePath: string, mapKey: any): any;
  static getDocumentModel(bundlePath: string): any;
  static addDocumentModel(bundlePath: string, vectorString: any): any;
  static getImageData(bundlePath: string): Uint8ClampedArray;
  static addImageData(bundlePath: string, mapKey: any): void;
  static getInternalData(bundlePath: string): any;
  static addInternalData(bundlePath: string, mapData: any): void;
  static getEncryptorType(bundlePath: string): number;
  static setEncryptorType(bundlePath: string, type: number): void;
  static encryptDictionary(bundlePath: string): boolean;
  static getEncryptedDictionaryBinary(bundlePath: string): Uint8ClampedArray;
  static getEncryptedDictionaryBase64(bundlePath: string): string;
  static decryptDictionaryBinary(
    bundlePath: string,
    data: Uint8ClampedArray
  ): number;
  static decryptDictionaryBase64(bundlePath: string, data: string): number;
  static encryptBuffer(
    bundlePath: string,
    buffer: Uint8ClampedArray
  ): Uint8ClampedArray;
  static decryptBuffer(
    bundlePath: string,
    buffer: Uint8ClampedArray
  ): Uint8ClampedArray;
  static destroyWorker(): void;
}
