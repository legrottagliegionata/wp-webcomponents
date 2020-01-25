import {BrowserModule} from '@angular/platform-browser';
import {NgModule, Injector} from '@angular/core';
import {WpListComponent} from './wp-list/wp-list.component';
import {createCustomElement} from '@angular/elements';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ListElementComponent} from './wp-list/list-element/list-element.component';


@NgModule({
  declarations: [WpListComponent, ListElementComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, ReactiveFormsModule,
  ],
  providers: [],
  entryComponents: [WpListComponent]
})
export class AppModule {
  constructor(private injector: Injector) {
  }

  ngDoBootstrap() {
    const el = createCustomElement(WpListComponent, {injector: this.injector});
    customElements.define('sps-wp-list', el);
  }
}
