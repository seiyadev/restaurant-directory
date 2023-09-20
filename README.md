
<!-- LOGO -->
<br />
<div align="center">
  <a href="https://github.com/seiyadev/restaurant-directory">
    <img src="/logo.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Restaurant Directory</h3>
</div>


<!-- TABLa de CONTENIDOS -->
<details>
  <summary>Table de contenidos</summary>
  <ol>
    <li>
    </li>
    <li>
      <a href="#getting-started">Comencemos</a>
      <ul>
        <li><a href="#prerequisites">Prerequisitos</a></li>
        <li><a href="#installation">Instalación</a></li>
      </ul>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## Acerca del proyecto

[Captura de pantalla](https://i.postimg.cc/K8DW02ZY/Captura-de-pantalla-2023-09-19-220250.png)

Este proyecto representa una prueba técnica en la que se te desafía a desarrollar una aplicación full stack que funcione como un directorio en línea de restaurantes. Hecho con React, Django, Django Rest Framework, Material UI, Tailwind y SQL Server 2019.

<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- GETTING STARTED -->
## Getting Started

Una vez que hayas clonado el repositorio, deberás cumplir los requisitos y seguir los pasos.

### Prerequisites

Necesitas SQL Server 2019, la extensión de VS Code de Python, Node y npm

### Installation

1. Clona el repositorio
   ```sh
   git clone https://github.com/seiyadev/restaurant-directory.git
   ```
2. Abre una terminal dentro de la carpeta "client" y ejecuta:
   ```sh
   npm install
   npm run build
   npm run preview
   ```
3. Configura tu interprete de python al que se encuentra dentro de "server/venv"

4. Dentro del archivo "server/django_restaurants_api/.env" configura tus credenciales a la base de datos de sql server 2019

5. Ejecuta el servidor de django con:
    ```sh
    python manage.py runserver
    ```

6. Entra a localhost:4173/

7. ¡Listo!

<p align="right">(<a href="#readme-top">back to top</a>)</p>