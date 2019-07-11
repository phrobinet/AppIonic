import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full'
}, {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthPageModule'
}, {
    path: 'home-scan',
    loadChildren: './page/home-scan/home-scan.module#HomeScanPageModule',
    canLoad: [AuthGuard]
}, {
    path: 'bt/:btid',
    loadChildren: './page/bt/bt.module#BtPageModule',
    canLoad: [AuthGuard]
}, {
    path: 'note',
    loadChildren: './page/note/note.module#NotePageModule',
    canLoad: [AuthGuard]
}, {
    path: 'photo',
    loadChildren: './page/photo/photo.module#PhotoPageModule',
    canLoad: [AuthGuard]
}, {
    path: 'confirm',
    loadChildren: './page/confirm/confirm.module#ConfirmPageModule',
    canLoad: [AuthGuard]
}, {
    path: 'print',
    loadChildren: './page/print/print.module#PrintPageModule',
    canLoad: [AuthGuard]
}
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
