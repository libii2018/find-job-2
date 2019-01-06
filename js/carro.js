class Carousel {

    /**
     * This callback is displayed as a global member.
     * @callback moveCallback
     * @param {number} index
     */



    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} option 
     * @param {Object} [option.slidesToscroll=1] Nombre d'elements a faire defiler
     * @param {object} [options.slidesVisible=1] Nombre d'elements visible dans un slide
     * @param {boolean} [options.loop=false] Doit-t-on boucle en fin de carousel
     * @param {boolean} [options.pagination=false]
     * @param {boolean} [options.navigation=true]
     * @param {boolean} [options.infinite=false]
     */


    constructor (element, options = {}) {
        this.element = element
        this.options = Object.assign({},{
            slidesToScroll: 1,
            slidesVisible: 1,
            loop: false,
            pagination: false,
            navigation: true, 
            infinite: false
        }, options)
        let children = [].slice.call(element.children)
        this.isMobile = true
        this.currentItem = 0
        this.moveCallbacks = [],
        this.offset = 0

        //Modification du DOM
        this.root = this.createDivWithClass('carousel')
        this.container = this.createDivWithClass('carousel__container')
        this.root.setAttribute('tabindex', '0')
        this.root.appendChild(this.container)
        this.element.appendChild(this.root)
        this.items = children.map((child) => {
            let item = this.createDivWithClass('carousel__item')
            item.appendChild(child)
            return item
        })
        if (this.options.infinite) {
            this.offset = this.options.slidesVisible * 2
            this.items = [
                ...this.items.slice(this.items.length - this.offset).map(item => item.cloneNode(true)),
                ...this.items,
                ...this.items.slice(0, this.offset).map(item => item.cloneNode(true)),
            ]
            this.gotoItem(this.offset, false) 
        }
        this.items.forEach(item => this.container.appendChild(item))
        this.setStyle()
        if (this.options.navigation){
            this.createNavigation()
        }
        if (this.options.navigation){
            this.createPagination()
        }
         
        
        
        

        //Evenements
        this.moveCallbacks.forEach(cb => cb(this.currentItem))
        this.onWindowResize()
        window.addEventListener('resize', this.onWindowResize.bind(this))
        if (this.options.infinite) {
            this.container.addEventListener('transitionend', this.resetInfinite.bind(this))
        }
        
        
        
    }



    /**
     * applique les bonnes dimension aux elements du carousel
     */
    setStyle () {
        let ratio = this.items.length / this.slidesVisible 
        this.container.style.width = (ratio * 100) + "%"
        this.items.forEach(item => item.style.width = ((100 / this.slidesVisible) / ratio) + "%")
    }




    /**
     * cree les fleches de navigation dans le DOM
     */
    createNavigation () {
        let nextButton = this.createDivWithClass('carousel__next')
        let prevButton = this.createDivWithClass('carousel__prev')
        this.root.appendChild(nextButton)
        this.root.appendChild(prevButton)
        nextButton.addEventListener('click',this.next.bind(this))
        prevButton.addEventListener('click',this.prev.bind(this))
        if (this.options.loop === true) {
            return
        }
        this.onMove(index => {
            if (index === 0) {
                prevButton.classList.add('carousel__prev--hidden')
            } else {
                prevButton.classList.remove('carousel__prev--hidden')
            }
            if (this.items[this.currentItem + this.slidesVisible] === undefined){
                nextButton.classList.add('carousel__next--hidden')
            }else{
                nextButton.classList.remove('carousel__next--hidden')
            }
        })
    }

    /**
     * cree la pagination dans le DOM
     */
    createPagination () {
       let pagination = this.createDivWithClass('carousel__pagination')
       let buttons = []
       this.root.appendChild(pagination)
       for (let i = 0; i < (this.items.length - 2 * this.offset); i = i + this.options.slidesToScroll){
           let button = this.createDivWithClass('carousel__pagination__button')
           button.addEventListener('click', () => this.gotoItem(i + this.offset))
           pagination.appendChild(button)
           buttons.push(button)
        }
        this.onMove(index => {
            let activeButton = buttons[Math.floor((index - this.offset) / this.options.slidesToScroll)]
            if (activeButton) {
                buttons.forEach(button => button.classList.remove('carousel__pagination__button--active'))
                activeButton.classList.add('carousel__pagination__button--active')
            }
        })
    }


    next () {
        this.gotoItem(this.currentItem + this.slidesToScroll)
    }
 
    prev () {
        this.gotoItem(this.currentItem - this.slidesToScroll)
    }




    /**
     * Depalce le carousel vers l'element cible
     *@param {number} index
     *@param {boolean} [animation = true]
     */
    gotoItem (index, animation = true){
        if(index < 0){
            if (this.options.loop){
                index = this.items.length - this.options.slidesVisible
            } else {

                return

            }
            
        }else if(index >= this.items.length || (this.items[this.currentItem + this.options.slidesVisible] === undefined && index >
            this.currentItem)) {

                if (this.options.loop){
                    index = 0
                } else {
    
                    return
    
                }
            
        }
        let translateX = index * -100 / this.items.length
        if (animation == false) {
            this.container.style.transition = 'none'
        }
        this.container.style.transform = 'translate3d(' + translateX + '%,0, 0)'
        this.container.offsetHeight // force repaint
        if (animation == false) {
            this.container.style.transition = ''
        }
        this.currentItem = index
        this.moveCallbacks.forEach(cb => cb(index))
    }

    /**
     * Deplace le container pour donner l'impression d'un slide infinie
     */
    resetInfinite () {
        if (this.currentItem <= this.options.slidesToScroll) {
            this.gotoItem(this.currentItem + (this.items.length - 2 * this.offset), false)
        } else if (this.currentItem >= this.items.length - this.offset) {
            this.gotoItem(this.currentItem - (this.items.length - 2 * this.offset), false)
        }
    }

    /**
     * 
     * @param {moveCallback} cb 
     */
    onMove (cb) {
        this.moveCallbacks.push(cb)
    }


    onWindowResize () {
        let mobile = window.innerWidth < 800
        if (mobile !== this.isMobile){
            this.isMobile = mobile
            this.setStyle()
            this.moveCallbacks.forEach(cb => cb(this.currentItem))
        }
    }


    /**
     * 
     * @param {string} className 
     * @returns {HTMLElement}
     */
    createDivWithClass(className) {
        let div = document.createElement('div')
        div.setAttribute('class', className)
        return div

    }

    /**
     * 
     *@return {number}
     */
    get slidesToScroll(){
        return this.isMobile ? 1 : this.options.slidesToScroll
    }

    /**
     * 
     *@return {number}
     */
    get slidesVisible(){
        return this.isMobile ? 1 : this.options.slidesVisible
    }
}

let onReady = function () {

    new Carousel(document.querySelector('#carousel1'), {
        slidesVisible: 3,
        slidesToScroll: 1, 
        loop: true,
        pagination: true
    })
}

if (document.readyState !== 'loading'){
    onReady()
}

document.addEventListener('DOMContentLoaded', onReady)

