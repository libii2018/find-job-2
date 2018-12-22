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
