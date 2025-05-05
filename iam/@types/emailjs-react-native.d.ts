// @types/emailjs-react-native.d.ts
declare module '@emailjs/react-native' {
    export function send(serviceId: string, templateId: string, templateParams: any, publicKey: string): Promise<any>;
    export class EmailJSResponseStatus {
      status: string;
      text: string;
    }
  }
  