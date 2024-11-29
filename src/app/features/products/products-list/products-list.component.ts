import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../../core/product.service';


@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent {
  products: { id: number; name: string; description: string; price: number; stock: number; categoryId: number; imageUrl: string; brand: string; rating: number; available: string; }[] = [];

  constructor(private productService: ProductService) {
    this.products = this.productService.getProducts();
  }

  modificar(product: any): void {
    alert(`Modificando: ${product.name}`);
  }

  eliminar(product: any): void {
    alert(`Eliminando: ${product.name}`);
  }
}
