export abstract class RegexProtocol {
    abstract execute(str: string): string;
}

// poderia usar com tokens, importanto um a um

// export interface RegexProtocol {
//     execute(str: string): string;
// }
//
// // e no arquivo que for usar
//
// export class RemoveSpacesRegex implements RegexProtocol {
//     execute(str: string): string {
//         return str.replace(/\s+/g, '');
//     }
// }
