import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  getCategories() {
    throw new Error('Method not implemented.');
  }

  constructor(private db: AngularFireDatabase ) { }

  getAll() {
    return this.db.list('/categories/');
  }

  getAllWithId() {
    return this.db.list('/categories').snapshotChanges().pipe(
      map(actions => 
        actions.map(a => ({ id: a.key, ...a.payload.val() as any }))
      )
    );
  }
}

