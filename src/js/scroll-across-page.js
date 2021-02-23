const upButtonRef = document.querySelector('.up-button');
const downButtonRef = document.querySelector('.down-button');
const buttonContainerRef = document.querySelector('.button-container');

function scrollAcrossPage() {
    upButtonRef.addEventListener('click', () => {
        window.scrollTo({
            top: -document.documentElement.offsetHeight,
        })
    });
    downButtonRef.addEventListener('click', () => {
        window.scrollTo({
            top: document.documentElement.offsetHeight,
        })
    });
}

export { scrollAcrossPage, buttonContainerRef };