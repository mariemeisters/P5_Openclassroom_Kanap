const productId = new URL(location.href).searchParams.get("id"); // Prend l'ID de la page actuelle //
fetch(`http://localhost:3000/api/products/${productId}`)  // appel de la liste des produits via l'API en y ajoutant la variable getProductId grâce aux littéraux de gabarits (interpolation) //
    .then((resultes) => {
        if (resultes.ok) {
            return resultes.json();
        }
    }) // promesse de transformer les résultats en JavaScript Object Notation (JSON) //
    .then((dataProduct) => { 
    console.table(dataProduct); // promesse d'affichage sous forme de tableau dans la console //
    displayItem(dataProduct); // promesse d'affichage des caractéristiques des produits sur la page grâce à la fonction créée plus bas //
    getProductForCart(dataProduct);// promesse de d'intégrer au local storage (panier) des information avec la fonction //
    })
    .catch((error) => { //en cas d'erreur, catch attrape l'erreur et le signale 
        console.log("Oups, il y a eu un problème > ",`${error.message}`); //message personnalisé (string) + error.message en interprétation JS //
    });

function displayItem(product){ // fonction appelée plus haut //
            
    document.title = product.name; // on donne un titre à la page produit

    let imgItem = document.querySelector(".item__img"); // selection du premier éélément de la class item__img //
    let imgCreate = document.createElement("img"); // création de l'élément img qui sera l'enfant de "item__img" //
    imgCreate.setAttribute("src", product.imageUrl); // ajout de l'attribut src //
    imgCreate.setAttribute("alt", product.altTxt) // ajout de l'attribut alt //
    imgItem.appendChild(imgCreate); // déclare que img est l'enfant de "item__img" //
            
    document.querySelector("#title").textContent = product.name; // ajoute le nom du canapé concerné //
    document.getElementById("price").textContent = product.price; // ajoute le prix du canapé concerné //
    document.getElementById("description").textContent = product.description; // ajoute la description du canapé concerné //

    let select = document.querySelector("select"); // sélection de la couleur sélectionnée //
        for (let color of product.colors) { // boucle les consignes pour chaque couleur tiré de l'ID du produit appelé plus haut //
            let option = document.createElement("option"); // variable de creation d'option //
            option.value = color; // créé la valeur de la couleur tirée de l'iD //
            option.textContent = color; // ajoute le texte en fonction de la couleur //
            select.appendChild(option); // déclare que les nouvelles options sont les enfants de select //
        }
}
 //--------------------------------------------------------------------//

function saveCart(data) { // fonction permettant d'enregistrer les produits dans le LS (setItem)
    localStorage.setItem("cart", JSON.stringify(data));
}

function getProductForCart(product) {
    const btnAddProduct = document.querySelector("#addToCart");
        // Evènement lors du clique sur le bouton pour ajouter dans le panier
    btnAddProduct.addEventListener("click", (event) => {
        event.preventDefault(); //annule l'event par défault -- bonne pratique
        // déclaration des variables color et quantité
        const colorChoice = document.querySelector("#colors");
        const quantity = document.querySelector("#quantity");
       
        const productDataCart = {   // création de l'objet qui sera dans le panier //
            name : product.name,
            id : productId,
            color: colorChoice.value,
            quantity: parseInt(quantity.value),
        };
        // si la couleur ne correspond à rien ET que la quantité est inf à 0 et sup à 100 : alert
        if (productDataCart.color === "" && productDataCart.quantity <= 0 || productDataCart.color === "" && productDataCart.quantity >= 100) { 
            alert("Veuillez sélectionner une couleur et une quantité supérieure à 0 et inférieure à 100 :)")
        }
        // et si la couleur n'est pas choisie : alert //
        else if (productDataCart.color == "") { 
            alert("Veuillez sélectionner une couleur :)");
        }
        // et si une quantité est égal à 0 et sup à 100 Ou inférieure à 0 :  alert
        else if (productDataCart.quantity <= 0 || productDataCart.quantity > 101)   {
            alert("Veuillez choisir une quantité supérieure à 0 et inférieure à 100 :)");
        }

        else {  // si ces conditions sont remplies (couleur et quantité selectionnées) alors :
                // variable de récupération du panier actuel avec getItem 
                let cart = JSON.parse(localStorage.getItem("cart"));
        // si dans le panier / localStorage 
                if(cart){ //
                    // variable et méthode find pour renvoyer la valeur des éléments (ID,color) du Local storage // 
                    const productFound = cart.find(product => product.id == productId && product.color == colorChoice.value)
                    // si le produit est déjà dans le panier (repéré grâce à l'id et la couleur)
                    if(productFound){ 
                       // var calcul quantité totale du produit en additionnant les quantités du le lS et de la sélection
                        let finalQuantity = productFound.quantity + productDataCart.quantity;
                        // déclare que seule la quantité des produits changera et qu'elle sera égale à la quantité finale 
                        productFound.quantity = finalQuantity;
                        // Sauvegarde dans le localStorage la nouvelle quantité suite à l'addition
                        saveCart(cart); 
                    }
                    else{ 
                        // Sinon (pas la même ID, ni même couleur), push (ajout) du produit dans l'objet productDataCart 
                        cart.push(productDataCart);
                        cart.sort(function(a, b) {
                            let lowCaseA = a.name.toLowerCase() 
                            let lowCaseB = b.name.toLowerCase() 
                        
                            if (lowCaseA < lowCaseB) {return -1;}
                            if  (lowCaseA > lowCaseB) {return 1;}
                            if (lowCaseA === lowCaseB) {return 0;}
                            }) 
                            // Sauvegarde toutes les informations dans le local storage grâce à l'objet productDataCart
                            saveCart(cart);
                        }
                    }
        // Sinon, si le produit n'est pas dans le panier / localStorage
                else{
                    // Créaction d'un tableau vide 
                    cart = [];
                    //  push (ajout) des infos produit dans l'objet productDataCart 
                    cart.push(productDataCart);
                    cart.sort(function(a, b) {
                        let lowCaseA = a.name.toLowerCase() 
                        let lowCaseB = b.name.toLowerCase() 
                        
                        if (lowCaseA < lowCaseB) {return -1;}
                        if  (lowCaseA > lowCaseB) {return 1;}
                        if (lowCaseA === lowCaseB) {return 0;}
                        }) 
                    // Sauvegarde le localStorage
                    saveCart(cart);
                }

                // Si aucune conditions ci-dessus n'est remplis, alors : alert
                alert(`Vous avez ajouté ${productDataCart.quantity} ${productDataCart.name} de couleur ${productDataCart.color} au panier`);
            } // ajout d'une option de redirection au panier ?? 
        }
    )}

