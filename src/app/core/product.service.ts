import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products = [
    {
      id: 1,
      name: 'Máscara Hannya Roja',
      description: 'Una máscara tradicional japonesa con un diseño feroz.',
      price: 15000,
      stock: 5,
      categoryId: 1,
      imageUrl: 'assets/foto1.jpg',
      brand: 'SkinsMask',
      rating: 4,
      available: 'Y',
    },
    {
      id: 2,
      name: 'Máscara Oni Azul',
      description: 'Máscara Oni azul de alta calidad, perfecta para coleccionistas.',
      price: 20000,
      stock: 3,
      categoryId: 1,
      imageUrl: 'assets/foto2.jpg',
      brand: 'SkinsMask',
      rating: 5,
      available: 'Y',
    },
    {
      id: 3,
      name: 'Máscara Kitsune Dorada',
      description: 'Máscara inspirada en el zorro mítico japonés, en color dorado.',
      price: 18000,
      stock: 2,
      categoryId: 2,
      imageUrl: 'assets/foto1.jpg',
      brand: 'SkinsMask',
      rating: 4,
      available: 'Y',
    },
  ];

  getProducts() {
    return this.products;
  }
}
