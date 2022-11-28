let currentCart = getItemCart(); // variable qui récupère les produit dans le LS
let productForPrice = []

// Appel de la fonction d'affichage du panier via l'ID du produit dans le LS
initCartWithProduct(); // (ligne 8)
removeForm() // (ligne 280)
conditionForm();
orderBtn();

function initCartWithProduct() {
    // boucle pour r;écupérer(dans le tableau)les données tirées du local storage selon l'ID du produit et executer la fonction //
    currentCart.forEach(function(getProductLS) {  //
        fetch(`http://localhost:3000/api/products/${getProductLS.id}`) // récupère info produits du le local storage en appelant l'ID //
        .then(function(resultes) { //promesse de résultat des info produit du LS //
            if (resultes.ok) {
                return resultes.json();
            }})
        .then(function(productData){ // résultat de la requette nommé productData
            let productFullInfo = {}; // création d'un tableau pour stocker les données
            Object.assign(productFullInfo, productData); // copie les valeurs (selon l'ID) de productData à productFullInfo qui est vide initialement //
           // console.table("tableau plein", productFullInfo) // vérification de la copie des infos dans le tableau
            productFullInfo.color = getProductLS.color; // remplace dans le tableau créé la couleur par celle enregistrée dans le Local Storage //
            productFullInfo.quantity = getProductLS.quantity; // remplace dans le tableau créé la quantité par celle enregistrée dans le Local Storage //
            productForPrice.push(productFullInfo); 
            displayCartItem(productFullInfo);  // function pour créer et afficher les éléments (DOM) après avoir reçu toutes les informations ci-dessus
            calculTotalProduct();
            calculTotalPrice()
        })
        .catch(function(error) { // catch attrape l'erreur et le signale 
            console.log("Oups, il y a eu un problème > ",`${error.message}`); //message personnalisé (string) + error.message en interprétation JS //
        });
    })
}

// console.log("test push", productForPrice)

function saveCart(productCart) { // fonction permettant d'enregistrer les produits dans le LS (setItem)
    let currentObjCart = JSON.stringify(productCart);
    localStorage.setItem("cart", currentObjCart);
} 

function getItemCart() {  // permet de récupérer le local storage
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return []; // retourne un tableau vide
    } else {
        return JSON.parse(cart); // retourne le résultat en tableau et objet 
    }
}

