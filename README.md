# Super simple physical document scanner api

Code based on https://github.com/spmallick/learnopencv/tree/master/Automatic-Document-Scanner

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

## Javascript example

```javascript
async function scanImage(inputInBase64) {
    const response = await (await fetch('/scan', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: inputInBase64
        })
    })).text()
    return response
}
```