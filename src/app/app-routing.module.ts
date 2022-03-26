import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BerryListComponent} from "./berry-list/berry-list.component";
import {NewBerryComponent} from "./new-berry/new-berry.component";
import {UpdateBerryComponent} from "./update-berry/update-berry.component";


const routes: Routes = [
  {path: 'berries', component: BerryListComponent},
  {path: 'new-berry', component: NewBerryComponent},
  {path: 'update-berry/:id', component: UpdateBerryComponent},
  {path: '', redirectTo: '/berries', pathMatch: 'full'}
]


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