function displayCartItem(productCart) {
    let cardItem = document.querySelector("#cart__items");
    let article = document.createElement("article");
    article.classList.add("cart__item");
    article.setAttribute("data-id", productCart._id);
    article.setAttribute("data-color", productCart.color);
    cardItem.appendChild(article);
            
    let divImg = document.createElement("div");
    divImg.classList.add("cart__item__img"); // premiere div
    article.appendChild(divImg)

    let img = document.createElement("img");
    img.setAttribute("src", productCart.imageUrl); 
    img.setAttribute("alt", productCart.altTxt);
    divImg.appendChild(img);

    let divCartItemContent = document.createElement("div") // deuxieme div parent de 2 autres div
    divCartItemContent.classList.add("cart__item__content");
    article.appendChild(divCartItemContent);

    let divDescription = document.createElement("div"); // premier enfant de 2eme div
    divDescription.classList.add("cart__item__content__description");
    divCartItemContent.appendChild(divDescription);

    let h2Description = document.createElement("h2");
    h2Description.textContent = productCart.name;
    divDescription.appendChild(h2Description);

    let pColor = document.createElement("p");
    pColor.textContent = productCart.color;
    divDescription.appendChild(pColor);
                
    let pPrice = document.createElement("p");
    pPrice.textContent = productCart.price + " " + "$"; // ajouter les décimales ??
    divDescription.appendChild(pPrice);

    let divSetting = document.createElement("div"); // 2eme enfant de 2eme div + parent  2 autre div
    divSetting.classList.add("cart__item__content__settings");
    divCartItemContent.appendChild(divSetting);

    let divSettingQuantity = document.createElement("div");
    divSettingQuantity.classList.add("cart__item__content__settings__quantity");
    divSetting.appendChild(divSettingQuantity);

    let pQuantity = document.createElement("p");
    pQuantity.textContent = "Qté :" + " " + productCart.quantity;
    divSettingQuantity.appendChild(pQuantity);

    let inputQuantity = document.createElement("input");
    inputQuantity.setAttribute("type", "number");
    inputQuantity.classList.add("itemQuantity");
    inputQuantity.setAttribute("name", "itemQuantity");
    inputQuantity.setAttribute("min", "1");
    inputQuantity.setAttribute("max", "100");
    inputQuantity.setAttribute("value", productCart.quantity);
    divSettingQuantity.appendChild(inputQuantity);

    let divSettingDelete = document.createElement("div");
    divSettingDelete.classList.add("cart__item__content__settings__delete");
    divSetting.appendChild(divSettingDelete);

    let pDeleteItem = document.createElement("p");
    pDeleteItem.classList.add("deleteItem");
    pDeleteItem.textContent = "Supprimer";
    divSettingDelete.appendChild(pDeleteItem);

// ----------------------------- EVENT INPUT --------------------------------- //
    let cart = getItemCart()
    let quantityInitial = cart.find((product=> product.quantity == productCart.quantity)) // Méthode find pour trouver la quantité du produit correspondant
    //console.log("find", quantityInitial.quantity)        
    inputQuantity.addEventListener("change", function(event) { // pour chaque input de la page, s'il est activé déclare la fonction de modification de la quantité //
            // condition , pas de nombre inférieur à 1 et supérieur à 100
        if (Number(event.target.value) >= 1 && Number(event.target.value) <= 100) {
            modifyQuantity(this, event) // this pour donner les valeurs de l'objet selon les résultats de la fonction || affecter des valeurs aux propriétés de l'objet en fonction des valeurs transmises à la fonction
            let newQuantitymodif = Number(event.target.value); //  valeur (en nombre) de la quantité lors du déclenchement de l'event dans l'input//
            pQuantity.textContent = "Qté :" + " " + newQuantitymodif;
            calculTotalProduct()  
            calculTotalPrice()
        }
        else {
            alert("Veuillez choisir une quantité supérieure à 0 et inférieure à 100")     
            inputQuantity.value = quantityInitial.quantity;
            //console.log("test value", quantityInitial.quantity)
            pQuantity.textContent = "Qté :" + " " + quantityInitial.quantity
        }}
    )

// ----------------------------- EVENT BTN DELETE --------------------------------- //
    
    pDeleteItem.addEventListener("click", function () {
        if (confirm(`Souhaitez-vous supprimer le ${productCart.name} de couleur ${productCart.color} de votre panier ?`) === true) {
        //console.log("info produit clic", productCart)
            removeProduct(productCart)
            article.remove();
        }})
    } 
 //----------------------------------------------------------------------------------------------------------------------------------------//
 //-----------------------------------------------------------------------------------------------------------------------------------------// 
 // --------------------------------------- FIN FONCTION DISPLAYCARTITEM ---------------------------------------------------------------------------//

 function removeProduct(productCart) {
    let cart = getItemCart() // récupère le LS actuel
  //  console.log("test cart", cart)
    for( let i = 0; i < cart.length; i++){ // boucle pour rechercher dans local storage en vérifiant tous les objets (grâce à lengt)
        // Déclaration de variable / fonction avec la méthode filter pour rechercher les élément avec une ID et une couleur différentes //
        const cartAfterFilter = cart.filter((elementNewCart) => elementNewCart.id !== productCart._id || elementNewCart.color !== productCart.color);
        console.log("test filtre", cartAfterFilter)
        saveCart(cartAfterFilter); // grâce à la fonction je sauvegarde le nouveau panier en format JSON //
        calculTotalPrice(); // recalcule le prix du produit après la suppresion
        calculTotalProduct(); // recalcule le nombre de produit après la supprresion
        removeForm(); // s'il s'agit du dernier article, désactive le formulaire
    }
} 

    
//----------- Functions ----------- //

function calculTotalProduct () {
    let cart = getItemCart()
    let numberArticleInCart = 0; // declare que le nombre d'article est de 0
    for (let product of cart) { //  boucle pour chaque produit dans le LS (rappel : currentCart = info local Storage) //
        numberArticleInCart += product.quantity; // ajoute 1 quantité pour chaque produit (affectation après addition)
    }
    const totalProductQuantity = document.querySelector("#totalQuantity"); // selection du span
    totalProductQuantity.textContent = numberArticleInCart; // ajoute le nombre total d'article
}


