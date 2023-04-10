# Super simple physical document scanner api

## How to use it

Make a post request to `/scan`

Input body as json:

```
{
    "data": "data:image/jpeg;base64,iVBORw0KGgoA...VORK5CYII="
}
```

Response:

```
data:image/png;base64,zMJeYn2J...8Vg=
```

## Cache images

Cached images are stored at `/usr/app/data` in docker container
