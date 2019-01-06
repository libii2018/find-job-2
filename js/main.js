let toggleNavStatus = false;

let toggleNav = function() {

    let getTopbarNav = document.querySelector(".topbar-nav");
    let getTopbar = document.querySelector(".topbar");
    let getSecteur = document.querySelector(".secteur-1");

    if(toggleNavStatus === false) {
        getTopbarNav.style.visibility = "visible";
        getSecteur.style.transform = "translateY(250px)";
        getTopbarNav.style.transition = "all 0.7s ease-in-out";
        getSecteur.style.transition = "all 0.2s ease-in-out";

        toggleNavStatus = true;
    }else if(toggleNavStatus === true) {
        getSecteur.style.transform = "translateY(-25px)";
        getTopbarNav.style.visibility = "hidden";
        getTopbarNav.style.transition = "all 0.2s ease-in-out";
        getSecteur.style.transition = "all 1.8s ease-in-out";
        

        toggleNavStatus = false;
    }
}






class Careusel {

    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} option 
     * @param {Object} option.slidesToscroll Nombre d'elements a faire defiler
     * @param {object} options.slidesVisible Nombre d'elements visible dans un slide
     */

    constructor (element, option = {}) {
        this.element = element
        this.option = Object.assign({}, {
            slidesToscroll: 1, 
            slidesVisible: 1
        },options)
        let root = this.createDivWithClass('carousel') 
        let container = this.createDivWithClass('carousel__container')
        root.appendChild(container)
        this.element.appendChild(root)
    }


    /**
     * 
     * @param {string} className 
     * @returns {HTMLElement}
     */

    createDivWithClass (className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div
    }
}




document.addEventListener('DOMContentLoaded', function() {

    new Careusel(document.querySelector('#carousel1'), {
        slidesToscroll: 3,
        slidesVisible: 3
    })

})

