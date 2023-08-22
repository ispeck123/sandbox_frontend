import { Component } from '@angular/core';
import servicedata from '../assets/service.json'

interface config {
  api_url:string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']

}
)
export class AppComponent {
  title = 'ispeck-va-sandbox';
  base_url: config = servicedata;
}


