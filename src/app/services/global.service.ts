import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  constructor() { }


  public swalError(arg: any) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title: arg,
      showConfirmButton: true,
    });
  }

  public swalSuccess(arg: any) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: arg,
      showConfirmButton: true,
    });
  }
}
