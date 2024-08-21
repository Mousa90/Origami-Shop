import { NgModule } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';


@NgModule({

  exports: [
    MatTableModule,
    MatPaginatorModule,
  ]
})
export class MaterialModule { }
