import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, of, switchMap, tap } from "rxjs";
import { Product } from "../common/interfaces/product.interface";
import { AuthService } from "./auth.service";
import { RestApiService } from "./rest-api.service";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  restApi = inject(RestApiService);
  auth = inject(AuthService);

  products$ = new BehaviorSubject<Product[]>([]);
  myProducts$ = new BehaviorSubject<Product[]>([]);

  productsLoaded = {
    all: false,
    user: false,
  };

  getProducts(): Observable<Product[]> {
    if (!this.productsLoaded.all) {
      this.restApi.fetchData("api/products").subscribe((res) => {
        if (res.ok) {
          const { products } = res;
          this.products$.next(products);
          this.productsLoaded.all = true;
        }
      });
    }
    return this.products$;
  }

  getMyProducts(): Observable<Product[]> {
    if (!this.productsLoaded.user) {
      const userEmail = this.auth.userSig()?.email || "";
      this.restApi.fetchData(`api/products?email=${userEmail}`).subscribe((res) => {
        if (res.ok) {
          const { products } = res;
          this.myProducts$.next(products);
          this.productsLoaded.user = true;
        }
      });
    }
    return this.myProducts$;
  }

  getProductById(id: string): Observable<Product> {
    return this.products$.pipe(
      map((products) => products.find((product: Product) => product._id === id)),
      switchMap((product) => {
        if (product) {
          return of(product);
        } else {
          console.log("Product not found locally, pulling from DB");
          return this.restApi.fetchData(`api/products/${id}`).pipe(map((res) => res.product));
        }
      })
    );
  }

  addProduct(product: Product): Observable<any> {
    return this.restApi.addData(`api/products`, product).pipe(
      tap((product) => {
        if (product) {
          // update local list
          const prevArray = this.products$.value;
          const newArray = [...prevArray, product];
          this.products$.next(newArray);
        }
      })
    );
  }

  removeProduct(id: string): Observable<any> {
    return this.restApi.deleteData(`api/products/${id}`).pipe(
      tap((res) => {
        if (res.ok) {
          // update local list
          const prevArray = this.products$.value;
          const newArray = prevArray.filter((p) => p._id !== id);
          this.products$.next(newArray);
        }
      }),
      catchError((err) => err)
    );
  }

  resetCache() {
    this.productsLoaded = {
      all: false,
      user: false,
    };
  }
}