function calculTotalPrice() { // calcul du produit, s'il est présent dans le panier, selon les conditions, la quantité est multiplié par son prix
    let cart = getItemCart();
    let totalPriceCart = 0;
 
    for (i = 0; i < cart.length && i < productForPrice.length; i++) {
        if (cart[i]._id === productForPrice[i].id && cart[i].color != productForPrice[i].color ||  // Ici message d'erreur réglé en ajoutant la largeur du tableau productForPrice
            cart[i]._id === productForPrice[i].id && cart[i].color === productForPrice[i].color)
            totalPriceCart += cart[i].quantity * productForPrice[i].price;
            console.log("test", productForPrice.length)
        }
    const totalProductPrice = document.querySelector("#totalPrice");
    totalProductPrice.textContent = totalPriceCart; 
}


function modifyQuantity(productCart, event) { // expression de fonction  
    let cart = getItemCart();
    let article = productCart.closest("article"); // cherche dans les parents jusqu'à trouver le "noeud" correspondant (article) //
    let newQuantity = Number(event.target.value); //  valeur (en nombre) de la quantité lors du déclenchement de l'event dans l'input//
    let productDataID = article.dataset.id; // data-id de du produit //
    let productDataColor = article.dataset.color; // data-color du produit //
     
    // boucle + propriété length avec la condition de parcourir le tableau cart (LocalStorage) 
    for (let i = 0, length = cart.length; i < length; i++) { // Pour des raisons de performance, je déclare la longueur du tableau plutôt que le recalculer à chaque tour de boucle //
        // Si dans le panier actuel l'id et la couleur (dans les data des articles) sont identiques et que la valeur n'est pas 0 (sinon reload remet comme avant)
        if (cart[i].id === productDataID && cart[i].color === productDataColor) { // si l'id et la couleur sont identiques 
            cart[i].quantity = newQuantity; // la quantité correspond au nombre après le déclenchement de l'event dans l'input
            localStorage.setItem("cart", JSON.stringify(cart)); // envoi les nouvelles info dans le local storage //
        }
    }
}

