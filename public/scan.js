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