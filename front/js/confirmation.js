// déclaration de la fonction de confirmation
confirmationOrder();// --(ligne ≈ 10)

/**
 * Récupère avec querySelector l'ID du span dans le DOM = orderId
 * Crée un URL objet et le retourne en accédant aux arguments (searchParams)
 * Argument décodés avec "get" --> identifiant de commande (id)
 * Ajoute le numéro de commande dans le DOM (orderId)
 * Vide le local storage "cart"
 */
function confirmationOrder() {
    let orderId = document.querySelector("#orderId"); 
    let orderIdUrl = new URL(location.href).searchParams.get("id");
    orderId.textContent = orderIdUrl;
  
    localStorage.removeItem("cart");
  }