// ------------------- FORMULAIRE --------------------- //
function conditionForm() {
    // utilisation d'expression rationnelles pour combiner les conditions
    //          "/" = permet de créer une expression rationelle () 
    //          "\" = indique que le caractère qui suit est spécial et qu'il ne doit pas être interprété directement
    //          "^" = début de séquence // $ fin de séquence
    //          "+" = boucle l'expression sur tous les caractères entrés

const masqueOnlyTexte = /^[A-Za-z\è\é\ï\î\ê\-]+$/ // seule les majuscules et minuscule de a à z + les "é","è","ê" et "-" sont valides 
const masqueMixte = /^[A-Za-z0-9\'\è\é\ê\à\ \-]+$/ // + espace et apostrophe
const masqueCity = /^[A-Za-z\'\è\é\ê\à\ \-]+$/
const masqueEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
const fistNameForm = document.querySelector("#firstNameErrorMsg");
const lastNameForm = document.querySelector("#lastNameErrorMsg");
const addressForm = document.querySelector("#addressErrorMsg");
const cityForm = document.querySelector("#cityErrorMsg");
const emailForm = document.querySelector("#emailErrorMsg");

    // Evènement change lors l'input Firstname change
    firstName.addEventListener("change", event => {
        // methode test pour vérifier la valeur du texte saisi dans prenom (via le DOM) avec condition (expression rationnelle)
        if (masqueOnlyTexte.test(event.target.value) === true && (event.target.value).length > 2) { 
            fistNameForm.innerText = "";
        }
        // Sinon, message d'erreur et mise à 0 de la valeur
        else {
            event.target.value = "";
            fistNameForm.innerText = "Le prénom ne peut contenir que des lettres, au minimum 3 caractères et ne doit pas contenir d'espace.";
        }
    })

    lastName.addEventListener("change", event => {
        if (masqueOnlyTexte.test(event.target.value) === true && (event.target.value).length > 1 ) {
            lastNameForm.innerText = "";
        }
        else {
            event.target.value = "";
            lastNameForm.innerText = "Le nom ne peut contenir que des lettres -- minimum 2 caractères.";
        }
    })

    address.addEventListener("change", event => {
        if (masqueMixte.test(event.target.value) === true) {
        addressForm.innerText =""; 
        }
        else {
            event.target.value = "";
            addressForm.innerText = "erreur";
        }
    })

    city.addEventListener("change", event => {
        if (masqueCity.test(event.target.value) === true) {
        cityForm.innerText = "";
        }
        else {
            event.target.value ="";
            cityForm.innerText = "La ville ne peut contenir que des lettres"
        }
    })

    email.addEventListener("change", event => {
        if (masqueEmail.test(event.target.value) === true) {
        emailForm.innerHTML = "";
        } 
        else {
            event.target.value = "";
            emailForm.innerText = "Veuillez saisir votre email. Exemple : monadressemail@hotmail.com"
        }
    })
}

function removeForm() { // fonction qui permets de vérifier si le LS est vide, s'il est vide, je le masque, sinon il s'affiche
    let cart = getItemCart()
    let cartOrder = document.querySelector(".cart__order")
    
    if (cart.length === 0) {
        cartOrder.style.display = "none";
        cartEmpty();
    } else 
        cartOrder.style.display = "block-center";
}

function cartEmpty() {
    let divH1CartEmpty = document.querySelector("#cartAndFormContainer")
    let h1CartEmpty = divH1CartEmpty.querySelector("h1")
    let newP = document.createElement("p");

    h1CartEmpty.innerText = "Votre panier est vide"
    h1CartEmpty.appendChild(newP)
    newP.style.fontSize = "28px"
    newP.style.fontWeight = "300"
    newP.innerText ="Ajoutez-y un beau canapé"
    calculTotalProduct()
    calculTotalPrice()
}

// ----------------------- BTN DE COMMANDE ----------------- //

function orderBtn () {
    let btnOrder = document.querySelector('#order'); // selection du button //

    btnOrder.addEventListener('click', function(event) { // ajout evenement au clic //
        event.preventDefault(); // annule l'event par défault
            // vérifie si les valeurs du formulaire ne sont pas vide //
        if (firstName.value === "" || lastName.value === "" || address.value === "" || city.value === "" || email.value === "") {
            alert("Veillez renseigner vos coordonnées avant de passer la commande.");
            // si tout est ok, lance la fonction POST
        } else {
            userCartConfirm()
        }
    });
}


// ----------------------- ENVOI LES INFORMATION A L API -- FETCH METHODE POST ---------------------------//

function userCartConfirm() {
    const productInCart = getItemCart(); // récupère le LS déjà passé au json
    // méthode map pour créer un tableau avec l'id des produits dans le local storage
    const productForOrder = productInCart.map((product) => {return product.id});
    const infoOrder = { // variable d'obejet pour stoquer les valeurs du form et le tableau avec les ID produit
        contact : { // objet contact avec les champs demandés dans les spécifications
            firstName : document.getElementById("firstName").value, // pointe vers grâce à leur ID
            lastName : document.getElementById("lastName").value, // et récupère les valeurs du formulaire
            address : document.getElementById("address").value,
            email : document.getElementById("email").value,
            city : document.getElementById("city").value,
        },
        products: productForOrder, // ajoute le tableau contenant les ID produit
    };

    fetch("http://localhost:3000/api/products/order", { // envois vers le router order
       method: "POST", // choix de la méthode
       body: JSON.stringify(infoOrder), // converit en chaine JSON
       headers: { "Content-Type": "application/json; charset=UTF-8" }, // ajoute une en tête à la requête
     })
       .then((resultes) => { // si ok renvois le résultat // pour vérification
        if (resultes.ok) {
            return resultes.json();
        }})
        .then((productData) => { // change directement l'adresse du site dans la barre //
            location.href = `confirmation.html?id=${productData.orderId}`; 
            // nom de l'entreprise + ordreId qui génère un identifiant aléatoire et presque sûr//
          });
  }






// ------------------- AUTRE METHODE DISPLAY ------------------- //

// function diplayCart(productFullInfoDisplay) {
//     document.querySelector("#cart__items").innerHTML += // variable pour l'affichage des canapés sur l'ID "items" // 
//         `<article class="cart__item" data-id="${productFullInfoDisplay._id}" data-color="${productFullInfoDisplay.color}">
//         <div class="cart__item__img">
//         <img src="${productFullInfoDisplay.imageUrl}" alt="${productFullInfoDisplay.altTxt}">
//         </div>
//         <div class="cart__item__content">
//         <div class="cart__item__content__description">
//             <h2>${productFullInfoDisplay.name}</h2>
//             <p>${productFullInfoDisplay.color}</p>
//             <p>${productFullInfoDisplay.price} €</p>
//         </div>
//         <div class="cart__item__content__settings">
//             <div class="cart__item__content__settings__quantity">
//             <p>Qté : </p>
//             <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productFullInfoDisplay.quantity}">
//             </div>
//             <div class="cart__item__content__settings__delete">
//             <p class="deleteItem">Supprimer</p>
//             </div>
//         </div>
//         </div>
//     </article>`;
// }

