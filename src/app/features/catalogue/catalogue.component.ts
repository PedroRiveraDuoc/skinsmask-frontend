import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../core/product.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss'
})
export class CatalogueComponent implements OnInit {
  products: Product[] = []; // Lista de productos
  errorMessage: string = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  /**
   * Cargar todos los productos desde el servicio
   */
  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log('Productos cargados:', products); // Log para depuración
        this.products = products;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error); // Log para depuración
        this.errorMessage = 'Hubo un error al cargar los productos. Intenta nuevamente.';
        Swal.fire({
          title: 'Error',
          text: this.errorMessage,
          icon: 'error',
          confirmButtonText: 'Cerrar',
          confirmButtonColor: '#ff2847',
        });
      },
    });
  }

  /**
   * Añadir un producto al carrito (función simulada)
   * @param product Producto a añadir al carrito
   */
  addProductToCart(product: Product): void {
    Swal.fire({
      title: '¡Producto añadido!',
      text: `${product.name} ha sido añadido al carrito.`,
      icon: 'success',
      confirmButtonText: 'Ok',
      confirmButtonColor: '#28a745',
    });
    console.log('Producto añadido al carrito:', product); // Log para depuración
  }

  /**
   * Formatear el precio con moneda
   * @param price Precio del producto
   * @returns Precio formateado
   */
  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }
}
