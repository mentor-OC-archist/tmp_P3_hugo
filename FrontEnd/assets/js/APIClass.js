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
    login_endpoint = "http://localhost:5678/api/users/login"
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
    getWorks = async (parameter) => {
        console.log(this.works_endpoint)
        try {
            const response = await fetch(this.#works_endpoint);
            const works = await response.json();
            this.renderWorksCards(works);
        } catch (error) {
            console.error('Erreur lors de la récupération des travaux :', error);
        }
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
        try {
            const response = await fetch(this.#categories_endpoint);
            const categories = await response.json();
            this.renderFilterGallery(categories);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories :', error);
        }

    }
    
    
    
}
// const chose = new DOMClass()