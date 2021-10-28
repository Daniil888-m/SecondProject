// ;
function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});

/* Проверка на пользователя с мобильным */
var isMobile = {
	Android: function () {
		return navigator.userAgent.match(/Android/i);
	},
	BlackBerry: function () {
		return navigator.userAgent.match(/BlackBerry/i);
	},
	iOS: function () {
		return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	},
	Opera: function () {
		return navigator.userAgent.match(/Opera Mini/i);
	},
	Windows: function () {
		return navigator.userAgent.match(/IEMobile/i);
	},
	any: function () {
		return (
			isMobile.Android()
			|| isMobile.BlackBerry()
			|| isMobile.iOS()
			|| isMobile.Opera()
			|| isMobile.Windows()
		);
	}
};

if (isMobile.any()) {
	document.body.classList.add('_touch');
	let menuArrows = document.querySelectorAll('.menu__arrow');
	if (menuArrows.length > 0) {
		for (let i = 0; i < menuArrows.length; i++) {
			const menuArrow = menuArrows[i];
			menuArrow.addEventListener('click', function (e) {
				menuArrow.parentElement.classList.toggle('_active')
			})
		}
	}

} else {
	document.body.classList.add('_pc')
}

function detectIEEdge() {
	var ua = window.navigator.userAgent;

	var msie = ua.indexOf('MSIE ');
	if (msie > 0) {
		// IE 10 or older => return version number
		return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}

	var trident = ua.indexOf('Trident/');
	if (trident > 0) {
		// IE 11 => return version number
		var rv = ua.indexOf('rv:');
		return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	}

	var edge = ua.indexOf('Edge/');
	if (edge > 0) {
		// Edge => return version number
		return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	}

	// other browser
	return false;
}

const isIeEdge = detectIEEdge();

if (isIeEdge) {
	function ibg() {
		let ibgmages = document.querySelectorAll('._ibg');
		for (let i = 0; i < ibgmages.length; i++) {
			console.log('ggg');

			ibgmages[i].classList.add('ibg');
		}

		let ibg = document.querySelectorAll(".ibg");
		for (var i = 0; i < ibg.length; i++) {
			if (ibg[i].querySelector('img')) {
				ibg[i].style.backgroundImage = 'url(' + ibg[i].querySelector('img').getAttribute('src') + ')';
			}
		}


	}
	ibg();
};


const menuBody = document.querySelector('.nav__list');

const iconMenu = document.querySelector('.icon-menu');
if (iconMenu) {

	iconMenu.addEventListener('click', function () {
		document.body.classList.toggle('_lock')
		iconMenu.classList.toggle('_active');
		menuBody.classList.toggle('_active');
	})
}
console.log(menuBody);


const searchLink = document.querySelector('[search-link]');
const searchHeader = document.querySelector('.header-search');
const searchHeaderClose = searchHeader.querySelector('.header-search__close');

const headerSearchForm = searchHeader.querySelector('.header-search__form')
console.log(searchHeaderClose);

searchLink.addEventListener('click', function (e) {
	e.preventDefault();
	searchHeader.classList.toggle('_active');
	return false;
});

searchHeaderClose.addEventListener('click', function () {
	searchHeader.classList.remove('_active');
});

searchHeader.addEventListener('click', function (e) {
	if (e.target == searchHeader) {
		searchHeader.classList.remove('_active');
	}
});

;
// Dynamic Adapt v.1
// HTML data-da="where(uniq class name),when(breakpoint),position(digi)"
// e.x. data-da=".item,992,2"
// Andrikanych Yevhen 2020
// https://www.youtube.com/c/freelancerlifestyle

"use strict";

function DynamicAdapt(type) {
	this.type = type;
}

