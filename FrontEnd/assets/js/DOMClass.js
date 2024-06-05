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

        const gallery = document.getElementById('gallery');
        gallery.innerHTML = '';

        works.forEach(work => {
            const figure = document.createElement('figure');
            figure.dataset.categoryId=work.category.id
            const img = document.createElement('img');
            img.src = work.imageUrl;
            img.alt = work.title || 'Titre non disponible';

            const figcaption = document.createElement('figcaption');
            figcaption.textContent = work.title || 'Titre non disponible';

            figure.appendChild(img);
            figure.appendChild(figcaption);
            gallery.appendChild(figure);
        });
    }

    // renderFilterGallery(categories){
    renderFilterGallery = (categories) => {
        this.categories = categories

        const filterContainer = document.getElementById('filter-container')
        , filterWorks = function(categoryId) {
            // supprimer toutes les .hide
            document.querySelectorAll(".gallery figure").forEach((item,i) => {
                    item.classList.remove('hide')
            })
            document.querySelectorAll(".gallery figure").forEach((item,i) => {
                const cat = item.dataset.categoryId
                console.log(cat)
                console.log(categoryId)
                console.log(cat == categoryId)
                if(cat == categoryId)
                    item.classList.add('hide')
            })
        }
        filterContainer.innerHTML = '';

        const allButton = document.createElement('button');
        allButton.textContent = 'Tous';
        allButton.addEventListener('click', () => filterWorks(null));
        filterContainer.appendChild(allButton);

        categories.forEach(category => {
            const button = document.createElement('button');
            button.textContent = category.name;
            button.addEventListener('click', () => filterWorks(category.id));
            filterContainer.appendChild(button);
        });
    }



}
// const chose = new DOMClass()