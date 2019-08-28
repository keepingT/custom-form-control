import { Component, OnInit, Input, forwardRef, OnChanges, SimpleChanges } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS,
  Validator
} from '@angular/forms';

// 注定自定义的ControlValueAccessor
export const EXE_COUNTER_VALUE_ACCESSOR:any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CounterComponent),
  multi: true
};
// 定义验证函数(限制控件值的有效范围：0 <= value <=10)
export const validateCounterRange: ValidatorFn = (control: AbstractControl):
  ValidationErrors => {
  return (control.value > 10 || control.value < 0) ?
  { 'rangeError': { current: control.value, max: 10, min: 0 } } : null;
};

// 自定义验证器
export const EXE_COUNTER_VALIDATOR= {
  provide: NG_VALIDATORS,
  //useValue: validateCounterRange,
  useExisting: forwardRef(() => CounterComponent),
  multi: true
};

// 定义验证工厂函数
export function createCounterRangeValidator(maxValue:number, minValue:number) {
  return (control: AbstractControl):ValidationErrors => {
    return (control.value > +maxValue || control.value < +minValue) ?
    { 'rangeError': { current: control.value, max: maxValue, min: minValue } } : null;
  };
}

@Component({
  selector: 'exe-counter',
  template: `
      <p>当前值: {{ count }}</p>
      <button (click)="increment()"> + </button>
      <button (click)="decrement()"> - </button>
    `,
  // 验证规则可以此处配置，也可以在创建响应式表单的控件对象验证规则中设置
  providers: [ EXE_COUNTER_VALUE_ACCESSOR, EXE_COUNTER_VALIDATOR ]
  //providers: [ EXE_COUNTER_VALUE_ACCESSOR ]
})
export class CounterComponent implements ControlValueAccessor, Validator, OnChanges  {

  @Input() _count:number = 0;
  //设置自定义的取值范围
  @Input() counterRangeMin:number;
  @Input() counterRangeMax:number;

  private _validator:ValidatorFn;
  private _onChange: () => void;

  propagateChange = (_:any) => {};

  get count() {
    return this._count;
  }

  set count(value:number) {
    this._count = value;
    // 当组件变化时，把新值传送到外部
    this.propagateChange(this._count);
  }

  constructor() {
  }

  // 输入属性变化时，创建RangeValidator
  ngOnChanges(changes: SimpleChanges) {
    if ('counterRangeMin' in changes || 'counterRangeMax' in changes) {
      this._createValidator();
    }
  }

  // 动态创建RangeValidator
  private _createValidator():void {
    this._validator = createCounterRangeValidator(this.counterRangeMax, this.counterRangeMin);
  }

  // 执行控件验证
  validate(c:AbstractControl):ValidationErrors{
    return this.counterRangeMax == null || this.counterRangeMin == null ? null : this._validator(c);
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
