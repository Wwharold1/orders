# PrudentialWebInversiones

Este proyecto es una página web para la Prudential Sociedad Administradora de Fondos (SAF). La aplicación permite a los usuarios realizar inversiones y rescates de dinero para fondos mutuos.

La aplicación cuenta con una interfaz atractiva e intuitiva, separada por módulos bien organizados, capturando la escencia e identidad de la marca, ofreciendo un gran seguimiento al estado de las inversiones.

## Table of Contents

- [Tecnologías empleadas](#tecnologías-empleadas)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y ejecutar localmente](#instalación-y-ejecutar-localmente)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Build](#build)

## Tecnologías empleadas

- Next JS 13.4.7
- React 18.2.0
- Redux
- TailwindCSS

## Requisitos Previos

- [Next JS 13.4.7](https://nextjs.org/blog/next-13-4)
- [Node 18.20 or higher](https://nodejs.org/en/blog/release/v18.16.0)
- [Npm 9.5.1 or higher](https://www.npmjs.com/package/npm/v/9.5.1)
- [Yarn 1.22.19 or higher](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable)

Es importante asegurarse de tener las versiones correctas de Node.js, Next JS y NPM para garantizar el correcto funcionamiento de su aplicación. También es necesario tener una conexión a Internet para descargar todas las dependencias necesarias.

## Instalación y ejecutar localmente

### Clonar proyecto

```shell
git clone https://gitlab.com/infra1.delfosti/phi-fondosmutuos-web-inversionista.git
cd phi-fondosmutuos-web-inversionista
```

### Instalar dependencias

```shell
yarn install
```

### Inicializar el servidor

Ejecute `yarn dev` para un servidor de desarrollo. Abre un navegador web y navega hasta <http://localhost:3000/> para ver la aplicación en funcionamiento.

## Estructura de carpetas

```bash
phi-fondosmutuos-web-inversionista
├── common
│   ├── components
│   │   ├── charts
│   │   └── icons
│   │       ├── accounts
│   │       ├── dashboard
│   │       ├── movements
│   │       ├── notifications
│   │       ├── products
│   │       ├── profile
│   │       ├── rescue
│   │       ├── riskProfile
│   │       ├── sidebar
│   │       ├── subscription
│   │       └── utils
│   ├── enums
│   ├── helper
│   ├── hooks
│   ├── interfaces
│   └── utils
├── layout
├── lib
├── modules
│   ├── accounts
│   │   ├── components
│   │   ├── enums
│   │   ├── helpers
│   │   ├── hooks
│   │   └── views
│   ├── auth
│   │   ├── components
│   │   ├── enums
│   │   ├── helpers
│   │   ├── hooks
│   │   └── slice
│   ├── dashboard
│   │   ├── components
│   │   │   ├── logos
│   │   │   └── sidebar
│   │   ├── helpers
│   │   ├── hooks
│   │   ├── modules
│   │   │   ├── funds
│   │   │   └── subscription
│   │   │       ├── components
│   │   │       │   ├── banks
│   │   │       │   ├── investment
│   │   │       │   ├── natural-client
│   │   │       │   └── risk-profile
│   │   │       └── enum
│   │   ├── motion
│   │   └── slice
│   ├── home
│   │   ├── components
│   │   ├── enum
│   │   ├── hooks
│   │   └── utils
│   ├── movements
│   │   ├── components
│   │   └── enums
│   ├── notifications
│   │   ├── components
│   │   ├── hooks
│   │   └── utils
│   ├── profile
│   │   ├── components
│   │   ├── enums
│   │   ├── helpers
│   │   ├── hooks
│   │   ├── utils
│   │   └── views
│   └── rescue
│       ├── components
│       ├── enum
│       ├── helpers
│       ├── hooks
│       └── slice
├── pages
│   ├── accounts
│   ├── api
│   ├── auth
│   ├── dashboard
│   ├── products
│   ├── profile
│   ├── rescue
│   ├── risk-profile
│   └── subscription
├── redux
│   └── common
├── services
└── styles
```

### Descripcion de carpetas principales

- **commons** : muestra los archivos que son comunes entre los componentes a fin de reutilizarlos en el proyecto, tales como utilidades, hooks, iconos y elementos ui (swipers, inputs, splash, etc.)
- **services** : contiene los servicios para comunicarse con el api.
- **redux** : contiene los recursos de estado global genéricos para la aplicación.
- **pages** : son las páginas que compone la web principal, el dashboard, y los modulos principales: cuentas bancarias, perfil y movimientos.

### Rutas

Las rutas se manejan dentro de la carpeta **pages**, dentro de ella se ubican las secciones principales, la configuración es la misma que sugeriría NextJS, orientando la estructura de carpetas a la ruta de la aplicación.

## Build

Ejecute `yarn build` para compilar el proyecto. Los artefactos de compilación se almacenarán en el directorio `.next/`.
