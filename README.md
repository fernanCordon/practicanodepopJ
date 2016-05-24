
# Práctica DevOps

####Entrando con DNS:
####[http://ec2-52-91-107-213.compute-1.amazonaws.com/](http://ec2-52-91-107-213.compute-1.amazonaws.com/)

####Fotografías: 

#####[http://ec2-52-91-107-213.compute-1.amazonaws.com/images/anuncios/paraguas.png](http://ec2-52-91-107-213.compute-1.amazonaws.com/images/anuncios/paraguas.png)

#####[http://ec2-52-91-107-213.compute-1.amazonaws.com/images/anuncios/acordeon.png](http://ec2-52-91-107-213.compute-1.amazonaws.com/images/anuncios/acordeon.png)

#####[http://ec2-52-91-107-213.compute-1.amazonaws.com/images/anuncios/bici.png](http://ec2-52-91-107-213.compute-1.amazonaws.com/images/anuncios/bici.png)

#####[http://ec2-52-91-107-213.compute-1.amazonaws.com/images/anuncios/fiat500l.png](http://ec2-52-91-107-213.compute-1.amazonaws.com/images/anuncios/fiat500l.png)


####Entrando por la IP: 

####[http://52.91.255.167/](http://52.91.255.167/)

-



# NodePop

API para aplicaciones iOS y Android.

## Instrucciones de uso

### Instalar dependencias
    
    npm install

### Configuración

Revisar models/db.js para configurar la base de datos

### Inicializar la base de datos

    npm run installDB

## Comenzar

Se comienza con este sencillo comando:
    
    npm start

Para comenzar en modo cluster:

    npm run cluster  

Para comenzar una simple instancia en modo debug:

    npm run debug (including nodemon & debug log)

## Test

    npm test (pending to create, the client specified not to do now)

## JSHint & JSCS

    npm run hints

## API v1: información


### Ruta principal

La api funciona con la siguiente ruta:  [API V1](/apiv1/anuncios)

### Seguridad

La API gestiona usuarios mediante JSON Web Token.

Para ello, primero se llama a /usuarios/register para crear un usuario.

Seguidamente nos dirigimos a /usuarios/authenticate para obtener un token.
  
En la próxima llamada necesitaremos incluir el token en:

- Header: x-access-token: eyJ0eXAiO...
- Body: { token: eyJ0eXAiO... }
- Query string: ?token=eyJ0eXAiO...

### Languaje

Todas las peticiones devuelven mensajes de error en inglés. Se puede cambiar el
idioma de las peticiones estableciendo x-lang en español, IEX-lang: es.


### Ejemplo de error

    {
      "ok": false,
      "error": {
        "code": 401,
        "message": "Authentication failed. Wrong password."
      }
    }

### POST /usuarios/register

**Introducir en el Body**: { nombre, email, clave}

**Resultado:**

    {
      "ok": true, 
      "message": "user created!"
    }

### POST /usuarios/authenticate

**Introducir en el Body**: { email, clave}

**Resultado:**

    {
      "ok": true, 
      "token": "..."
    }

### GET /anuncios

**Escribir en la Query**:

start: {int} inicio de los registros.

limit: {int} final de los registros.

sort: {string} ordenar por...

includeTotal: {bool} incluir o no el número total de artículos.

tag: {string} Filtrar mediante el tag.

venta: {bool} Extraer los que se compran o se venden.

precio: {range} filtrar por rango de precio, ejemplo 10-90, -90, 10-

nombre: {string} Se filtran los nombres por el comienzo de sus letras

Ejemplo de búsquedas: 

anuncios?start=0&limit=2&sort=precio&includeTotal=true&tag=mobile&venta=true&precio=-90&nombre=bi

**Resultado:**

    {
      "ok": true,
      "result": {
        "rows": [
          {
            "_id": "55fd9abda8cd1d9a240c8230",
            "nombre": "iPhone 3GS",
            "venta": false,
            "precio": 50,
            "foto": "/images/anuncios/iphone.png",
            "__v": 0,
            "tags": [
              "lifestyle",
              "mobile"
            ]
          }
        ],
        "total": 1
      }
    }


### GET /anuncios/tags

Podremos ver la lista de tags para los anuncios.


**Resultado:**

    {
      "ok": true,
      "allowed_tags": [
        "work",
        "lifestyle",
        "motor",
        "mobile"
      ]
    }

### POST /pushtokens

Guardar pushtoken para usuarios { pushtoken, plataforma, idusuario}

El idusuario es opcional.
La plataforma podrá ser 'ios' o 'android'

**Resultado:**

    {
      "ok": true,
      "created": {
        "__v": 0,
        "token": "123456",
        "usuario": "560ad58ff82387259adbf26c",
        "plataforma": "android",
        "createdAt": "2015-09-30T21:01:19.955Z",
        "_id": "560c4b648b892ca73faac308"
      }
    }
