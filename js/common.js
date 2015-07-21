(function(){
	$.fn.exists = function () {
		return this.length !== 0;
	};

	window.vl = {};

	var classNames = {
		newRoundContainer: 'vl-new-round-container',
		newRoundItem: 'vl-new-round__item',
		itemUserChance: 'vl-new-round__item-user-chance',
		loader: 'vl-loader',
		countRatesContainer: 'vl-count-rates-container',
		frameContainer: 'vl-frame-container',
		scrollbar: 'vl-scrollbar',

		animation: 'vl-animation',

		shadowAnimateContainer: 'vl-shadow-animate-container',
		progressLostInfoContainer: 'vl-progress-lost__info-container',
		progressLostInfoImage: 'vl-progress-lost__info-image',
		progressLostInfoBet: 'vl-progress-lost__info-bet',
		progressLostInfoSkins: 'vl-progress-lost__info-skins',
		progressLostInfoTotal: 'vl-progress-lost__info-total',

		progressLostContainer: 'vl-progress-lost-container',

		cloneContainer: 'vl-clone-container',

		displayNone: '_display_none',

		light: 'light'
	};

	var ids = {};

	var buildSelectors = function (selectors, source, characterToPrependWith) {
		$.each(source, function (propertyName, value) {
			selectors[propertyName] = characterToPrependWith + value;
		});
	};

	vl.buildSelectors = function (classNames, ids) {
		var selectors = {};
		if (classNames) {
			buildSelectors(selectors, classNames, ".");
		}
		if (ids) {
			buildSelectors(selectors, ids, "#");
		}
		return selectors;
	};

	var selectors = vl.buildSelectors(classNames, ids);

	var $itemUserChance,
		$newRoundItem,
		$newRoundContainer,
		$loader,
		$countRatesContainer,
		$frameContainer,
		$scrollbar,

		$progressLostInfoContainer,
		$progressLostInfoImage,
		$progressLostInfoBet,
		$progressLostInfoSkins,
		$progressLostInfoTotal,
		$shadowAnimateContainer,
		$progressLostContainer,

		setIntervalProgress,
		setIntervalNewRoundItems,
		setIntervalNewRate,
		setProgress = 0;

	$(function(){
		$itemUserChance = $(selectors.itemUserChance);
		$newRoundItem = $(selectors.newRoundItem);
		$newRoundContainer = $(selectors.newRoundContainer);
		$loader = $(selectors.loader);
		$countRatesContainer = $(selectors.countRatesContainer);
		$frameContainer = $(selectors.frameContainer);
		$scrollbar = $(selectors.scrollbar);

		$progressLostInfoContainer = $(selectors.progressLostInfoContainer);
		$progressLostInfoImage = $(selectors.progressLostInfoImage);
		$progressLostInfoBet = $(selectors.progressLostInfoBet);
		$progressLostInfoSkins = $(selectors.progressLostInfoSkins);
		$progressLostInfoTotal = $(selectors.progressLostInfoTotal);
		$shadowAnimateContainer = $(selectors.shadowAnimateContainer);

		$progressLostContainer = $(selectors.progressLostContainer);

		if ($itemUserChance.exists()) {
			$itemUserChance.each(setUserChangeLight);
		}

		if ($newRoundItem.exists() && $newRoundContainer.exists()) {
			//vl.setTimerNewRoundItems();
		}

		if ($loader.exists()) {
			//vl.setTimerProgress(60);
		}

		if ($frameContainer.exists()) {
			$frameContainer.sly({
				horizontal: 1,
				itemNav: 'forceCentered',
				speed: 300,
				mouseDragging: 1,
				touchDragging: 1,
				scrollBar: $scrollbar,
				scrollBy: 1,
				dragHandle: 1,
				dynamicHandle: 1,
				clickBar: 1
			});
		}

		if ($progressLostInfoContainer.exists()) {
			vl.setTimerNewRate();
		}
	});

	var newRate = function() {
		animateProgressLostInfoContainers($progressLostInfoImage, '');
		animateProgressLostInfoContainers($progressLostInfoBet, '$ ' + Math.floor((Math.random() * 5000) + 1));
		animateProgressLostInfoContainers($progressLostInfoSkins, Math.floor((Math.random() * 10) + 1));
		animateProgressLostInfoContainers($progressLostInfoTotal, '$ ' + Math.floor((Math.random() * 9000) + 1));
	};

	var animateProgressLostInfoContainers = function($_container, text) {
		var $cloneContainer = $_container.find(selectors.cloneContainer).clone();
		$cloneContainer.css({marginTop: '-81px', opacity: 0});
		$cloneContainer.find('h1').text(text);
		$_container.prepend($cloneContainer);
		$cloneContainer.animate({
			marginTop: 0,
			opacity: 1
		}, {
			duration: 700
		});
		$_container.find(selectors.cloneContainer).last().animate({
			opacity: 0
		}, {
			duration: 500,
			complete: function() {
				$_container.find(selectors.cloneContainer).last().remove();
			}
		});
	};

	var setUserChangeLight = function() {
		var $this = $(this);
		var dataCountChance = $this.data('count-chance');
		$this.find('li').removeClass(classNames.light);
		for (var i = 0; i < dataCountChance; i++) {
			$this.find('li').eq(i).addClass(classNames.light);
		}
	};

	var animateNewRoundItems = function() {
		var $cloneNewRoundItem = $newRoundContainer.find(selectors.newRoundItem).last().clone();
		$cloneNewRoundItem.css({marginTop: '-82px'});
		$newRoundContainer.prepend($cloneNewRoundItem);
		$cloneNewRoundItem.animate({
			marginTop: 0
		}, {
			duration: 1000,
			complete: function() {
				$newRoundContainer.find(selectors.newRoundItem).last().remove();
			}
		});
	};

	var clearProgress = function() {
		$(".vl-animate-75-100-b, .vl-animate-50-75-b, .vl-animate-25-50-b, .vl-animate-0-25-b").removeAttr('style');
		setProgress = 0;
	};

	var renderProgress = function(progress) {
		var angle;
		var $span = $('<span/>', {text: progress / 2}).css({marginTop: '-115px', opacity: 0});
		progress = Math.floor(progress);
		if (progress < 25) {
			angle = -90 + (progress/100)*360;
			$(".vl-animate-0-25-b").css({transform: 'rotate(' + angle + 'deg)'});
		} else if (progress >= 25 && progress < 50) {
			angle = -90 + ((progress - 25) / 100) * 360;
			$(".vl-animate-0-25-b").css({transform: 'rotate(0deg)'});
			$(".vl-animate-25-50-b").css({transform: 'rotate(' + angle + 'deg)'});
		} else if (progress >= 50 && progress < 75) {
			angle = -90 + ((progress - 50) / 100) * 360;
			$(".vl-animate-25-50-b, .vl-animate-0-25-b").css({transform: 'rotate(0deg)'});
			$(".vl-animate-50-75-b").css({transform: 'rotate(' + angle + 'deg)'});
		} else if (progress >= 75 && progress <= 100) {
			angle = -90 + ((progress - 75) / 100) * 360;
			$(".vl-animate-50-75-b, .vl-animate-25-50-b, .vl-animate-0-25-b").css({transform: 'rotate(0deg)'});
			$(".vl-animate-75-100-b").css({transform: 'rotate(' + angle + 'deg)'});
		}

		$countRatesContainer.prepend($span);
		$span.animate({
			marginTop: 0,
			opacity: 1
		}, {
			duration: 200,
			step: function (now, fx) {
				//$countRatesContainer.find('span').css({marginTop: now + 'px'});
			},
			complete: function () {
				$countRatesContainer.find('span').last().remove();
			}
		});
	};

	vl.setTimerProgress = function(progress) {
		var i = setProgress;
		setIntervalProgress = setInterval(function (){
			if (i >= progress) {
				return false;
			}
			i++;
			if (setProgress > 99) {
				i = 0;
				clearProgress();
				return false;
			} else {
				setProgress = i * 2;
				renderProgress(setProgress);
			}
		}, 100);
	};

	vl.setTimerNewRoundItems = function() {
		setIntervalNewRoundItems = setInterval(function (){
			animateNewRoundItems();
		}, 5000);
	};

	vl.setTimerNewRate = function() {
		setIntervalNewRate = setInterval(function (){
			newRate();
		}, 2500);
	};

	vl.reel = function() {
		clearInterval(setIntervalProgress);
		clearInterval(setIntervalNewRoundItems);
		clearInterval(setIntervalNewRate);
		$progressLostInfoBet.addClass(classNames.displayNone);
		$progressLostInfoSkins.addClass(classNames.displayNone);
		$progressLostInfoTotal.addClass(classNames.displayNone);
		for (var i = 0; i < 7; i++) {
			var $cloneProgressLostInfoImage = $progressLostInfoImage.first().clone();
			$progressLostInfoContainer.prepend($cloneProgressLostInfoImage.removeAttr('style'));
		}
		clearProgress();
		$progressLostInfoContainer.find(selectors.cloneContainer).removeAttr('style');
		//$progressLostInfoContainer.find(selectors.progressLostInfoImage).each(function(){
		//	if ($(this).find(selectors.cloneContainer).length > 1) {
		//		$(this).find(selectors.cloneContainer).last().remove();
		//	}
		//});
		$countRatesContainer.find('span').text('');
		$progressLostContainer.removeClass(classNames.animation);
		$progressLostInfoContainer.addClass(classNames.animation);
	};

	vl.stopReel = function() {
		var i = 5;
		var setIntervalStopReel = setInterval(function (){
			if (i < 1) {
				$progressLostInfoContainer.removeClass(classNames.animation);
				clearInterval(setIntervalStopReel);
			} else {
				$progressLostInfoContainer.removeClass('vl-speed-animation-' + (i+1));
				$progressLostInfoContainer.addClass('vl-speed-animation-' + i);
				i--;
			}
		}, 1000);
	};
})();