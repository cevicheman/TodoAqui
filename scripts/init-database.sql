-- Crear tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  numero_whatsapp TEXT NOT NULL,
  rol TEXT DEFAULT 'vendedor' CHECK (rol IN ('admin', 'vendedor')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  unidades_disponibles INTEGER NOT NULL DEFAULT 0,
  categoria TEXT NOT NULL CHECK (categoria IN ('Hogar', 'Educación', 'Servicios', 'Alimentos', 'Accesorios')),
  vendedor_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendedor_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Insertar usuario administrador por defecto
INSERT OR IGNORE INTO users (nombre, email, password, numero_whatsapp, rol) 
VALUES ('Administrador', 'admin@todoaqui.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+593969213476', 'admin');

-- Insertar productos de ejemplo para cada categoría
INSERT OR IGNORE INTO products (nombre, descripcion, precio, unidades_disponibles, categoria, vendedor_id) VALUES
-- Hogar
('Juego de Sábanas Premium', 'Sábanas 100% algodón, suaves y duraderas', 45.99, 15, 'Hogar', 1),
('Lámpara LED Moderna', 'Lámpara de mesa con luz regulable', 32.50, 8, 'Hogar', 1),
('Set de Toallas Bambú', 'Toallas ecológicas super absorbentes', 28.75, 12, 'Hogar', 1),
('Organizador de Cocina', 'Organizador multifuncional para cocina', 19.99, 20, 'Hogar', 1),

-- Educación
('Cuadernos Universitarios', 'Pack de 5 cuadernos rayados', 12.50, 25, 'Educación', 1),
('Calculadora Científica', 'Calculadora para estudiantes avanzados', 35.00, 10, 'Educación', 1),
('Set de Marcadores', 'Marcadores de colores para arte', 18.25, 18, 'Educación', 1),
('Mochila Escolar', 'Mochila resistente con múltiples compartimentos', 42.00, 7, 'Educación', 1),

-- Servicios
('Consultoría Digital', 'Asesoría en marketing digital por hora', 25.00, 100, 'Servicios', 1),
('Clases de Inglés', 'Clases particulares de inglés online', 15.00, 50, 'Servicios', 1),
('Diseño Gráfico', 'Diseño de logos y material publicitario', 45.00, 30, 'Servicios', 1),
('Reparación Celulares', 'Servicio técnico especializado', 20.00, 40, 'Servicios', 1),

-- Alimentos
('Miel Orgánica', 'Miel pura de abeja, 500g', 8.50, 30, 'Alimentos', 1),
('Café Premium', 'Café molido de altura, 250g', 12.75, 22, 'Alimentos', 1),
('Granola Artesanal', 'Granola casera con frutos secos', 6.99, 35, 'Alimentos', 1),
('Mermelada Casera', 'Mermelada de fresa sin conservantes', 5.25, 28, 'Alimentos', 1),

-- Accesorios
('Reloj Deportivo', 'Reloj resistente al agua', 89.99, 5, 'Accesorios', 1),
('Collar Artesanal', 'Collar hecho a mano con piedras naturales', 24.50, 12, 'Accesorios', 1),
('Gafas de Sol', 'Gafas con protección UV', 38.75, 9, 'Accesorios', 1),
('Billetera de Cuero', 'Billetera genuina hecha a mano', 32.00, 15, 'Accesorios', 1);
