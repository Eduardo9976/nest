import {RegexProtocol} from "./regex.protocol";

export class OnlyLowercaseRegex extends RegexProtocol {
  execute(str: string): string {
    return str.replace(/[^a-z]/g, '');
  }
}
