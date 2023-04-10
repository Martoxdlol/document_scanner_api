const input = document.getElementById("selectAvatar");
const avatar = document.getElementById("avatar");
const textArea = document.getElementById("textAreaExample");

const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

let code = ''

const uploadImage = async (event) => {
    const file = event.target.files[0];
    const base64 = await convertBase64(file);
    code = base64
    // avatar.src = base64;
    textArea.innerText = base64;
};

input.addEventListener("change", (e) => {
    uploadImage(e);
});

async function scan() {
    const response = await (await fetch('/scan', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            data: code
        })
    })).text()

    avatar.src = response
}