# CiberEduca - Frontend

Aplicación web educativa desarrollada con React y Vite para la plataforma CiberEduca. Este frontend proporciona una interfaz interactiva para el aprendizaje de ciberseguridad y programación.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Scripts Disponibles](#scripts-disponibles)
- [Despliegue](#despliegue)
- [Contribución](#contribución)

## 📖 Descripción

Frontend de la plataforma educativa CiberEduca, diseñada para proporcionar una experiencia de aprendizaje interactiva en temas de ciberseguridad y desarrollo de software. La aplicación incluye gestión de usuarios, cursos, lecciones y evaluaciones.

## ✨ Características

- 🔐 Sistema de autenticación y autorización
- 📚 Gestión de cursos y lecciones
- 💻 Editor de código con resaltado de sintaxis
- 📊 Panel de administración
- 🎯 Sistema de evaluaciones y seguimiento de progreso
- 📱 Diseño responsive
- 🚀 Navegación con React Router
- 🔄 Gestión de estado con Context API

## 🛠️ Tecnologías

- **React** 19.1.0 - Biblioteca de JavaScript para construir interfaces de usuario
- **Vite** 6.3.5 - Build tool y dev server de nueva generación
- **React Router DOM** 7.5.3 - Enrutamiento para aplicaciones React
- **Axios** 1.9.0 - Cliente HTTP para realizar peticiones a la API
- **React Syntax Highlighter** 16.1.0 - Resaltado de sintaxis para código
- **ESLint** - Linter para mantener calidad de código

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 16.x o superior)
- **npm** (versión 8.x o superior) o **yarn**
- **Git**

## 🚀 Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd Frontend_CiberEduca
```

2. Instala las dependencias:
```bash
npm install
```

## ⚙️ Configuración

1. Copia el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Configura las variables de entorno en el archivo `.env`:
```env
# URL de la API backend
VITE_API_URL=http://localhost:3000
```

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del servidor backend de la API | `http://localhost:3000` |

## 💻 Uso

### Modo Desarrollo

Inicia el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Compilar para Producción

Genera la versión optimizada para producción:
```bash
npm run build
```

Los archivos compilados se generarán en la carpeta `dist/`

### Vista Previa de Producción

Previsualiza la versión de producción localmente:
```bash
npm run preview
```

### Linting

Ejecuta el linter para verificar la calidad del código:
```bash
npm run lint
```

## 📁 Estructura del Proyecto

```
Frontend_CiberEduca/
├── public/              # Archivos estáticos públicos
├── src/
│   ├── api/            # Configuración de API y servicios
│   ├── assets/         # Recursos estáticos (imágenes, iconos)
│   ├── components/     # Componentes reutilizables
│   ├── context/        # Context API para gestión de estado
│   ├── pages/          # Páginas/vistas de la aplicación
│   ├── App.jsx         # Componente principal
│   ├── App.css         # Estilos del componente principal
│   ├── main.jsx        # Punto de entrada de la aplicación
│   └── index.css       # Estilos globales
├── .env.example        # Ejemplo de variables de entorno
├── .gitignore          # Archivos ignorados por Git
├── eslint.config.js    # Configuración de ESLint
├── index.html          # HTML principal
├── package.json        # Dependencias y scripts
├── vite.config.js      # Configuración de Vite
└── README.md           # Este archivo
```

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Compila la aplicación para producción |
| `npm run preview` | Previsualiza la versión de producción |
| `npm run lint` | Ejecuta ESLint para verificar el código |

## 🌐 Despliegue

### Despliegue en Netlify/Vercel

1. Conecta tu repositorio con Netlify o Vercel
2. Configura las variables de entorno:
   - `VITE_API_URL`: URL de tu API en producción
3. Configura el comando de build: `npm run build`
4. Configura el directorio de publicación: `dist`

### Despliegue Manual

1. Compila el proyecto:
```bash
npm run build
```

2. Sube el contenido de la carpeta `dist/` a tu servidor web

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Convenciones de Código

- Utiliza ESLint para mantener la consistencia del código
- Sigue las convenciones de nombres de React (PascalCase para componentes)
- Documenta funciones y componentes complejos
- Escribe código limpio y mantenible

## 📄 Licencia

Este proyecto es parte de CiberEduca.

## 👥 Autores

Equipo de desarrollo CiberEduca

## 📞 Soporte

Para reportar problemas o solicitar nuevas características, por favor abre un issue en el repositorio.

---

Desarrollado con ❤️ por el equipo de CiberEduca
