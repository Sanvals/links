function send() {
    const formData = new FormData();
    const files = document.getElementById("upload-input");
    formData.append("file", files.files[0]);
    const requestOptions = {
        headers: {
            "Content-Type": files.files[0].contentType,
        },
        mode: "no-cors",
        method: "POST",
        files: files.files[0],
        body: formData,
    };

    fetch(BASE_IP + "/upload", requestOptions)
        .then(() => {
            document.getElementById("upload-input").value = "";
        })
        .then(() => {
            console.log("File uploaded successfully");
        });
}