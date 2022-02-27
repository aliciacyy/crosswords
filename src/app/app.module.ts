import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CrosswordsComponent } from './pages/crosswords/crosswords.component';

@NgModule({
  declarations: [
    AppComponent,
    CrosswordsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
