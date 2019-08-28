import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { validateCounterRange } from './counter/counter.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  outerCounterValue:number = 5;
  form:FormGroup;
  constructor(private fb:FormBuilder) {

  }

  ngOnInit() {
    this.form = this.fb.group({
      // 设置默认值
      counter: 5
      //  设置默认值, 添加验证规则
      //counter: [5, validateCounterRange]
    })
  }
}
