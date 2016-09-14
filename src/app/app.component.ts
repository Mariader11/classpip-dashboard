import { Component } from '@angular/core';
import { SamplePipe, SampleComponent, SampleService } from 'classpip-utils'

@Component({
  moduleId: module.id,
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  pipes : [SamplePipe],
  directives: [SampleComponent],
  providers: [SampleService]
})
export class AppComponent {

  title = 'app works!';
  constructor(sampleService:SampleService){
    console.log('AppComponent init!');
    console.log(sampleService.getElements());
  }
}
