import searchFormTemplate from '../templates/search-form.hbs';
import galleryListTemplate from '../templates/gallery-list.hbs';
import imageBoxTemplate from '../templates/image-box.hbs';
import { scrollAcrossPage, buttonContainerRef } from './scroll-across-page.js';
import { errorOption, errorOptionNotFound, errorServer } from './error-note.js';
import { error } from '@pnotify/core/dist/PNotify.js';
import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';


class ImageSearcher {
    constructor() {
        this.key = `20337553-a297616fd4599e165a4d47360`,
        this.pageNumber = 1,
        this.refs = {
            bodyRef: document.querySelector('body'),
            sectionRef: document.querySelector('.section'),
            buttonRef: document.getElementById('load-button')
        }
    }

    imageResultRequest(query) {
        return fetch(`https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${query}&page=${this.pageNumber}&per_page=12&key=${this.key}`)
            .then(response => response.json())
            .then(data => data.hits)
            .then(img => {
                if (img.length > 11) {
                    this.createImageList(img);
                    this.refs.buttonRef.classList.remove('hide-button');
                    buttonContainerRef.classList.remove('hide-button');
                    window.scrollTo({
                        top: document.documentElement.offsetHeight
                    });
                } else if (img.length === 0) {
                    error(errorOptionNotFound);
                    this.refs.buttonRef.classList.add('hide-button');
                    buttonContainerRef.classList.add('hide-button');
                } else {
                    this.createImageList(img);
                    window.scrollTo({
                        top: document.documentElement.offsetHeight
                    });
                }
            })
            .catch(() => error(errorServer));
    }

    createForm() {
        const resultedFormTemplate = searchFormTemplate();
        this.refs.bodyRef.insertAdjacentHTML('afterbegin', resultedFormTemplate);
    }

    createListTag() {
        const resultedListTemplate = galleryListTemplate();
        this.refs.sectionRef.insertAdjacentHTML('beforeend', resultedListTemplate);
    }

    createImageList(img) {
        const resultedMarkup = img.map(item => {
            const { webformatURL, tags, largeImageURL, likes, views, comments, downloads } = item;
            const restructedObj = { webformatURL, tags, largeImageURL, likes, views, comments, downloads };
            return imageBoxTemplate(restructedObj);
        })

        const galleryRef = document.querySelector('.gallery');
        galleryRef.insertAdjacentHTML('beforeend', resultedMarkup.join('').trim());
    }

    searchedByQuery() {
        const inputRef = document.querySelector('#search-form > input');
        const formRef = document.querySelector('#search-form');
        const galleryRef = document.querySelector('.gallery');
        scrollAcrossPage();

        formRef.addEventListener('submit', event => {
            event.preventDefault();
            if (inputRef.value === '') {
                error(errorOption);
                galleryRef.innerHTML = '';
                this.pageNumber = 1;
                this.refs.buttonRef.classList.add('hide-button');
                buttonContainerRef.classList.add('hide-button');
                return;
            }
            galleryRef.innerHTML = '';
            this.pageNumber = 1;
            this.imageResultRequest(inputRef.value);
        })

        this.refs.buttonRef.addEventListener('click', () => {
            if (inputRef.value === '') {
                error(errorOption);
                galleryRef.innerHTML = '';
                this.pageNumber = 1;
                this.refs.buttonRef.classList.add('hide-button');
                buttonContainerRef.classList.add('hide-button');
                return;
            }
            this.pageNumber += 1;
            this.imageResultRequest(inputRef.value);
        })
    }

    openBigImage() {
        this.refs.bodyRef.addEventListener('click', event => {
            if (event.target.nodeName === 'IMG') {
                const modal = basicLightbox.create(
                    `<img  src=${event.target.dataset.largeUrl} alt="${event.target.alt}">`);
                modal.show();
            }
        })
    }

    runSearch() { 
        this.createForm();
        this.createListTag();
        this.searchedByQuery();
        this.openBigImage();
    }
}

const searchByQuery = new ImageSearcher;

searchByQuery.runSearch();