DynamicAdapt.prototype.init = function () {
	const _this = this;
	// массив объектов
	this.оbjects = [];
	this.daClassname = "_dynamic_adapt_";
	// массив DOM-элементов
	this.nodes = document.querySelectorAll("[data-da]");

	// наполнение оbjects объктами
	for (let i = 0; i < this.nodes.length; i++) {
		const node = this.nodes[i];
		const data = node.dataset.da.trim();
		const dataArray = data.split(",");
		const оbject = {};
		оbject.element = node;
		оbject.parent = node.parentNode;
		оbject.destination = document.querySelector(dataArray[0].trim());
		оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
		оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
		оbject.index = this.indexInParent(оbject.parent, оbject.element);
		this.оbjects.push(оbject);
	}

	this.arraySort(this.оbjects);

	// массив уникальных медиа-запросов
	this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
		return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
	}, this);
	this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
		return Array.prototype.indexOf.call(self, item) === index;
	});

	// навешивание слушателя на медиа-запрос
	// и вызов обработчика при первом запуске
	for (let i = 0; i < this.mediaQueries.length; i++) {
		const media = this.mediaQueries[i];
		const mediaSplit = String.prototype.split.call(media, ',');
		const matchMedia = window.matchMedia(mediaSplit[0]);
		const mediaBreakpoint = mediaSplit[1];

		// массив объектов с подходящим брейкпоинтом
		const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
			return item.breakpoint === mediaBreakpoint;
		});
		matchMedia.addListener(function () {
			_this.mediaHandler(matchMedia, оbjectsFilter);
		});
		this.mediaHandler(matchMedia, оbjectsFilter);
	}
};

DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
	if (matchMedia.matches) {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			оbject.index = this.indexInParent(оbject.parent, оbject.element);
			this.moveTo(оbject.place, оbject.element, оbject.destination);
		}
	} else {
		for (let i = 0; i < оbjects.length; i++) {
			const оbject = оbjects[i];
			if (оbject.element.classList.contains(this.daClassname)) {
				this.moveBack(оbject.parent, оbject.element, оbject.index);
			}
		}
	}
};

// Функция перемещения
DynamicAdapt.prototype.moveTo = function (place, element, destination) {
	element.classList.add(this.daClassname);
	if (place === 'last' || place >= destination.children.length) {
		destination.insertAdjacentElement('beforeend', element);
		return;
	}
	if (place === 'first') {
		destination.insertAdjacentElement('afterbegin', element);
		return;
	}
	destination.children[place].insertAdjacentElement('beforebegin', element);
}

// Функция возврата
DynamicAdapt.prototype.moveBack = function (parent, element, index) {
	element.classList.remove(this.daClassname);
	if (parent.children[index] !== undefined) {
		parent.children[index].insertAdjacentElement('beforebegin', element);
	} else {
		parent.insertAdjacentElement('beforeend', element);
	}
}

// Функция получения индекса внутри родителя
DynamicAdapt.prototype.indexInParent = function (parent, element) {
	const array = Array.prototype.slice.call(parent.children);
	return Array.prototype.indexOf.call(array, element);
};

// Функция сортировки массива по breakpoint и place 
// по возрастанию для this.type = min
// по убыванию для this.type = max
DynamicAdapt.prototype.arraySort = function (arr) {
	if (this.type === "min") {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return -1;
				}

				if (a.place === "last" || b.place === "first") {
					return 1;
				}

				return a.place - b.place;
			}

			return a.breakpoint - b.breakpoint;
		});
	} else {
		Array.prototype.sort.call(arr, function (a, b) {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}

				if (a.place === "first" || b.place === "last") {
					return 1;
				}

				if (a.place === "last" || b.place === "first") {
					return -1;
				}

				return b.place - a.place;
			}

			return b.breakpoint - a.breakpoint;
		});
		return;
	}
};

const da = new DynamicAdapt("max");
da.init();;
// Полифилл для метода forEach для NodeList
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}

document.querySelectorAll('.dropdown').forEach(function (dropDownWrapper) {
	const dropDownBtn = dropDownWrapper.querySelector('.dropdown__button');
	const dropDownList = dropDownWrapper.querySelector('.dropdown__list');
	const dropDownListItems = dropDownList.querySelectorAll('.dropdown__item');
	const dropDownInput = dropDownWrapper.querySelector('.dropdown__input_hidden');
	let itemSelected = dropDownList.querySelector('.dropdown__item[selected]');
	console.log(itemSelected);

	if (itemSelected) {
		dropDownBtn.innerText = itemSelected.innerText;
		dropDownInput.value = itemSelected.dataset.value;

	}



	// Клик по кнопке. Открыть/Закрыть select
	dropDownBtn.addEventListener('click', function (e) {
		dropDownList.classList.toggle('dropdown__list_visible');
		this.classList.add('dropdown__button_active');
	});

	// Выбор элемента списка. Запомнить выбранное значение. Закрыть дропдаун
	dropDownListItems.forEach(function (listItem) {
		listItem.addEventListener('click', function (e) {
			e.stopPropagation();
			dropDownBtn.innerText = this.innerText;
			dropDownBtn.focus();
			dropDownInput.value = this.dataset.value;
			dropDownList.classList.remove('dropdown__list_visible');
		});
	});

	// Клик снаружи дропдауна. Закрыть дропдаун
	document.addEventListener('click', function (e) {
		if (e.target !== dropDownBtn) {
			dropDownBtn.classList.remove('dropdown__button_active');
			dropDownList.classList.remove('dropdown__list_visible');
		}
	});

	// Нажатие на Tab или Escape. Закрыть дропдаун
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Tab' || e.key === 'Escape') {
			dropDownBtn.classList.remove('dropdown__button_active');
			dropDownList.classList.remove('dropdown__list_visible');
		}
	});
});

