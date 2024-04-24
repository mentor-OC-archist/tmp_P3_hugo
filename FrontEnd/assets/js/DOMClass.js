export default class DOMClass{

    constructor(props) {
        props && Object.assign(this, props)
        console.log(this)
    }



    handleClickEvent_on_filterGallery(e) {
    }

    // renderWorksCards(works){ // CECI EST UNE MÉTHODE DE LA CLASSE
    renderWorksCards = (works) => { //MAIS CECI UNE PROPRIÉTÉ DE LA CLASSE, CONTENAT UNE FONCTION FLÉCHÉE (la différence se situe sur la valeur de la variable 'this')
        this.works = works
    }

    // renderFilterGallery(categories){
    renderFilterGallery = (categories) => {
        this.categories = categories
    }



}
// const chose = new DOMClass()