export class Base64Helper {
  public static b64EncodeUnicodeCadena(str: string): string {
    if (window && 'btoa' in window && 'encodeURIComponent' in window) {
      return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
          return String.fromCharCode(('0x' + p1) as any);
        })
      );
    } else {
      console.warn('b64EncodeUnicode requirements: window.btoa and window.encodeURIComponent functions');
      return null;
    }
  }

  public static b64EncodeUnicodeFile(file: File): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const myReader: FileReader = new FileReader();

      myReader.onloadend = e => {
        resolve(btoa(myReader.result.toString()));
      };

      myReader.readAsBinaryString(file);
    });
  }

  public static b64DecodeUnicode(str: string): string {
    if (window && 'atob' in window && 'decodeURIComponent' in window) {
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(str), c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
    } else {
      console.warn('b64DecodeUnicode requirements: window.atob and window.decodeURIComponent functions');
      return null;
    }
  }
}
