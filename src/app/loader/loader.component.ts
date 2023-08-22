import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GraphService } from 'src/app/services/graph.service';
@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnDestroy {

  loaderVisible: boolean = false;
  private _apiSubscription: Subscription;
  constructor(private loader: GraphService) {
    this._apiSubscription = this.loader.showLoader.subscribe((data: boolean) =>{
      console.log(data)
      setTimeout(() => {
        this.loaderVisible = data;
      }, 100);
    });
  }
  ngOnDestroy(): void {
    this._apiSubscription.unsubscribe();
  }

}