//============================================================================
//tabs

document.addEventListener('DOMContentLoaded', () => {
	const tabs = document.querySelector('.tabs');
	const tabsBtn = document.querySelectorAll('.tabs__btn');
	const tabsContent = document.querySelectorAll('.tabs__content');

	if (tabs) {
		tabs.addEventListener('click', (e) => {
			if (e.target.classList.contains('tabs__btn')) {
				const tabsPath = e.target.dataset.tabsPath;
				tabsBtn.forEach(el => { el.classList.remove('tabs__btn_active') });
				document.querySelector(`[data-tabs-path="${tabsPath}"]`).classList.add('tabs__btn_active');
				tabsHandler(tabsPath);
			}

			if (e.target.classList.contains('tabs__arrow_prev')) {
				let activeBtn = document.querySelector('.tabs__btn_active');
				let activeParent = activeBtn.closest('.tabs__item');
				let previousParent = activeParent.previousElementSibling;

				if (previousParent) {
					let prevActive = previousParent.querySelector('.tabs__btn')
					tabsBtn.forEach(el => { el.classList.remove('tabs__btn_active') });
					prevActive.classList.add('tabs__btn_active');

					let path = prevActive.dataset.tabsPath;
					tabsHandler(path);
				}
			}

			if (e.target.classList.contains('tabs__arrow_next')) {
				let activeBtn = document.querySelector('.tabs__btn_active');
				let activeParent = activeBtn.closest('.tabs__item');
				let nextParent = activeParent.nextElementSibling;

				if (nextParent) {
					let nextActive = nextParent.querySelector('.tabs__btn');
					tabsBtn.forEach(el => { el.classList.remove('tabs__btn_active') });
					nextActive.classList.add('tabs__btn_active');

					let path = nextActive.dataset.tabsPath;
					tabsHandler(path);
				}
			}
		});
	}

	const tabsHandler = (path) => {
		tabsContent.forEach(el => { el.classList.remove('tabs__content_active') });
		document.querySelector(`[data-tabs-target="${path}"]`).classList.add('tabs__content_active');
	};
});

//============================================================================
//stepper

const steppers = document.querySelectorAll('.stepper');

steppers.forEach(function (stepper) {
	const stepperInput = stepper.querySelector('.stepper__input');
	const stepperBtnUp = stepper.querySelector('.stepper__btn_up');
	const stepperBtnDown = stepper.querySelector('.stepper__btn_down');

	let count = stepperInput.value;

	const isNotApple = () => {
		if (!/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			return false;
		}
		return true;
	};

	function allowNumbersOnly(e) {
		var code = (e.which) ? e.which : e.keyCode;
		if (code > 31 && (code < 48 || code > 57)) {
			e.preventDefault();
		}
	}

	stepperInput.addEventListener('keyup', (e) => {
		let self = e.currentTarget;

		if (self.value == '0') {
			self.value = 1;
		}
		count = stepperInput.value;

		//============================================================================
		if (count > parseInt(stepperInput.dataset.max)) {

			self.value = self.dataset.max;
		}
		//============================================================================

		if (isNotApple) {
			self.style.width = `${self.value.length + 1}ex`;
		} else {
			self.style.width = `${self.value.length + 2}ex`;
		}



		if (count == 1) {
			stepperBtnDown.classList.add('stepper__btn_disabled');
		} else {
			stepperBtnDown.classList.remove('stepper__btn_disabled');
		}
	});

	stepperInput.addEventListener('keypress', (e) => {
		allowNumbersOnly(e);
	});

	stepperInput.addEventListener('change', (e) => {
		let self = e.currentTarget;

		if (!self.value) {
			self.value = 1;
		}

		count = stepperInput.value;

		if (count == 1) {
			stepperBtnDown.classList.add('stepper__btn_disabled');
		} else {
			stepperBtnDown.classList.remove('stepper__btn_disabled');
		}
	});

	stepperBtnUp.addEventListener('click', (e) => {
		e.preventDefault();

		count++;
		if (count > parseInt(stepperInput.dataset.max)) {

			count = parseInt(stepperInput.dataset.max);
		}

		if (count == 1) {
			stepperBtnDown.classList.add('stepper__btn_disabled');
		} else {
			stepperBtnDown.classList.remove('stepper__btn_disabled');
		}

		stepperInput.value = count;

		if (isNotApple) {
			stepperInput.style.width = `${stepperInput.value.length + 1}ex`;
		} else {
			stepperInput.style.width = `${stepperInput.value.length + 2}ex`;
		}
	});

	stepperBtnDown.addEventListener('click', (e) => {
		e.preventDefault();

		count--;

		if (count == 1) {
			stepperBtnDown.classList.add('stepper__btn_disabled');
		} else {
			stepperBtnDown.classList.remove('stepper__btn_disabled');
		}

		stepperInput.value = count;

		if (isNotApple) {
			stepperInput.style.width = `${stepperInput.value.length + 1}ex`;
		} else {
			stepperInput.style.width = `${stepperInput.value.length + 2}ex`;
		}
	});

})

