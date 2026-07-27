-- Seed data para la peluquería

-- Admin user (password: admin123)
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@peluqueria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin', 'Sistema', '+57 300 000 0000');

-- Empleados
INSERT INTO users (id, email, password_hash, role, first_name, last_name, phone) VALUES
('e0000000-0000-0000-0000-000000000001', 'carlos@peluqueria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 'Carlos', 'Martínez', '+57 301 111 1111'),
('e0000000-0000-0000-0000-000000000002', 'maria@peluqueria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 'María', 'López', '+57 302 222 2222'),
('e0000000-0000-0000-0000-000000000003', 'jose@peluqueria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 'José', 'García', '+57 303 333 3333');

INSERT INTO employees (user_id, specialty, bio, experience_years) VALUES
('e0000000-0000-0000-0000-000000000001', 'Degradados, Cortes modernos', 'Barbero con 8 años de experiencia especializado en degradados y estilos urbanos.', 8),
('e0000000-0000-0000-0000-000000000002', 'Colorimetría, Tratamientos', 'Estilista profesional con formación internacional en colorimetría y tratamientos capilares.', 6),
('e0000000-0000-0000-0000-000000000003', 'Barbería clásica, Afeitado', 'Maestro barbero con técnicas clásicas de navaja y tijera.', 12);

-- Servicios
INSERT INTO services (name, description, duration, price, category) VALUES
('Corte clásico', 'Corte tradicional con tijera y máquina, incluye lavado y peinado.', 30, 25000, 'corte'),
('Degradado (Fade)', 'Corte degradado moderno con diferentes niveles de intensidad.', 40, 35000, 'corte'),
('Corte + Barba', 'Combo completo de corte de cabello y perfilado de barba.', 50, 45000, 'combo'),
('Solo barba', 'Perfilado y arreglo de barba con navaja y máquina.', 20, 18000, 'barba'),
('Perfilado de cejas', 'Diseño y perfilado profesional de cejas.', 15, 12000, 'extras'),
('Lavado', 'Lavado profundo con masaje capilar relajante.', 15, 10000, 'extras'),
('Tratamiento capilar', 'Tratamiento nutritivo para fortalecer y dar brillo al cabello.', 45, 50000, 'tratamiento'),
('Tinte', 'Coloración profesional con productos de alta calidad.', 60, 70000, 'color'),
('Corte infantil', 'Corte para niños menores de 12 años.', 25, 20000, 'corte');

-- Horarios (Lunes a Sábado, 9:00 - 19:00)
INSERT INTO schedules (employee_id, day_of_week, start_time, end_time)
SELECT e.id, d.day, '09:00'::TIME, '19:00'::TIME
FROM employees e
CROSS JOIN (VALUES (1),(2),(3),(4),(5),(6)) AS d(day);

-- Configuración
INSERT INTO settings (key, value) VALUES
('business_name', 'BarberShop Premium'),
('business_address', 'Calle 85 #15-30, Bogotá, Colombia'),
('business_phone', '+57 300 123 4567'),
('business_email', 'info@peluqueria.com'),
('business_hours', '{"lunes":"9:00-19:00","martes":"9:00-19:00","miercoles":"9:00-19:00","jueves":"9:00-19:00","viernes":"9:00-19:00","sabado":"9:00-17:00","domingo":"Cerrado"}'),
('google_maps_url', 'https://maps.google.com/?q=4.6764,-74.0484'),
('google_maps_embed', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.123!2d-74.0484!3d4.6764'),
('currency', 'COP'),
('currency_symbol', '$');
