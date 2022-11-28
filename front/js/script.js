fetch("http://localhost:3000/api/products") // Appel de la liste des produits via l'API.
    .then((resultes) => resultes.json()) // Promesse de résultat en format .json permettant de stocker des informations structurées //
    .then((productList) => { // productList concerne l'ensemble des produits de l'api et leurs caractéritisques //
        console.table(productList); // Demande l'affichage sous forme de tableau dans la console de la liste des produits //
        displayProductList(productList); // Promesse d'affichage des produits grâce à la fonction (déclarée plus bas) // 
    })
    .catch((error) => { //en cas d'erreur, catch attrape l'erreur et le signale 
        console.log("Oups, il y a eu un problème > ",`${error.message}`); //message personnalisé (string) + error.message avec l'interpolation //
    });

function displayProductList(kanap) { // Fonction appelée dans Fetch pour créer le HTML et afficher les canapés sur la page //
    const articleCard = document.getElementById("items"); // récupère l'élement parent de l'article grâce à son ID // 
       for (let product of kanap) {  //  Boucle pour parcourir les informations reçues de la requette Fetch  //
        // setAttribute et appendChild pour chaque produit dans l'api en y indiquant les clés associées //
        let a = document.createElement("a"); // création de l'élement <a> en html //
        a.setAttribute("href","./product.html?id=" + product._id); 
        // donne l'attribut href+id produit pour renvoyer l'utilisateur vers cette page 
        // et sauvegarder l'ID produit pour l'utilisation future de URLSearchParams
        articleCard.appendChild(a); // a est l'enfant de aricleCard, récupéré par l'ID //

        let article = document.createElement("article"); // création de l'élement <article> en html //
        a.appendChild(article); // article est l'enfant de "a" //

        let img = document.createElement("img"); // création de l'élement <img> en html //
        img.setAttribute("src", product.imageUrl);  // ajout attribut src + url image //
        img.setAttribute("alt", product.altTxt); // ajout attribut alt + altTxt //
        article.appendChild(img); // img est l'enfant de "article" //

        let h3 = document.createElement("h3"); // création de l'élement <h3> en html //
        h3.textContent = product.name; // le texte h3 contient le nom du produit x via la boucle //
        h3.classList.add("productName") // ajout de la class productName //
        article.appendChild(h3); // h3 est l'enfant de "article" //

        let p = document.createElement("p"); // création de l'élement <p> en html
        p.textContent = product.description;
        p.classList.add("productDescription"); // ajout de la class productDescription
        article.appendChild(p); // p est l'enfant de "article"
    }
}
// ----------- Autre méthode d'affichage suite aux conseils de mon mentor ----------//
// function displayProductList(kanap) { // Fonction appelée dans Fetch pour afficher les canapés sur la page //
//     for (let product of kanap) {   
//     document.getElementById("items").innerHTML += // variable pour l'affichage des canapés sur l'ID "items" // 
//             `<a href="./product.html?id=${product._id}">
//             <article>
//                 <img src=${product.imageUrl} alt=${product.altTxt}>
//                 <h3 class="productName">${product.name}</h3>
//                 <p class="productDescription">${product.description}</p>
//             </article>
//             </a>`
//    }
// }