//============================================================================
//quantities
const quantities = document.querySelectorAll('.quantity');

quantities.forEach(function (quantity) {
	const quantityInput = quantity.querySelector('.quantity__input');
	const quantityBtnUp = quantity.querySelector('.quantity__btn_up');
	const quantityBtnDown = quantity.querySelector('.quantity__btn_down');

	let count = quantityInput.value;

	const isNotApple = () => {
		if (!/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
			return false;
		}
		return true;
	};

	function allowNumbersOnly(e) {
		var code = (e.which) ? e.which : e.keyCode;
		if (code > 31 && (code < 48 || code > 57)) {
			e.preventDefault();
		}
	}

	quantityInput.addEventListener('keyup', (e) => {
		let self = e.currentTarget;

		if (self.value == '0') {
			self.value = 1;
		}
		count = self.value;


		//============================================================================
		if (count > parseInt(quantityInput.dataset.max)) {
			console.log(count > quantityInput.dataset.max);
			console.log(count);
			console.log(quantityInput.dataset.max);
			console.log(5 > 25);


			self.value = self.dataset.max;
		}
		//============================================================================

		if (isNotApple) {
			self.style.width = `${self.value.length + 1}ex`;
		} else {
			self.style.width = `${self.value.length + 2}ex`;
		}


		if (count == 1) {
			quantityBtnDown.classList.add('quantity__btn_disabled');
		} else {
			quantityBtnDown.classList.remove('quantity__btn_disabled');
		}


	});

	quantityInput.addEventListener('keypress', (e) => {
		allowNumbersOnly(e);

	});

	quantityInput.addEventListener('change', (e) => {
		let self = e.currentTarget;

		if (!self.value) {
			self.value = 1;
		}

		count = quantityInput.value;


		if (count == 1) {
			quantityBtnDown.classList.add('quantity__btn_disabled');
		} else {
			quantityBtnDown.classList.remove('quantity__btn_disabled');
		}
	});

	quantityBtnUp.addEventListener('click', (e) => {
		e.preventDefault();

		count++;
		if (count > parseInt(quantityInput.dataset.max)) {

			count = parseInt(quantityInput.dataset.max);
		}

		if (count == 1) {
			quantityBtnDown.classList.add('quantity__btn_disabled');
		} else {
			quantityBtnDown.classList.remove('quantity__btn_disabled');
		}

		quantityInput.value = count;

		if (isNotApple) {
			quantityInput.style.width = `${quantityInput.value.length + 1}ex`;
		} else {
			quantityInput.style.width = `${quantityInput.value.length + 2}ex`;
		}
	});

	quantityBtnDown.addEventListener('click', (e) => {
		e.preventDefault();

		count--;

		if (count == 1) {
			quantityBtnDown.classList.add('quantity__btn_disabled');
		} else {
			quantityBtnDown.classList.remove('quantity__btn_disabled');
		}

		quantityInput.value = count;

		if (isNotApple) {
			quantityInput.style.width = `${quantityInput.value.length + 1}ex`;
		} else {
			quantityInput.style.width = `${quantityInput.value.length + 2}ex`;
		}
	});

})
;
function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});



$clamp(document.querySelector('.popular-posts__title'), { clamp: 1, useNativeClamp: false });

for (let index = 0; index < document.querySelectorAll('.popular-posts__title').length; index++) {
	let element = document.querySelectorAll('.popular-posts__title')[index];

	$clamp(element, { clamp: 2, });

}

;