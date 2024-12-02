import { Component, Inject, OnInit } from '@angular/core';
import { Product, ProductService } from '../../../core/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  currentProduct: Product = this.initializeProduct();
  imageUrlsInput: string = ''; // Manejar las URLs como texto separado por comas
  isEditing = false;

  constructor(@Inject(ProductService) private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data.map((product) => ({
          ...product,
          imageUrls: Array.isArray(product.imageUrls)
            ? product.imageUrls
            : product.imageUrls
            ? [product.imageUrls] // Si es una cadena, conviértela en un array
            : [], // Si está vacío o no existe, inicializa como array vacío
        }));
      },
      error: (err) => console.error('Error al cargar productos:', err),
    });
  }

  onSubmit(): void {
    // Convertir las URLs de imágenes separadas por comas en una lista
    this.currentProduct.imageUrls = this.imageUrlsInput
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url !== '');

    if (this.isEditing) {
      this.productService.updateProduct(this.currentProduct.id!, this.currentProduct).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    } else {
      this.productService.createProduct(this.currentProduct).subscribe(() => {
        this.loadProducts();
        this.resetForm();
      });
    }
  }

  editProduct(product: Product): void {
    this.currentProduct = { ...product };
    // Convertir la lista de imágenes en una cadena separada por comas
    this.imageUrlsInput = Array.isArray(product.imageUrls) ? product.imageUrls.join(', ') : '';
    this.isEditing = true;
  }

  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => this.loadProducts());
  }

  resetForm(): void {
    this.currentProduct = this.initializeProduct();
    this.imageUrlsInput = ''; // Limpiar el campo de entrada
    this.isEditing = false;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.currentProduct = this.initializeProduct();
  }

  initializeProduct(): Product {
    return {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: 0,
      imageUrls: [],
    };
  }
}
