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
    path: 'home-scan/:btid',
    loadChildren: './page/home-scan/home-scan.module#HomeScanPageModule',
    canLoad: [AuthGuard]
}, {
    path: 'bt/:btid',
    loadChildren: './page/bt/bt.module#BtPageModule',
    canLoad: [AuthGuard]
}, {
    path: 'note/:btid',
    loadChildren: './page/note/note.module#NotePageModule',
    canLoad: [AuthGuard]
}, {
    path: 'confirm/:btid',
    loadChildren: './page/confirm/confirm.module#ConfirmPageModule',
    canLoad: [AuthGuard]
}, {
    path: 'print/:btid',
    loadChildren: './page/print/print.module#PrintPageModule',
    canLoad: [AuthGuard]
}, {
    path: 'picture/:btid',
    loadChildren: './page/picture/picture.module#PicturePageModule',
canLoad: [AuthGuard]
},
    { path: 'picture', loadChildren: './page/picture/picture.module#PicturePageModule' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
