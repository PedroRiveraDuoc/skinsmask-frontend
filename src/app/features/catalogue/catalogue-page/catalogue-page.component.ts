import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/product.service';


@Component({
  selector: 'app-catalogue-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogue-page.component.html',
  styleUrls: ['./catalogue-page.component.scss'],
})
export class CataloguePageComponent {
  products: { id: number; name: string; description: string; price: number; stock: number; categoryId: number; imageUrl: string; brand: string; rating: number; available: string; }[] = [];

  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
  }

  addProductToCart(product: any): void {
    alert(`Producto añadido al carrito: ${product.name}`);
  }
}
