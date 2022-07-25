import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'historico',
        children: [
          {
            path: '',
            loadChildren: () => import('../historico/historico.module').then( m => m.HistoricoPageModule)
          },
          {
            path: 'mapa/:geo',
            loadChildren: () => import('../mapa/mapa.module').then( m => m.MapaPageModule)
          },
        ]
      },
      {
        path: 'scanner',
        loadChildren: () => import('../scanner/scanner.module').then( m => m.ScannerPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/scanner',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/scanner',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
