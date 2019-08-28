import { Component, OnInit, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// 注定自定义的ControlValueAccessor
export const EXE_COUNTER_VALUE_ACCESSOR:any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CounterComponent),
  multi: true
};

@Component({
  selector: 'exe-counter',
  template: `
      <p>当前值: {{ count }}</p>
      <button (click)="increment()"> + </button>
      <button (click)="decrement()"> - </button>
    `,
  providers: [ EXE_COUNTER_VALUE_ACCESSOR ]
})
export class CounterComponent implements ControlValueAccessor {

  @Input() _count:number = 0;

  get count() {
    return this._count;
  }

  set count(value:number) {
    this._count = value;
    // 当组件变化时，把新值传送到外部
    this.propagateChange(this._count);
  }

  propagateChange = (_:any) => {};

  constructor() {
  }

  //写入值，将新值写入到视图的DOM中
  writeValue(value:any):void {
    if (value) {
      this.count = value;
    }
  }

  // 控件接收到change事件时触发，通知外部组件发生了变化
  registerOnChange(fn:any):void {
    this.propagateChange = fn;
  }

  // 控件接收到touched事件时触发
  registerOnTouched(fn:any):void {

  }

  increment() {
    this.count++;
  }

  decrement() {
    this.count--;
  }

}
