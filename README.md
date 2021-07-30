# Node, TS, Express, Sharp and Multer: Image Processing API

## Overview

This is an easy, basic and raw example of **HOW to** implement an API with Node, TS, Express, Sharp and Multer to upload images to a server (currently just one format, `jpeg`) and generate thumbnails. 

## Local development

### Install dependencies

```
npm install
```

### Start local server

```
npm start
```

*Note:* If you want to start the `dev server`, execute -instead- `npm run dev`

### Run unit tests

```
npm run test
```

### Linting

```
npm run lint
```

## Endpoints

### Error types

* **400: Bad request**
  - GET
    - If width and height are missing in the query params
    - If width and/or height have the wrong value data type (everything but a number)
    - If width and/or height are less than the pre-defined minimum sizes
    - If width and/or height are greater than the width and height of the original (full) image
  - POST
    - If an image is missing

* **404: Resource not found**
  - Everything but GET/POST api/images
  
* 4**15: Unsupported Media Type**
  - POST
    - If the image type is other than jpeg

### GET /api/images

* Returns the resized image
  * If the image was generated previously, it returns the cached version (aka, the stored thumbnail). If not, it generates and returns the thumbnail. 

Example:

Open in your browser:
```
http://127.0.0.1:5000/api/images?filename=integration&width=100&height=100
```

### POST /api/images
* Adds a new image to the full folder (these images can be used to generate thumbnails).
* Returns an object with the key message and the proper status code description.

#### Request

```
curl -v --location --request POST 'localhost:5000/api/images' \
--form 'recfile=@"images/integration.jpg"'
```

#### Response

```
{"message":"Created"}
```

Any other endpoint will return `404`


---

## Kudos

* Extended version of Udacity's JSFSN Image Processing API
* Image Cable Network as Integration > Taylor Vick https://unsplash.com/@tvick
* Image Led as Test > Adi Goldstein https://unsplash.com/@adigold1