import { Routes } from '@angular/router';
import { ViewerPage } from '@pages/viewer/viewer';

export const routes: Routes = [
  {
    path: 'document/:id',
    component: ViewerPage,
  },
  {
    path: '',
    redirectTo: 'document/1',
    pathMatch: 'full',
  },
];
