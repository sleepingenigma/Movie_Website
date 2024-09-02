gsap.from('.navbar',{duration : 1 , y : '-100%' , ease: 'bounce'});
gsap.from('.logo',{duration : 1 , opacity : 0 , ease: 'bounce'});
gsap.from('.hritems',{duration : 2 , delay : 0.5 , opacity : 0 ,x:'-100%', ease: 'bounce' , stagger : 0.2});


const menubar = document.getElementsByClassName('unhovered')[0];

menubar.addEventListener('mouseover', () => {
    menubar.classList.remove("unhovered");
    menubar.classList.add("menubar");
});

menubar.addEventListener('mouseout', () => {
    menubar.classList.remove("menubar");
    menubar.classList.add("unhovered");
});