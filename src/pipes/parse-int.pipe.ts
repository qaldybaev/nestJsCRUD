import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isNumberString } from "class-validator";

@Injectable()
export class ParseIntCustonPipe implements PipeTransform{
    transform(value: any, metadata: ArgumentMetadata) {
      if(  isNumberString(value)){
        return parseInt(value,10)
      }else{
        throw new BadRequestException(
            `Berilgan qiymat: ${value} number bolishi kerak!`
        )
      }
    }
}