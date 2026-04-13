-- --------------Microservice product--------------------------------------------
-- Eliminar tablas si existen
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS registro_stock CASCADE;
DROP TABLE IF EXISTS categorias CASCADE;
DROP TABLE IF EXISTS product_images CASCADE;
 
-- Crear tipo ENUM para el estado de clientes
CREATE TYPE estado_cliente AS ENUM ('Activo', 'Inactivo');
 
-- Tabla categorías
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla productos
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre_producto VARCHAR(120) NOT NULL,
    precio NUMERIC(10,2) NOT NULL, 
    descripcion VARCHAR(255),
    cantidad_ingreso INTEGER,
    id_categoria INTEGER,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);
 
-- Tabla imágenes
CREATE TABLE product_images (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    storage_path VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_primary BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (product_id) REFERENCES productos(id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Índices para mejor rendimiento
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_primary ON product_images(product_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX idx_product_images_created_at ON product_images(created_at);

-- Tabla registro_stock
CREATE TABLE registro_stock (
    id_registro SERIAL PRIMARY KEY,
    id_producto INTEGER NOT NULL,
    cantidad_ingresada INTEGER NOT NULL,
    id_usuario INTEGER NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_vencimiento DATE,
    codigo_factura VARCHAR(50) NOT NULL,
    costo_total NUMERIC(10,2) NOT NULL,
    costo_unitario NUMERIC(10,2) NOT NULL,
    porcentaje_venta NUMERIC(5,2) NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);
-- -------------------------------------------------
-- ---------------Microservice areas/clients ------------------------------------------

-- create database microservice_area_client;
-- use microservice_area_client;

-- drop table if exists zonas_de_trabajo;
-- drop table if exists clientes;
-- drop table if exists usuario_zona;

-- create table zonas_de_trabajo(
-- id_zona_de_trabajo int auto_increment primary key,
-- nombre_zona_trabajo varchar(45),
-- descripcion varchar(255)
-- );

-- create table clientes(
-- id_cliente int auto_increment primary key,
-- cedula varchar(15) not null ,
-- nombre_completo_cliente varchar(200) not null,
-- direccion varchar(255) not null, 
-- telefono varchar(15) not null,
-- rut_nit varchar(30) null,
-- razon_social varchar(120) null,
-- fecha_registro DATE NOT NULL DEFAULT (CURRENT_DATE),
-- estado enum('Activo', 'Inactivo') not null default 'Activo',
-- id_zona_de_trabajo int,
-- foreign key (id_zona_de_trabajo) references zonas_de_trabajo(id_zona_de_trabajo)
-- on delete set null on update cascade
-- );

-- CREATE TABLE usuario_zona (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     id_usuario INT NOT NULL,
--     id_zona_de_trabajo INT NOT NULL,
--     FOREIGN KEY (id_zona_de_trabajo) REFERENCES zonas_de_trabajo(id_zona_de_trabajo) ON DELETE CASCADE,
--     UNIQUE (id_usuario, id_zona_de_trabajo) -- Evitar asignaciones duplicadas
-- );

-- select* from zonas_de_trabajo;
-- select * from clientes;
-- select * from zonas_de_trabajo
-- join clientes using(id_zona_de_trabajo);

-- SELECT * FROM zonas_de_trabajo WHERE id_zona_de_trabajo = 2;
-- INSERT IGNORE INTO usuario_zona (id_usuario, id_zona_de_trabajo) VALUES (1,1);

