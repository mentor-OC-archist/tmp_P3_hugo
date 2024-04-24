import DOMClass from "./DOMClass.js"

export default class APIClass extends DOMClass{
    // VOICI LA LISTE DES DIFFÉRENTS TYPE DE PRORPRIÉTÉ QUE L'ON PEUT DÉFINIR DANS UNE CLASS JAVASCRIPT
    /* PUBLIC FIELD DECLARATIONS */
    // publicField = 0;
    /* PUBLIC STATIC FIELD DECLARATIONS */
    // static staticField = 0;
    /* PRIVATE FIELD DECLARATIONS */
    // #privateField = 0;
    /* PRIVATE STATIC FIELD DECLARATIONS */
    // static #privateStaticField = 0;

    //CI-DESSUS LES PROPRIÉTÉS DE LA CLASS (ON LES DÉFINIT EN 1ER, ENSUITE, LE CONSTRCUTOR, ENFIN LES MÉTHODES)
    // LES PROPRIÉTÉS DÉFINITS DANS CETTE CLASSE SONT ACCÉSSIBLE PAR 
    // - TOUTES LES CLASSES PARENTES (ICI, DOMClass uniquement). 
    // - TOUTES LES INSTANCES DE CETTE CLASSE, OU DE LA CLASSE PARENTE
    #works_endpoint = "http://localhost:5678/api/works"
    #categories_endpoint = "http://localhost:5678/api/categories"
    works = [] // 
    categories = []



    // LE constructor D'UNE CLASSE S'ÉXÉCUTE LORSQUE L'ON INITIALISE LA CLASSE 
    // (rf: VOIR DERNIÈRE LIGNE DU FICHIER)
    constructor(props) {
        // LA FONCTION super() PERMET D'APPELER LE CONSTRUCTEUR PARENT (ICI, DOMClass)
        super()
        //RÉCUPÉRER SIMPLEMENT TOUT LES PARAMÈTRE PASSÉ LORS DE L'INITIALISATION DE LA CLASSE (ICI, RIEN N'EST ATTENDU)
        props && Object.assign(this,props)


        console.log(this)
    }
    


    /**
     * RÉCUPÉRER DE L'API LES WORKS, SUR LE ENDPOINT http://localhost:5678/api/works"
     * @param {CONTIENT LES DIFFÉRENTES CATÉGORIES (PAR DÉFAUT parameter VAUT undefined)} 
     */
    getWorks(parameter) {

        // SI parameter VAUT undefined (L'OPÉRATION DE GAUCHE), ALORS RÉCUPÉRER L'OPÉRATION DE DROITE
        console.log(parameter||this.#works_endpoint)
        
        fetch(parameter||this.#works_endpoint)
            .then(response => response.json())
            .then(this.renderWorksCards)
            .catch((error) => {
                console.error("Erreur lors de la récupération des données :", error)
            })
    }
    
    /**
     * RÉCUPÉRER DE L'API LES CATÉGORIES, SUR LE ENDPOINT http://localhost:5678/api/categories"
     * 
     * getCategories EST UNE MÉTHODE ASYNCHRONE, 
     * DANS CELLE-CI IL SERA ALORS POSSIBLE D'UTILISE LE KEYWORD "await" 
     * JUSTE AVANT L'APPEL À UNE FONCTION ASYNCHRONE TEL QUE FETCH()
     * @param {CONTIENT LES DIFFÉRENTES CATÉGORIES (PAR DÉFAUT parameter VAUT undefined)} 
     */
    async getCategories(parameter) {

        // SI parameter VAUT undefined (L'OPÉRATION DE GAUCHE), ALORS RÉCUPÉRER L'OPÉRATION DE DROITE
        console.log(parameter||this.#categories_endpoint)

        // JE RÉCUPÈRE LES DONNÉES DU RÉSEAU DANS data
        // PUIS JE LES TRANSFORMENT EN JSON DANS categories
        // EN UTILISANT LE MOT-CLÉ "await"
        let data = await fetch(parameter||this.#categories_endpoint)
        , categories = await data.json()

        // J'APPELLE LA MÉTHODE DE LA CLASSE PARENTE DOMClass: DOMClass.renderFilterGallery
        // PS: j'utilise this, car this. fait référence à l'objet APIClass, 
        // qui est enfant de DOMClass, 
        // donc toutes les propriétés et méthodes de DOMClass sont disponible pour APIClass. 
        // Ceci n'est pas réciproque. La méthode APIClass.renderFilterGallery() n'est pas accéssible dans DOMClass.
        this.renderFilterGallery(categories)

    }
    
    
    
}
// const chose = new DOMClass()