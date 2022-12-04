// Appel de la fonction fetch
fetchApiProduct();
// ↳ displayProductList()

/**
 * Appel de la liste des produits via l'API.
 * Promesse de résultat en format .json permettant de stocker des informations structurées possédant les attributs suivants :
 * (colors = array of string || id = string || name = string || price = number || imageUrl = string || description = string || altTxt = string) 
 * productList concerne l'ensemble des produits de l'api et leurs caractéristisques 
 * Promesse d'affichage des produits grâce à la fonction displayProductList avec productList
 * En cas d'erreur, catch attrape l'erreur et le signale, message personnalisé (string) + error.message avec l'interpolation.
 */
function fetchApiProduct () {
    fetch("http://localhost:3000/api/products") 
        .then((resultes) => resultes.json()) 
        .then((productList) => { 
            console.log(productList)
            displayProductList(productList); 
        })
        .catch((error) => {
            console.log("Oups, il y a eu un problème > ",`${error.message}`); 
        });
}
/**
 * Fonction affichage (page d'accueil) d'insertion dynamique des produits dans le DOM
 * Récupère l'élément parent de l'article grâce à son ID
 * Boucle pour parcourir les informations itérables reçues de la requête Fetch (kanap) et créer les éléments dans le DOM
 * créatEeLement, setAttribute et appendChild pour chaque produit dans l'api en y indiquant les clés associées 
 * a.setAttribute = href+id produit pour renvoyer l'utilisateur vers cette page et sauvegarder l'ID produit pour l'utilisation future de URLSearchParams
 */
function displayProductList(kanap) { 
    const articleCard = document.getElementById("items"); 
       for (let product of kanap) {  

        let a = document.createElement("a"); 
        a.setAttribute("href","./product.html?id=" + product._id); 
        articleCard.appendChild(a); // a est l'enfant de aricleCard

        let article = document.createElement("article"); // 
        a.appendChild(article); // 

        let img = document.createElement("img");
        img.setAttribute("src", product.imageUrl);
        img.setAttribute("alt", product.altTxt);  
        article.appendChild(img); 

        let h3 = document.createElement("h3");
        h3.textContent = product.name; 
        h3.classList.add("productName") 
        article.appendChild(h3); 

        let p = document.createElement("p"); 
        p.textContent = product.description;
        p.classList.add("productDescription");
        article.appendChild(p); 
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