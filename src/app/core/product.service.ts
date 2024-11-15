import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  products = [
    {
      id: 1,
      name: 'Máscara White Calligraphy',
      description: 'Máscara con diseño de caligrafía japonesa en blanco, elegante y única.',
      price: 22000,
      stock: 4,
      categoryId: 3,
      imageUrl: 'assets/images/white-calligraphy.jpg',
      brand: 'SkinsMask',
      rating: 5,
      available: 'Y',
    },
    {
      id: 2,
      name: 'Máscara Oni Azul',
      description: 'Máscara Oni en color azul intenso, con detalles realistas y acabado brillante.',
      price: 25000,
      stock: 2,
      categoryId: 1,
      imageUrl: 'assets/images/blue-demon.png',
      brand: 'SkinsMask',
      rating: 5,
      available: 'Y',
    },
    {
      id: 3,
      name: 'Máscara Emperor Dorada',
      description: 'Máscara dorada de alta calidad, inspirada en un diseño imperial japonés.',
      price: 30000,
      stock: 3,
      categoryId: 2,
      imageUrl: 'assets/images/emperor-gold.jpg',
      brand: 'SkinsMask',
      rating: 5,
      available: 'Y',
    },
    {
      id: 4,
      name: 'Máscara Ghost',
      description: 'Máscara oscura con detalles en oro, perfecta para coleccionistas.',
      price: 28000,
      stock: 1,
      categoryId: 2,
      imageUrl: 'assets/images/ghost.png',
      brand: 'SkinsMask',
      rating: 4,
      available: 'Y',
    },
    {
      id: 5,
      name: 'Máscara Hannya Roja',
      description: 'Máscara Hannya clásica en rojo, símbolo de venganza y pasión.',
      price: 18000,
      stock: 5,
      categoryId: 1,
      imageUrl: 'assets/images/red-hannya.png',
      brand: 'SkinsMask',
      rating: 4,
      available: 'Y',
    },
    {
      id: 6,
      name: 'Máscara Hannya Rosa',
      description: 'Edición especial de la máscara Hannya en color rosa, diseño exclusivo.',
      price: 20000,
      stock: 2,
      categoryId: 3,
      imageUrl: 'assets/images/pink-hannya.png',
      brand: 'SkinsMask',
      rating: 5,
      available: 'Y',
    },
  ];

  getProducts() {
    return this.products;
  }
}
