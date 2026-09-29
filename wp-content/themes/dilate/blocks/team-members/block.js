document.addEventListener("DOMContentLoaded", function(){

const popup = document.querySelector('.member-popup');

const popupImg = popup.querySelector('.popup-image img');
const popupName = popup.querySelector('.popup-name');
const popupDesignation = popup.querySelector('.popup-designation');
const popupBio = popup.querySelector('.popup-bio');
const popupLinkedin = popup.querySelector('.popup-linkedin');

document.querySelectorAll('.open-member-popup').forEach(btn => {

btn.addEventListener('click', function(e){

e.preventDefault();

popupImg.src = this.dataset.image;
popupName.textContent = this.dataset.name;
popupDesignation.textContent = this.dataset.designation;
popupBio.innerHTML = this.dataset.bio;
popupLinkedin.href = this.dataset.linkedin;

popup.classList.remove('hidden');
document.body.style.overflow = 'hidden';
document.documentElement.style.overflow = 'hidden';

setTimeout(()=>{
popup.classList.add('active');
},10);

});

});

function closePopup(){

popup.classList.remove('active');
document.body.style.overflow = '';
document.documentElement.style.overflow = '';

setTimeout(()=>{
popup.classList.add('hidden');
},800);

}

const popupClose = document.querySelector('.popup-close');
if (popupClose) {
    popupClose.addEventListener('click', closePopup);
}

const popupOverlay = document.querySelector('.popup-overlay');
if (popupOverlay) {
    popupOverlay.addEventListener('click', closePopup);
}

});