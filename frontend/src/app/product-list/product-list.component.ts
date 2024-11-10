import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Product } from "../common/interfaces/product.interface";
import { ProductService } from "../services/product.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit, OnDestroy {
  productService = inject(ProductService);
  productSub: Subscription;

  products: Product[] = [];

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
  }

  ngOnInit(): void {
    if (this.products.length === 0) {
      this.productSub = this.productService.getProducts().subscribe((data) => {
        this.products = data;
      });
    }
  }
}