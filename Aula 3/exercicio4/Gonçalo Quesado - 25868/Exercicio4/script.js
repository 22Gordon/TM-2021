// Your JS Script here

addImage = () => {

    const imageContainer = document.getElementById("imageContainer")
    const img = document.createElement("img")
    img.src ="https://placeimg.com/250/150/"+ imageContainer.children.length

   imageContainer.appendChild(img);

    const span = document.getElementById("contador")
    span.innerText = imageContainer.children.length.toString()
}

deleteImage = () => {

    const imageContainer = document.getElementById("imageContainer")
    const randomNumber1 = (Math.floor(Math.random() * (imageContainer.children.length)))
    imageContainer.children[randomNumber1].remove()
    updateCounter(imageContainer);
}

updateCounter =(imageContainer)=> {
    const span = document.getElementById("contador")
    span.innerText = imageContainer.children.length.toString()
}