import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: "sanitizePermissionList"
})
export class SanitizePermissionListPipe implements PipeTransform {

    transform(value: any) {
        return value.replaceAll("[", "").replaceAll("]", "");
    }
} 