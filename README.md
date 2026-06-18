# Mis Tareas - Gestor de Tareas Personal

Aplicación web minimalista para gestionar tareas con módulos dinámicos, temas dark/light y sonidos.

## Características

- ✅ Crear, editar, completar y eliminar tareas
- 📁 Módulos dinámicos personalizables (Programación, Diseño, etc.)
- 🌓 Tema claro y oscuro con persistencia
- 🔔 Sonidos al completar/agregar/eliminar tareas
- ⭐ Marcar tareas como importantes
- 🔍 Búsqueda de tareas
- 📱 Diseño responsive (mobile, tablet, desktop)
- 💾 Persistencia total con localStorage

## Tecnologías

- React 18
- Ant Design (Popconfirm, Dropdown)
- Bootstrap Icons
- Web Audio API (sonidos)
- CSS Variables (temas)

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## Producción

```bash
npm run build
```

## Estructura

```
src/
├── App/              # Componente principal y estilos
├── components/       # Componentes reutilizables
│   ├── SidebarCategories/  # Módulos dinámicos
│   ├── TodoCreate/         # Crear tareas
│   ├── TodoItem/           # Item individual
│   ├── TodoList/           # Lista de tareas
│   └── TodoSearch/         # Búsqueda
├── data/             # Datos (iconos, colores)
├── utils/            # Utilidades (sonidos)
└── index.css         # Variables CSS globales
```