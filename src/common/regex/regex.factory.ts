import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {RegexProtocol} from "./regex.protocol";
import {OnlyLowercaseRegex} from "./only-lowercase.regex";
import {RemoveSpacesRegex} from "./remove-spaces.regex";

export type ClassNames = 'OnlyLowercaseRegex' | 'RemoveSpacesRegex';
@Injectable()
export class RegexFactory {
    create(className: ClassNames): RegexProtocol {
        // Meu código/lógica
        switch (className) {
            case 'OnlyLowercaseRegex':
                return new OnlyLowercaseRegex();
            case 'RemoveSpacesRegex':
                return new RemoveSpacesRegex();
            default:
                throw new InternalServerErrorException(
                    `No class found for ${className}`,
                );
        }
    }
}
