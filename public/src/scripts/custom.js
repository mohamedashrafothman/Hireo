/* eslint-disable */
/* ----------------- Start Document ----------------- */
(function($) {
	"use strict";

	$(document).ready(function() {

		/*--------------------------------------------------*/
		/*  AnimateCss plugin
		/*--------------------------------------------------*/
		(function () {
			$.fn.extend({
				animateCss: function (animationName, callback) {
					var animationEnd = (function (el) {
						var animations = {
							animation: 'animationend',
							OAnimation: 'oAnimationEnd',
							MozAnimation: 'mozAnimationEnd',
							WebkitAnimation: 'webkitAnimationEnd'
						};
						for (var t in animations) {
							if (el.style[t] !== undefined) {
								return animations[t];
							}
						}
					})(document.createElement('div'));
					$(this).addClass('animated ' + animationName).one(animationEnd, function () {
						if (typeof callback === 'function') callback();
						$(this).removeClass('animated ' + animationName);
					})
					return this;
				}
			});
		})();

		/*----------------------------------------------------*/
		/*  Prevent Enter on Forms
	    /*----------------------------------------------------*/
		$(document).on("keydown", ":input:not(textarea):not(:submit)", function(e) {
			if (e.keyCode == 13) {
				console.log("prevent pressing enter function");
				e.preventDefault();
				return false;
			}
		});

		/*--------------------------------------------------*/
		/*  Mobile Menu - mmenu.js
		/*--------------------------------------------------*/
		$(function() {
			function mmenuInit() {
				var wi = $(window).width();
				if (wi <= "1099") {
					$(".mmenu-init").remove();
					$("#navigation")
						.clone()
						.addClass("mmenu-init")
						.insertBefore("#navigation")
						.removeAttr("id")
						.removeClass("style-1 style-2")
						.find("ul, div")
						.removeClass("style-1 style-2 mega-menu mega-menu-content mega-menu-section")
						.removeAttr("id");
					$(".mmenu-init")
						.find("ul")
						.addClass("mm-listview");
					$(".mmenu-init")
						.find(".mobile-styles .mm-listview")
						.unwrap();

					$(".mmenu-init").mmenu(
						{
							counters: true
						},
						{
							// configuration
							offCanvas: {
								pageNodetype: "#wrapper"
							}
						}
					);

					var mmenuAPI = $(".mmenu-init").data("mmenu");
					var $icon = $(".mmenu-trigger .hamburger");

					$(".mmenu-trigger").on("click", function() {
						mmenuAPI.open();
					});
				}
				$(".mm-next").addClass("mm-fullsubopen");
			}
			mmenuInit();
			$(window).resize(function() {
				mmenuInit();
			});
		});

		/*--------------------------------------------------*/
		/*  Sticky Header
		/*--------------------------------------------------*/
		function stickyHeader() {
			$(window).on("scroll load", function() {
				if ($(window).width() < "1099") {
					$("#header-container").removeClass("cloned");
				}

				if ($(window).width() > "1099") {
					// CSS adjustment
					$("#header-container").css({
						position: "fixed"
					});

					var headerOffset = $("#header-container").height();

					if ($(window).scrollTop() >= headerOffset) {
						$("#header-container").addClass("cloned");
						$(".wrapper-with-transparent-header #header-container")
							.addClass("cloned")
							.removeClass("transparent-header unsticky");
					} else {
						$("#header-container").removeClass("cloned");
						$(".wrapper-with-transparent-header #header-container")
							.addClass("transparent-header unsticky")
							.removeClass("cloned");
					}

					// Sticky Logo
					var transparentLogo = $("#header-container #logo img").attr("data-transparent-logo");
					var stickyLogo = $("#header-container #logo img").attr("data-sticky-logo");

					if ($(".wrapper-with-transparent-header #header-container").hasClass("cloned")) {
						$("#header-container.cloned #logo img").attr("src", stickyLogo);
					}

					if ($(".wrapper-with-transparent-header #header-container").hasClass("transparent-header")) {
						$("#header-container #logo img").attr("src", transparentLogo);
					}

					$(window).on("load resize", function() {
						var headerOffset = $("#header-container").height();
						$("#wrapper").css({ "padding-top": headerOffset });
					});
				}
			});
		}

		// Sticky Header Init
		stickyHeader();

		/*--------------------------------------------------*/
		/*  Transparent Header Spacer Adjustment
		/*--------------------------------------------------*/
		$(window).on("load resize", function() {
			var transparentHeaderHeight = $(".transparent-header").outerHeight();
			$(".transparent-header-spacer").css({
				height: transparentHeaderHeight
			});
		});

		/*----------------------------------------------------*/
		/*  Back to Top
	/*----------------------------------------------------*/

		// Button
		function backToTop() {
			$("body").append('<div id="backtotop"><a href="#"></a></div>');
		}
		backToTop();

		// Showing Button
		var pxShow = 600; // height on which the button will show
		var scrollSpeed = 500; // how slow / fast you want the button to scroll to top.

		$(window).scroll(function() {
			if ($(window).scrollTop() >= pxShow) {
				$("#backtotop").addClass("visible");
			} else {
				$("#backtotop").removeClass("visible");
			}
		});

		$("#backtotop a").on("click", function() {
			$("html, body").animate({ scrollTop: 0 }, scrollSpeed);
			return false;
		});

		/*--------------------------------------------------*/
		/*  Ripple Effect
		/*--------------------------------------------------*/
		$(".ripple-effect, .ripple-effect-dark").on("click", function(e) {
			var rippleDiv = $('<span class="ripple-overlay">'),
				rippleOffset = $(this).offset(),
				rippleY = e.pageY - rippleOffset.top,
				rippleX = e.pageX - rippleOffset.left;

			rippleDiv
				.css({
					top: rippleY - rippleDiv.height() / 2,
					left: rippleX - rippleDiv.width() / 2
					// background: $(this).data("ripple-color");
				})
				.appendTo($(this));

			window.setTimeout(function() {
				rippleDiv.remove();
			}, 800);
		});

		/*--------------------------------------------------*/
		/*  Interactive Effects
		/*--------------------------------------------------*/
		$(".switch, .radio").each(function() {
			var intElem = $(this);
			intElem.on("click", function() {
				intElem.addClass("interactive-effect");
				setTimeout(function() {
					intElem.removeClass("interactive-effect");
				}, 400);
			});
		});

		/*--------------------------------------------------*/
		/*  Sliding Button Icon
		/*--------------------------------------------------*/
		$(window).on("load", function() {
			$(".button.button-sliding-icon")
				.not(".task-listing .button.button-sliding-icon")
				.each(function() {
					var buttonWidth = $(this).outerWidth() + 30;
					$(this).css("width", buttonWidth);
				});
		});

		/*--------------------------------------------------*/
		/*  Sliding Button Icon
		/*--------------------------------------------------*/
		var $bookmark_buttons = $(".bookmark-icon, .bookmark-button, .bookmark-delete");
		$bookmark_buttons.each(function (index, item) {
			$(item).on("click", function (e) {
				e.preventDefault();
				$.ajax({
					url: $(e.target).closest("form").attr("action"),
					type: $(e.target).closest("form").attr("method"),
					dataType: "json",
					contentType: "json",
					data: { CSRF: $('meta[name="csrf-token"]').attr("content") },
					headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
					success: function (res) {
						var $target = $(item);
						if ($target.hasClass("bookmark-delete")) {
							$target.closest("li").animateCss("fadeOut faster", function () {
								var $container;
								var $more_button;
								if (!res.length) {
									$container = $target.closest("li").siblings(".no-data");
									$more_button = $container.closest(".content").siblings(".headline").find(".button");
								}
								$target.closest("li").remove();
								if (!res.length) {
									console.log($container);
									$container.find(".single-right-button").removeClass("single-right-button");
									$container.css({ "display": "flex" }).animateCss("fadeIn faster");
									$more_button.css({ "display": "none" });
								}
							});
						}

						$target.toggleClass("bookmarked");

						Snackbar.show({
							text: `${($target.hasClass("bookmarked")) ? "Added to" : "Removed from"} your bookmarks list successfully!`,
							pos: "bottom-center",
							duration: 3000,
							textColor: "#fff",
							backgroundColor: "#383838"
						});
					},
					error: function(err) {
						Snackbar.show({
							text: `Error has been occurred, please try again in a few seconds.`,
							pos: "bottom-center",
							duration: 5000,
							textColor: "#fff",
							backgroundColor: "#383838"
						});
						console.log(err);
					}
				});

			});
		});

		/*----------------------------------------------------*/
		/*  Notifications Boxes
		/*----------------------------------------------------*/
		$("a.close")
			.removeAttr("href")
			.on("click", function() {
				function slideFade(elem) {
					var fadeOut = { opacity: 0, transition: "opacity 0.5s" };
					elem.css(fadeOut).slideUp();
				}
				slideFade($(this).parent());
			});

		/*--------------------------------------------------*/
		/*  Notification Dropdowns
		/*--------------------------------------------------*/
		$(".header-notifications").each(function() {
			var userMenu = $(this);
			var userMenuTrigger = $(this).find(".header-notifications-trigger a");

			$(userMenuTrigger).on("click", function(event) {
				event.preventDefault();

				if (
					$(this)
						.closest(".header-notifications")
						.is(".active")
				) {
					close_user_dropdown();
				} else {
					close_user_dropdown();
					userMenu.addClass("active");
				}
			});
		});

		// Closing function
		function close_user_dropdown() {
			$(".header-notifications").removeClass("active");
		}

		// Closes notification dropdown on click outside the conatainer
		var mouse_is_inside = false;

		$(".header-notifications").on("mouseenter", function() {
			mouse_is_inside = true;
		});
		$(".header-notifications").on("mouseleave", function() {
			mouse_is_inside = false;
		});

		$("body").mouseup(function() {
			if (!mouse_is_inside) close_user_dropdown();
		});

		// Close with ESC
		$(document).keyup(function(e) {
			if (e.keyCode == 27) {
				close_user_dropdown();
			}
		});

		/*--------------------------------------------------*/
		/*  User Status Switch
		/*--------------------------------------------------*/
		// if ($(".status-switch label.user-invisible").hasClass("current-status")) {
		// 	$(".status-indicator").addClass("right");
		// }

		// $(".status-switch label.user-invisible").on("click", function() {
		// 	$(".status-indicator").addClass("right");
		// 	$(".status-switch label").removeClass("current-status");
		// 	$(".user-invisible").addClass("current-status");
		// });

		// $(".status-switch label.user-online").on("click", function() {
		// 	$(".status-indicator").removeClass("right");
		// 	$(".status-switch label").removeClass("current-status");
		// 	$(".user-online").addClass("current-status");
		// });

		/*--------------------------------------------------*/
		/*  Full Screen Page Scripts
		/*--------------------------------------------------*/

		// Wrapper Height (window height - header height)
		function wrapperHeight() {
			var headerHeight = $("#header-container").outerHeight();
			var windowHeight = $(window).outerHeight() - headerHeight;
			$(".full-page-content-container, .dashboard-content-container, .dashboard-sidebar-inner, .dashboard-container, .full-page-container").css({ height: windowHeight });
			$(".dashboard-content-inner").css({ "min-height": windowHeight });
		}

		// Enabling Scrollbar
		function fullPageScrollbar() {
			$(".full-page-sidebar-inner, .dashboard-sidebar-inner, .tags-inner, .message-content-inner").each(function() {
				var headerHeight = $("#header-container").outerHeight();
				var windowHeight = $(window).outerHeight() - headerHeight;
				var sidebarContainerHeight = $(this)
					.find(".sidebar-container, .dashboard-nav-container, .tags-container, .message-content")
					.outerHeight();

				// Enables scrollbar if sidebar is higher than wrapper
				if (sidebarContainerHeight > windowHeight) {
					$(this).css({ height: $(this).attr("data-inner-height") ? $(this).attr("data-inner-height") : windowHeight });
				} else {
					$(this)
						.find(".simplebar-track")
						.hide();
				}
			});
		}

		// Init
		$(window).on("load resize", function() {
			wrapperHeight();
			fullPageScrollbar();
		});

		// Sliding Sidebar
		$(".enable-filters-button").on("click", function() {
			$(".full-page-sidebar").toggleClass("enabled-sidebar");
			$(this).toggleClass("active");
			$(".filter-button-tooltip").removeClass("tooltip-visible");
		});

		/*  Enable Filters Button Tooltip */
		$(window).on("load", function() {
			$(".filter-button-tooltip")
				.css({
					left: $(".enable-filters-button").outerWidth() + 48
				})
				.addClass("tooltip-visible");
		});

		// Avatar Switcher
		function avatarSwitcher() {
			var readURL = function (input, event) {
				console.log(event);
				var maxSize = 1024 * 1024 * $(input).data("file-size");
				if (input.files[0].size >= maxSize) {
					Snackbar.show({
						text: `Make sure to upload avatar image with max size ${$(input).data("file-size")}MB`,
						pos: 'bottom-left',
						showAction: false,
						actionText: "Dismiss",
						duration: 10000,
						textColor: '#fff',
						backgroundColor: '#383838'
					});
					$(input).val(null);
					event.preventDefault();
					return false;
				} else {
					if (input.files && input.files[0]) {
						var reader = new FileReader();

						reader.onload = function(e) {
							$(".profile-pic").attr("src", e.target.result);
						};

						reader.readAsDataURL(input.files[0]);
					}
				}
			};

			$(".file-upload").on("change", function (e) {
				readURL(this, e);
			});

			$(".upload-button").on("click", function() {
				$(".file-upload").click();
			});
		}
		avatarSwitcher();

		/*----------------------------------------------------*/
		/* Dashboard Scripts
		/*----------------------------------------------------*/

		// Dashboard Nav Submenus
		$(".dashboard-nav ul li a").on("click", function(e) {
			if (
				$(this)
					.closest("li")
					.children("ul").length
			) {
				if (
					$(this)
						.closest("li")
						.is(".active-submenu")
				) {
					$(".dashboard-nav ul li").removeClass("active-submenu");
				} else {
					$(".dashboard-nav ul li").removeClass("active-submenu");
					$(this)
						.parent("li")
						.addClass("active-submenu");
				}
				e.preventDefault();
			}
		});

		// Responsive Dashbaord Nav Trigger
		$(".dashboard-responsive-nav-trigger").on("click", function(e) {
			e.preventDefault();
			$(this).toggleClass("active");

			var dashboardNavContainer = $("body").find(".dashboard-nav");

			if ($(this).hasClass("active")) {
				$(dashboardNavContainer).addClass("active");
			} else {
				$(dashboardNavContainer).removeClass("active");
			}

			$(".dashboard-responsive-nav-trigger .hamburger").toggleClass("is-active");
		});

		// Fun Facts
		function funFacts() {
			/*jslint bitwise: true */
			function hexToRgbA(hex) {
				var c;
				if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
					c = hex.substring(1).split("");
					if (c.length == 3) {
						c = [c[0], c[0], c[1], c[1], c[2], c[2]];
					}
					c = "0x" + c.join("");
					return "rgba(" + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") + ",0.07)";
				}
			}

			$(".fun-fact").each(function() {
				var factColor = $(this).attr("data-fun-fact-color");

				if (factColor !== undefined) {
					$(this)
						.find(".fun-fact-icon")
						.css("background-color", hexToRgbA(factColor));
					$(this)
						.find("i")
						.css("color", factColor);
				}
			});
		}
		funFacts();

		// Notes & Messages Scrollbar
		$(window).on("load resize", function() {
			var winwidth = $(window).width();
			if (winwidth > 1199) {
				// Notes
				$(".row").each(function() {
					var mbh = $(this)
						.find(".main-box-in-row")
						.outerHeight();
					var cbh = $(this)
						.find(".child-box-in-row")
						.outerHeight();
					if (mbh < cbh) {
						var headerBoxHeight = $(this)
							.find(".child-box-in-row .headline")
							.outerHeight();
						var mainBoxHeight =
							$(this)
								.find(".main-box-in-row")
								.outerHeight() -
							headerBoxHeight +
							39;

						$(this)
							.find(".child-box-in-row .content")
							.wrap('<div class="dashboard-box-scrollbar" style="max-height: ' + mainBoxHeight + 'px" data-simplebar></div>');
					}
				});

				// Messages Sidebar
				// var messagesList = $(".messages-inbox").outerHeight();
				// var messageWrap = $(".message-content").outerHeight();
				// if ( messagesList > messagesWrap) {
				// 	$(messagesList).css({
				// 		'max-height': messageWrap,
				// 	});
				// }
			}
		});

		// Mobile Adjustment for Single Button Icon in Dashboard Box
		$(".buttons-to-right").each(function() {
			var btr = $(this).width();
			if (btr < 36) {
				$(this).addClass("single-right-button");
			}
		});

		// Small Footer Adjustment
		$(window).on("load resize", function() {
			var smallFooterHeight = $(".small-footer").outerHeight();
			$(".dashboard-footer-spacer").css({
				"padding-top": smallFooterHeight + 45
			});
		});

		// Auto Resizing Message Input Field
		/* global jQuery */
		jQuery.each(jQuery("textarea[data-autoresize]"), function() {
			var offset = this.offsetHeight - this.clientHeight;

			var resizeTextarea = function(el) {
				jQuery(el)
					.css("height", "auto")
					.css("height", el.scrollHeight + offset);
			};
			jQuery(this)
				.on("keyup input", function() {
					resizeTextarea(this);
				})
				.removeAttr("data-autoresize");
		});

		/*--------------------------------------------------*/
		/*  Star Rating
		/*--------------------------------------------------*/
		function starRating(ratingElem) {
			$(ratingElem).each(function() {
				var dataRating = $(this).attr("data-rating");

				// Rating Stars Output
				function starsOutput(firstStar, secondStar, thirdStar, fourthStar, fifthStar) {
					return (
						"" +
						'<span class="' +
						firstStar +
						'"></span>' +
						'<span class="' +
						secondStar +
						'"></span>' +
						'<span class="' +
						thirdStar +
						'"></span>' +
						'<span class="' +
						fourthStar +
						'"></span>' +
						'<span class="' +
						fifthStar +
						'"></span>'
					);
				}

				var fiveStars = starsOutput("star", "star", "star", "star", "star");

				var fourHalfStars = starsOutput("star", "star", "star", "star", "star half");
				var fourStars = starsOutput("star", "star", "star", "star", "star empty");

				var threeHalfStars = starsOutput("star", "star", "star", "star half", "star empty");
				var threeStars = starsOutput("star", "star", "star", "star empty", "star empty");

				var twoHalfStars = starsOutput("star", "star", "star half", "star empty", "star empty");
				var twoStars = starsOutput("star", "star", "star empty", "star empty", "star empty");

				var oneHalfStar = starsOutput("star", "star half", "star empty", "star empty", "star empty");
				var oneStar = starsOutput("star", "star empty", "star empty", "star empty", "star empty");

				// Rules
				if (dataRating >= 4.75) {
					$(this).append(fiveStars);
				} else if (dataRating >= 4.25) {
					$(this).append(fourHalfStars);
				} else if (dataRating >= 3.75) {
					$(this).append(fourStars);
				} else if (dataRating >= 3.25) {
					$(this).append(threeHalfStars);
				} else if (dataRating >= 2.75) {
					$(this).append(threeStars);
				} else if (dataRating >= 2.25) {
					$(this).append(twoHalfStars);
				} else if (dataRating >= 1.75) {
					$(this).append(twoStars);
				} else if (dataRating >= 1.25) {
					$(this).append(oneHalfStar);
				} else if (dataRating < 1.25) {
					$(this).append(oneStar);
				}
			});
		}
		starRating(".star-rating");

		/*--------------------------------------------------*/
		/*  Enabling Scrollbar in User Menu
		/*--------------------------------------------------*/
		function userMenuScrollbar() {
			$(".header-notifications-scroll").each(function() {
				var scrollContainerList = $(this).find("ul");
				var itemsCount = scrollContainerList.children("li").length;
				var notificationItems;

				// Determines how many items are displayed based on items height
				/* jshint shadow:true */
				if (scrollContainerList.children("li").outerHeight() > 140) {
					var notificationItems = 2;
				} else {
					var notificationItems = 3;
				}

				// Enables scrollbar if more than 2 items
				if (itemsCount > notificationItems) {
					var listHeight = 0;

					$(scrollContainerList)
						.find("li:lt(" + notificationItems + ")")
						.each(function() {
							listHeight += $(this).height();
						});

					$(this).css({ height: listHeight });
				} else {
					$(this).css({ height: "auto" });
					$(this)
						.find(".simplebar-track")
						.hide();
				}
			});
		}

		// Init
		userMenuScrollbar();

		/*--------------------------------------------------*/
		/*  Tippy JS
		/*--------------------------------------------------*/
		/* global tippy */
		tippy("[data-tippy]", {
			delay: 100,
			arrow: true,
			arrowType: "sharp",
			size: "regular",
			duration: 200,

			// 'shift-toward', 'fade', 'scale', 'perspective'
			animation: "shift-away",

			animateFill: true,
			theme: "dark",

			// How far the tooltip is from its reference element in pixels
			distance: 10
		});

		/*----------------------------------------------------*/
		/*	Accordion @Lewis Briffa
		/*----------------------------------------------------*/
		var accordion = (function() {
			var $accordion = $(".js-accordion");
			var $accordion_header = $accordion.find(".js-accordion-header").not(".accordion-header__buttons");

			// default settings
			var settings = {
				// animation speed
				speed: 400,

				// close all other accordion items if true
				oneOpen: false
			};

			return {
				// pass configurable object literal
				init: function($settings) {
					$accordion_header.on("click", function (e) {
						if ($(e.target).hasClass("accordion-header")) {
							e.preventDefault();
							accordion.toggle($(this));
						}
					});

					$.extend(settings, $settings);

					// ensure only one accordion is active if oneOpen is true
					if (settings.oneOpen && $(".js-accordion-item.active").length > 1) {
						$(".js-accordion-item.active:not(:first)").removeClass("active");
					}

					// reveal the active accordion bodies
					$(".js-accordion-item.active")
						.find("> .js-accordion-body")
						.show();
				},
				toggle: function($this) {
					if (settings.oneOpen && $this[0] != $this.closest(".js-accordion").find("> .js-accordion-item.active > .js-accordion-header")[0]) {
						$this
							.closest(".js-accordion")
							.find("> .js-accordion-item")
							.removeClass("active")
							.find(".js-accordion-body")
							.slideUp();
					}

					// show/hide the clicked accordion item
					$this.closest(".js-accordion-item").toggleClass("active");
					$this
						.next()
						.stop()
						.slideToggle(settings.speed);
				}
			};
		})();

		$(document).ready(function() {
			accordion.init({ speed: 300, oneOpen: true });
		});

		/*--------------------------------------------------*/
		/*  Tabs
		/*--------------------------------------------------*/
		$(window).on("load resize", function() {
			if ($(".tabs")[0]) {
				$(".tabs").each(function() {
					var thisTab = $(this);

					// Intial Border Position
					var activePos = thisTab.find(".tabs-header .active").position();

					function changePos() {
						// Update Position
						activePos = thisTab.find(".tabs-header .active").position();

						// Change Position & Width
						thisTab
							.find(".tab-hover")
							.stop()
							.css({
								left: activePos.left,
								width: thisTab.find(".tabs-header .active").width()
							});
					}

					changePos();

					// Intial Tab Height
					var tabHeight = thisTab.find(".tab.active").outerHeight();

					// Animate Tab Height
					function animateTabHeight() {
						// Update Tab Height
						tabHeight = thisTab.find(".tab.active").outerHeight();

						// Animate Height
						thisTab
							.find(".tabs-content")
							.stop()
							.css({
								height: tabHeight + "px"
							});
					}

					animateTabHeight();

					// Change Tab
					function changeTab() {
						var getTabId = thisTab.find(".tabs-header .active a").attr("data-tab-id");

						// Remove Active State
						thisTab
							.find(".tab")
							.stop()
							.fadeOut(300, function() {
								// Remove Class
								$(this).removeClass("active");
							})
							.hide();

						thisTab
							.find(".tab[data-tab-id=" + getTabId + "]")
							.stop()
							.fadeIn(300, function() {
								// Add Class
								$(this).addClass("active");

								// Animate Height
								animateTabHeight();
							});
					}

					// Tabs
					thisTab.find(".tabs-header a").on("click", function(e) {
						e.preventDefault();

						// Tab Id
						var tabId = $(this).attr("data-tab-id");

						// Remove Active State
						thisTab
							.find(".tabs-header a")
							.stop()
							.parent()
							.removeClass("active");

						// Add Active State
						$(this)
							.stop()
							.parent()
							.addClass("active");

						changePos();

						// Update Current Itm
						tabCurrentItem = tabItems.filter(".active");

						// Remove Active State
						thisTab
							.find(".tab")
							.stop()
							.fadeOut(300, function() {
								// Remove Class
								$(this).removeClass("active");
							})
							.hide();

						// Add Active State
						thisTab
							.find('.tab[data-tab-id="' + tabId + '"]')
							.stop()
							.fadeIn(300, function() {
								// Add Class
								$(this).addClass("active");

								// Animate Height
								animateTabHeight();
							});
					});

					// Tab Items
					var tabItems = thisTab.find(".tabs-header ul li");

					// Tab Current Item
					var tabCurrentItem = tabItems.filter(".active");

					// Next Button
					thisTab.find(".tab-next").on("click", function(e) {
						e.preventDefault();

						var nextItem = tabCurrentItem.next();

						tabCurrentItem.removeClass("active");

						if (nextItem.length) {
							tabCurrentItem = nextItem.addClass("active");
						} else {
							tabCurrentItem = tabItems.first().addClass("active");
						}

						changePos();
						changeTab();
					});

					// Prev Button
					thisTab.find(".tab-prev").on("click", function(e) {
						e.preventDefault();

						var prevItem = tabCurrentItem.prev();

						tabCurrentItem.removeClass("active");

						if (prevItem.length) {
							tabCurrentItem = prevItem.addClass("active");
						} else {
							tabCurrentItem = tabItems.last().addClass("active");
						}

						changePos();
						changeTab();
					});
				});
			}
		});

		/*--------------------------------------------------*/
		/*  tags
		/*--------------------------------------------------*/
		$(".tags-container").each(function (index, item) {

			var flag = 0;

			var tagInput = $(this).find(".tags-input");
			var tagsList = $(this).find(".tags-list");
			var tagsLength = $(this).find(".tags-list .tag").length;

			// adding tag
			function addtag(i) {
				var tagsName = $(tagInput).attr("data-name");
				var last_index = tagsLength || i;
				var $newtag = $(`
					<div class="tag">
						<input id="tag-input-${index}-${flag + tagsLength}", type="checkbox", name="${tagsName}[${last_index}]", value="${tagInput.val()}", checked/>
						<label for="tag-input-${index}-${flag + tagsLength}">${tagInput.val()}</label>
					</div>
				`);
				tagsList.append($newtag).trigger("resizeContainer");
				tagInput.val("");
				flag++;
			}

			// add via enter key
			tagInput.on("keyup", function(e) {
				if (e.keyCode == 13 && tagInput.val() !== "") {
					addtag(flag);
				}
			});

			// add via button
			$(".tags-input-button").on("click", function() {
				if (tagInput.val() !== "") {
					addtag(flag);
				}
			});

			// removing tag
			$(document).on("click", ".tag-remove", function() {
				$(this)
					.parent()
					.addClass("tag-removed");

				function removeFromMarkup() {
					$(".tag-removed").remove();
				}
				setTimeout(removeFromMarkup, 500);
				tagsList.css({ height: "auto" }).height();
			});

			// animating container height
			tagsList.on("resizeContainer", function() {
				var heightnow = $(this).height();
				var heightfull = $(this)
					.css({ "max-height": "auto", height: "auto" })
					.height();

				$(this)
					.css({ height: heightnow })
					.animate({ height: heightfull }, 200);
			});

			$(window).on("resize", function() {
				tagsList.css({ height: "auto" }).height();
			});

			// Auto Height for tags that are pre-added
			$(window).on("load", function() {
				var tagCount = $(".tags-list").children("span").length;

				// Enables scrollbar if more than 3 items
				if (tagCount > 0) {
					tagsList.css({ height: "auto" }).height();
				}
			});
		});

		/*--------------------------------------------------*/
		/*  Bootstrap Range Slider
		/*--------------------------------------------------*/

		// Thousand Separator
		function ThousandSeparator(nStr) {
			nStr += "";
			var x = nStr.split(".");
			var x1 = x[0];
			var x2 = x.length > 1 ? "." + x[1] : "";
			var rgx = /(\d+)(\d{3})/;
			while (rgx.test(x1)) {
				x1 = x1.replace(rgx, "$1" + "," + "$2");
			}
			return x1 + x2;
		}

		// Bidding Slider Average Value
		var avgValue = (parseInt($(".bidding-slider").attr("data-slider-min")) + parseInt($(".bidding-slider").attr("data-slider-max"))) / 2;
		if ($(".bidding-slider").data("slider-value") === "auto") {
			$(".bidding-slider").attr({ "data-slider-value": avgValue });
		}

		// Bidding Slider Init
		$(".bidding-slider").slider();

		$(".bidding-slider").on("slide", function(slideEvt) {
			$("#biddingVal").text(ThousandSeparator(parseInt(slideEvt.value)));
		});
		$("#biddingVal").text(ThousandSeparator(parseInt($(".bidding-slider").val())));

		// Default Bootstrap Range Slider
		var currencyAttr = $(".range-slider").attr("data-slider-currency");

		$(".range-slider").slider({
			formatter: function(value) {
				return currencyAttr + ThousandSeparator(parseInt(value[0])) + " - " + currencyAttr + ThousandSeparator(parseInt(value[1]));
			}
		});

		$(".range-slider-single").slider();

		/*----------------------------------------------------*/
		/*  Payment Accordion
		/*----------------------------------------------------*/
		var radios = document.querySelectorAll(".payment-tab-trigger > input");

		for (var i = 0; i < radios.length; i++) {
			radios[i].addEventListener("change", expandAccordion);
		}

		function expandAccordion(event) {
			/* jshint validthis: true */
			var tabber = this.closest(".payment");
			var allTabs = tabber.querySelectorAll(".payment-tab");
			for (var i = 0; i < allTabs.length; i++) {
				allTabs[i].classList.remove("payment-tab-active");
			}
			event.target.parentNode.parentNode.classList.add("payment-tab-active");
		}

		$(".billing-cycle-radios").on("click", function() {
			if ($(".billed-yearly-radio input").is(":checked")) {
				$(".pricing-plans-container").addClass("billed-yearly");
			}
			if ($(".billed-monthly-radio input").is(":checked")) {
				$(".pricing-plans-container").removeClass("billed-yearly");
			}
		});

		/*--------------------------------------------------*/
		/*  Quantity Buttons
		/*--------------------------------------------------*/
		function qtySum() {
			var arr = document.getElementsByName("qtyInput");
			var tot = 0;
			for (var i = 0; i < arr.length; i++) {
				if (parseInt(arr[i].value)) tot += parseInt(arr[i].value);
			}
		}
		qtySum();

		$(".qtyDec, .qtyInc").on("click", function() {
			var $button = $(this);
			var oldValue = $button
				.parent()
				.find("input")
				.val();

			if ($button.hasClass("qtyInc")) {
				$button
					.parent()
					.find("input")
					.val(parseFloat(oldValue) + 1);
			} else {
				if (oldValue > 1) {
					$button
						.parent()
						.find("input")
						.val(parseFloat(oldValue) - 1);
				} else {
					$button
						.parent()
						.find("input")
						.val(1);
				}
			}

			qtySum();
			$(".qtyTotal").addClass("rotate-x");
		});

		/*----------------------------------------------------*/
		/*  Inline CSS replacement for backgrounds
	/*----------------------------------------------------*/
		function inlineBG() {
			// Common Inline CSS
			$(".single-page-header, .intro-banner").each(function() {
				var attrImageBG = $(this).attr("data-background-image");

				if (attrImageBG !== undefined) {
					$(this).append('<div class="background-image-container"></div>');
					$(".background-image-container").css("background-image", "url(" + attrImageBG + ")");
				}
			});
		}
		inlineBG();

		// Fix for intro banner with label
		$(".intro-search-field").each(function() {
			var bannerLabel = $(this).children("label").length;
			if (bannerLabel > 0) {
				$(this).addClass("with-label");
			}
		});

		// Photo Boxes
		$(".photo-box, .photo-section, .video-container").each(function() {
			var photoBox = $(this);
			var photoBoxBG = $(this).attr("data-background-image");

			if (photoBox !== undefined) {
				$(this).css("background-image", "url(" + photoBoxBG + ")");
			}
		});

		/*----------------------------------------------------*/
		/*  Share URL and Buttons
		/*----------------------------------------------------*/
		/* global ClipboardJS */
		$(".copy-url input").val(window.location.href);
		new ClipboardJS(".copy-url-button");

		$(".share-buttons-icons a").each(function() {
			var buttonBG = $(this).attr("data-button-color");
			if (buttonBG !== undefined) {
				$(this).css("background-color", buttonBG);
			}
		});

		/*----------------------------------------------------*/
		/*  Tabs
		/*----------------------------------------------------*/
		var $tabsNav = $(".popup-tabs-nav"),
			$tabsNavLis = $tabsNav.children("li");

		$tabsNav.each(function() {
			var $this = $(this);

			$this
				.next()
				.children(".popup-tab-content")
				.stop(true, true)
				.hide()
				.first()
				.show();
			$this
				.children("li")
				.first()
				.addClass("active")
				.stop(true, true)
				.show();
		});

		$tabsNavLis.on("click", function(e) {
			var $this = $(this);

			$this
				.siblings()
				.removeClass("active")
				.end()
				.addClass("active");

			$this
				.parent()
				.next()
				.children(".popup-tab-content")
				.stop(true, true)
				.hide()
				.siblings($this.find("a").attr("href"))
				.fadeIn();

			e.preventDefault();
		});

		var hash = window.location.hash;
		var anchor = $('.tabs-nav a[href="' + hash + '"]');
		if (anchor.length === 0) {
			$(".popup-tabs-nav li:first")
				.addClass("active")
				.show(); //Activate first tab
			$(".popup-tab-content:first").show(); //Show first tab content
		} else {
			anchor.parent("li").click();
		}

		// Link to Register Tab
		$(".register-tab").on("click", function(event) {
			event.preventDefault();
			$(".popup-tab-content").hide();
			$("#register.popup-tab-content").show();
			$("body")
				.find('.popup-tabs-nav a[href="#register"]')
				.parent("li")
				.click();
		});

		// Disable tabs if there's only one tab
		$(".popup-tabs-nav").each(function() {
			var listCount = $(this).find("li").length;
			if (listCount < 2) {
				$(this).css({
					"pointer-events": "none"
				});
			}
		});

		/*----------------------------------------------------*/
		/*  Indicator Bar
	    /*----------------------------------------------------*/
		$(".indicator-bar").each(function() {
			var indicatorLenght = $(this).attr("data-indicator-percentage");
			$(this)
				.find("span")
				.css({
					width: indicatorLenght + "%"
				});
		});

		/*----------------------------------------------------*/
		/*  Custom Upload Button
	    /*----------------------------------------------------*/

		var uploadButton = {
			$button: $(".uploadButton-input"),
			$nameField: $(".uploadButton-file-name")
		};

		uploadButton.$button.on("change", function() {
			_populateFileField($(this));
		});

		function _populateFileField($button) {
			var selectedFile = [];
			for (var i = 0; i < $button.get(0).files.length; ++i) {
				selectedFile.push($button.get(0).files[i].name + "<br>");
			}
			uploadButton.$nameField.html(selectedFile);
		}

		/*----------------------------------------------------*/
		/*  Slick Carousel
	    /*----------------------------------------------------*/
		$(".default-slick-carousel").slick({
			infinite: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			dots: false,
			arrows: true,
			adaptiveHeight: true,
			responsive: [
				{
					breakpoint: 1292,
					settings: {
						dots: true,
						arrows: false
					}
				},
				{
					breakpoint: 993,
					settings: {
						slidesToShow: 2,
						slidesToScroll: 2,
						dots: true,
						arrows: false
					}
				},
				{
					breakpoint: 769,
					settings: {
						slidesToShow: 1,
						slidesToScroll: 1,
						dots: true,
						arrows: false
					}
				}
			]
		});

		$(".testimonial-carousel").slick({
			centerMode: true,
			centerPadding: "30%",
			slidesToShow: 1,
			dots: false,
			arrows: true,
			adaptiveHeight: true,
			responsive: [
				{
					breakpoint: 1600,
					settings: {
						centerPadding: "21%",
						slidesToShow: 1
					}
				},
				{
					breakpoint: 993,
					settings: {
						centerPadding: "15%",
						slidesToShow: 1
					}
				},
				{
					breakpoint: 769,
					settings: {
						centerPadding: "5%",
						dots: true,
						arrows: false
					}
				}
			]
		});

		$(".logo-carousel").slick({
			infinite: true,
			slidesToShow: 5,
			slidesToScroll: 1,
			dots: false,
			arrows: true,
			responsive: [
				{
					breakpoint: 1365,
					settings: {
						slidesToShow: 5,
						dots: true,
						arrows: false
					}
				},
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 3,
						dots: true,
						arrows: false
					}
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
						dots: true,
						arrows: false
					}
				}
			]
		});

		$(".blog-carousel").slick({
			infinite: false,
			slidesToShow: 3,
			slidesToScroll: 1,
			dots: false,
			arrows: true,
			responsive: [
				{
					breakpoint: 1365,
					settings: {
						slidesToShow: 3,
						dots: true,
						arrows: false
					}
				},
				{
					breakpoint: 992,
					settings: {
						slidesToShow: 2,
						dots: true,
						arrows: false
					}
				},
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 1,
						dots: true,
						arrows: false
					}
				}
			]
		});

		/*----------------------------------------------------*/
		/*  Magnific Popup
	    /*----------------------------------------------------*/
		$(".mfp-gallery-container").each(function(index, item) {
			// the containers for all your galleries

			$(item).magnificPopup({
				type: "image",
				delegate: "a.mfp-gallery",

				fixedContentPos: true,
				fixedBgPos: true,

				overflowY: "auto",

				closeBtnInside: false,
				preloader: true,

				removalDelay: 0,
				mainClass: "mfp-fade",

				gallery: { enabled: true, tCounter: "" }
			});
		});

		$(".popup-with-zoom-anim").each(function (index, item) {
			$(item).magnificPopup({
				type: "inline",

				fixedContentPos: false,
				fixedBgPos: true,

				overflowY: "auto",

				closeBtnInside: true,
				preloader: false,

				midClick: true,
				removalDelay: 300,
				mainClass: "my-mfp-zoom-in"
			});
			if($(item).hasClass("popup-open-by-default")) {
				$(item).click();
			}
		})

		$(".mfp-image").each(function(index, item) {
			$(item).magnificPopup({
				type: "image",
				closeOnContentClick: true,
				mainClass: "mfp-fade",
				image: {
					verticalFit: true
				}
			});
		});

		$(".popup-youtube, .popup-vimeo, .popup-gmaps").each(function(index, item) {
			$(item).magnificPopup({
				disableOn: 700,
				type: "iframe",
				mainClass: "mfp-fade",
				removalDelay: 160,
				preloader: false,

				fixedContentPos: false
			});
		});

		/*----------------------------------------------------*/
		/*  Password Visibility
	    /*----------------------------------------------------*/
		$(".show-password").each(function(index, item) {
			$(item).on("click", function () {
				var $target = $($(item).data("target"));
				if ($target.attr("type") === "password") {
					$target.attr("type", "text");
					$(item).removeClass("icon-feather-eye").addClass("icon-feather-eye-off");
				} else {
					$target.attr("type", "password");
					$(item).removeClass("icon-feather-eye-off").addClass("icon-feather-eye");
				}
			});
		});



		/*----------------------------------------------------*/
		/*  Change availablity status
	    /*----------------------------------------------------*/
		(function () {
			if ($(".status-switch label.user-invisible").hasClass("current-status")) {
				$(".status-indicator").addClass("right");
			}
			// Snackbar for user status switcher
			$("#snackbar-user-status label").click(function (e) {
				$.ajax({
					url: $(e.target)
						.closest("form")
						.attr("action"),
					type: $(e.target)
						.closest("form")
						.attr("method"),
					dataType: "json",
					contentType: "json",
					data: { CSRF: $('meta[name="csrf-token"]').attr("content") },
					headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
					success: function (res) {
						if (res) {
							$(".status-indicator").removeClass("right");
							$(".status-switch label").removeClass("current-status");
							$(".user-online").addClass("current-status");
						} else {
							$(".status-indicator").addClass("right");
							$(".status-switch label").removeClass("current-status");
							$(".user-invisible").addClass("current-status");
						}

						if (!$(".user-avatar").hasClass("status-online")) {
							$(".user-avatar").addClass("status-online")
						} else {
							$(".user-avatar").removeClass("status-online")
						}

						Snackbar.show({
							text: "Your status has been changed!",
							pos: "bottom-center",
							showAction: false,
							actionText: "Dismiss",
							duration: 3000,
							textColor: "#fff",
							backgroundColor: "#383838"
						});
					},
					error: function(err) {
						Snackbar.show({
							text: `Error has been occurred, please try again in a few seconds.`,
							pos: "bottom-center",
							showAction: false,
							actionText: "Dismiss",
							duration: 5000,
							textColor: "#fff",
							backgroundColor: "#383838"
						});
						console.log(err);
					}
				});
			});
		})();


		/*----------------------------------------------------*/
		/*  Auto remove notifications
	    /*----------------------------------------------------*/
		(function() {
			var $alertsWrapper = $(".alerts-wrapper");
			var $notifications = $alertsWrapper.find(".notification");
			if ($notifications.length) {
				$notifications.each(function(index, ele) {
					console.log((index + 1) * 1000);
					setTimeout(() => {
						$(ele).find(".close").click();
					}, Boolean($(ele).data("timeout-close")) ? Number($(ele).data("timeout-close")) : (index +1) * 1250);
				});
			}
		})();

		/*----------------------------------------------------*/
		/*  Google Maps Init Function
	    /*----------------------------------------------------*/
		(function initAutocomplete() {
			var $inputs = $(".autocomplete-input");
			var options = { types: ["(cities)"], componentRestrictions: { country: "eg" } };
			$inputs.each(function(index, item) {
				var autocomplete = new google.maps.places.Autocomplete($(item)[0], options);

				$(item).keydown(function (e) {
					if (e.which == 13 && $('.pac-container:visible').length) return false;
				});

				google.maps.event.addListener(autocomplete, 'place_changed', function() {
					var place = autocomplete.getPlace();
					if (!place.geometry) {
						return Snackbar.show({
							text: "Autocomplete's returned place contains no geometry",
							pos: "bottom-center",
							duration: 5000,
							textColor: "#fff",
							backgroundColor: "#383838"
						});
					}

					var address = '';
					if (place.address_components) {
						address = [
							(place.address_components[0] && place.address_components[0].short_name || ''),
							(place.address_components[1] && place.address_components[1].short_name || ''),
							(place.address_components[2] && place.address_components[2].short_name || '')
						].join(' ');
					}

					if ($(item).siblings(".autocomplete-input-long").length) {
						$(item).siblings(".autocomplete-input-long").val(place.geometry.location.lng());
					}
					if ($(item).siblings(".autocomplete-input-lat").length) {
						$(item).siblings(".autocomplete-input-lat").val(place.geometry.location.lat());
					}

				});
			});
		})();


		// Mark All Message As was Read
		(function() {
			// caching dom.
			var $notification_header_container = $(".header-notifications-dropdown");
			var $notification_read_all = $notification_header_container.find(".mark-as-read");

			$notification_read_all.each(function(index, ele) {
				$(ele).on("click", function(e) {
					var $target = $(e.target);
					var notification_type = $target.data("notification-type");
					var $unread_notifications = $target.closest(".header-notifications-dropdown").find(".notifications-not-read");
					var unread_notifications_id = [];

					$unread_notifications.each(function(index, ele) {
						unread_notifications_id.push($(ele).data("notification-id"));
					});

					if (notification_type == "messages") {
						if (unread_notifications_id.length) {
							$.ajax({
								url: "/dashboard/messages/read_all",
								type: "POST",
								dataType: "json",
								contentType: 'application/json',
								data: JSON.stringify({ CSRF: $('meta[name="csrf-token"]').attr("content"), messages: unread_notifications_id }),
								headers: { "X-CSRF-Token": $('meta[name="csrf-token"]').attr("content") },
								success: function (res) {
									res = res.filter(function(item) { return item.was_read });
									res.forEach(ele => {
										$target.closest(".header-notifications-dropdown").find(`#message-${ele._id}`).removeClass("notifications-not-read")
										var notification_counter = $(".header-notifications#header-message").find(".header-notifications-trigger").find("a span").text;
										var counter = Number(notification_counter) - 1;
										if (counter > 0) {
											$(".header-notifications#header-message").find(".header-notifications-trigger").find("a span").text(counter);
										} else {
											$(".header-notifications#header-message").find(".header-notifications-trigger").find("a span").remove();
										}
									});
									Snackbar.show({
										text: `Success, All messages marked as read.`,
										pos: "bottom-center",
										duration: 5000,
										textColor: "#fff",
										backgroundColor: "#383838"
									});
								},
								error: function(err) {
									Snackbar.show({
										text: `Error has been occurred, please try again in a few seconds.`,
										pos: "bottom-center",
										duration: 5000,
										textColor: "#fff",
										backgroundColor: "#383838"
									});
									console.log(err);
								}
							});
						} else {
							Snackbar.show({
								text: `No new messages found!`,
								pos: "bottom-center",
								duration: 5000,
								textColor: "#fff",
								backgroundColor: "#383838"
							});
						}
					}
				});
			});
		})();


		// Sockets.io
		(function() {
			// SOCKET INSTANCE.
			// ─────────────────────────────────────────────────────────────────
			var socket = io.connect();

			// CACHING DOM.
			// ─────────────────────────────────────────────────────────────────
			// Conversations ids
			var conversations_id = $("meta[name='conversations']").attr("content").split(",");
			var user_id = $("meta[name='user']").attr("content");
			// 1- Header's DOM
			var $headerMessagesContainer = $(".header-notifications#header-message");
			var $headerMessagesTrigger = $headerMessagesContainer.find(".header-notifications-trigger");
			var $headerMessagesDropDown = $headerMessagesContainer.find(".header-notifications-dropdown");
			// 2- Sidebar's DOM
			var $messagesNavItemContainer = $("#messages-nav-item");
			// 3- Conversation's DOM
			var $conversationContainer = $(".message-content");
			var $conversationContainerInner;
			var $messages_form;
			var $messages_replay;
			var conversation_id;
			var send_to_user;
			var send_to_user_gravatar;
			var send_from_user;
			var send_from_user_gravatar;

			// EMITTING EVENTS.
			// ─────────────────────────────────────────────────────────────────
			// 1-emitting to join conversation socket with conversation mongodb id.
			conversations_id.forEach(function(ele) { socket.emit("conversations/join", ele); });

			// 2-handling conversation page events.
			if ($conversationContainer.length) {

				$conversationContainerInner = $conversationContainer.find(".message-content-inner");
				$messages_form = $conversationContainer.find("form.message-reply");
				$messages_replay = $messages_form.find("textarea");
				conversation_id = $messages_form.find("input#conversation_id[type='hidden']").val();
				send_to_user = $messages_form.find("input#send_to_user[type='hidden']").val();
				send_to_user_gravatar = $messages_form.find("input#send_to_user_gravatar[type='hidden']").val();
				send_from_user = $messages_form.find("input#send_from_user[type='hidden']").val();
				send_from_user_gravatar = $messages_form.find("input#send_from_user_gravatar[type='hidden']").val();

				// Scroll Chat container all the way down to bottom.
				$conversationContainerInner.scrollTop($conversationContainerInner[0].scrollHeight);

				// Handling read all messages in opened conversation
				socket.emit("messages/read_all", { conversation: conversation_id, receiver: send_to_user, sender: send_from_user });

				// Handling on typing chat input event.
				$messages_replay.on("keyup", function(e) {
					// Emitting "user is typing" event with conversation, sender, and receiver data.
					socket.emit("messages/typing", { conversation: conversation_id, to: send_to_user, from: send_from_user });
				});

				// Handling submitting chat form event, with emitting the message to the server.
				$messages_form.on("submit", function(e) {
					// Preventing the button from submitting the form.
					e.preventDefault();
					// Extract the message text from form input.
					var message = $(e.target).find('textarea').val();
					// make sure to enter a message
					if (message == "") {
						// TODO: return error message from server side validation.
						// NOTE: make sure to use callback validation.
						return Snackbar.show({
							text: `Don't forget to type something first!`,
							pos: "bottom-center",
							duration: 5000,
							textColor: "#fff",
							backgroundColor: "#383838"
						});
					}
					// Resting form input to empty again.
					$(e.target).find('textarea').val("");
					// Emitting new message with conversation, sender, and receiver data.
					socket.emit("messages/new", { conversation: conversation_id, to: send_to_user, from: send_from_user, message });
				});

				// Handling Conversation DOM on scroll
				// $conversationContainerInner.scroll(function(e) {
				// 	const scrollPercentage = getScrollPercentage(e.target, -1);
				// 	if (scrollPercentage >= 75) {
				// 		console.log(scrollPercentage);
				// 	}
				// })
			}

			// LISTENING TO EVENTS.
			// ─────────────────────────────────────────────────────────────────
			// 1-listening to typing event
			socket.on("typing", (data) => {
				if (data.from._id !== send_from_user && $conversationContainer.length) {
					outputTyping(data);
					// Scroll Chat container all the way down to bottom.
					$conversationContainerInner.scrollTop($conversationContainerInner[0].scrollHeight);
				}
			});

			// 2-Listening to message event.
			socket.on("message", (data) => {
				if (data.to._id === user_id) {
					if (data.conversation !== conversation_id || !$conversationContainer.length) {
						// Add needed html for messages notification in header for sent to user.
						addMessageNotification(data);
						if ($messagesNavItemContainer.length) addMessageSideBarCounter();
					}
					$.playSound("/sounds/sharp.mp3");
				}

				if ($conversationContainer.length) {
					// Add needed html for the chat popup in conversation container.
					outputMessagePopup(data, send_to_user_gravatar, send_from_user_gravatar);
					// Scroll Chat container all the way down to button.
					$conversationContainerInner.scrollTop($conversationContainerInner[0].scrollHeight);

					// Handling read all messages in opened conversation
					socket.emit("messages/read_all", {  conversation: conversation_id, receiver: send_to_user, sender: send_from_user });
				}
			});

			// 3-listening to event readed messages.
			socket.on("all_messages_readed", (data) => {
				if ($conversationContainer.length) {
					decrementMessageNotificationCounter(data);
					decrementMessageSideBarCounter(data);
				}
			});

			// 4-listening to event logout user.
			socket.on("user/logout", (data)=> { changeUserStatusIndicator(data); });

			// 5- listening to event login user.
			socket.on("user/login", (data)=> { changeUserStatusIndicator(data); });

			// HELPER FUNCTIONS.
			// ─────────────────────────────────────────────────────────────────
			// function getScrollPercentage(ele, direction) {
			// 	var scrollTop = $(ele).scrollTop();
			// 	var docHeight = $(ele).parent().height();
			// 	var winHeight = $(ele).height();
			// 	var scrollPercent = (scrollTop) / (docHeight - winHeight);
			// 	var scrollPercentRounded = Math.round(scrollPercent * 100);
			// 	return (direction === -1) ? (100 - scrollPercentRounded) : scrollPercentRounded;
			// };

			function outputMessagePopup(data, send_to_user_gravatar, send_from_user_gravatar) {
				if ($conversationContainerInner.find("#typing").length) {
					$conversationContainerInner.find("#typing").remove();
				}
				$conversationContainerInner.append(`
					<div class="message-bubble ${(data.from._id === send_from_user) ? 'me' : ''}">
						<div class="message-bubble-inner">
							<a href="/profile/${(data.from._id === send_from_user) ? data.from.slug : data.to.slug }" class="message-avatar">
								${ (data.from.account.picture || data.from.account.picture_md)
									? '<img src=/' + `${(!data.from.account.picture) ? data.from.account.picture_md.path : data.from.account.picture.path}` + ' title="'+ moment(data.message.created_at).calendar() +'" data-tippy="" data-tippy-placement="top">'
									: '<img src=' + `${(data.from._id === send_from_user ? send_from_user_gravatar : send_to_user_gravatar)}` + ' title="'+ moment(data.message.created_at).calendar() +'" data-tippy="" data-tippy-placement="top">' }
							</a>
							<div class="message-text">
								<p>${data.message.content}</p>
							</div>
						</div>
						<div class="clearfix"></div>
					</div>
				`);

				tippy("[data-tippy]", {
					delay: 100,
					arrow: true,
					arrowType: "sharp",
					size: "regular",
					duration: 200,
					// 'shift-toward', 'fade', 'scale', 'perspective'
					animation: "shift-away",
					animateFill: true,
					theme: "dark",
					// How far the tooltip is from its reference element in pixels
					distance: 10
				});
			}

			function outputTyping(data) {
				if (!$conversationContainerInner.find("#typing").length) {
					$conversationContainerInner.append(`
						<div class="message-bubble" id="typing">
							<div class="message-bubble-inner">
								<a href="#" class="message-avatar">
									${ (data.from.account.picture || data.from.account.picture_md) ? '<img src=/' + `${(!data.from.account.picture) ? data.from.account.picture_md.path : data.from.account.picture.path}` + ' title="message" data-tippy data-tippy-placement="top">' : '<img src=/'+ `${(data.from._id === send_from_user ? send_from_user_gravatar : send_to_user_gravatar)}` +' title="message" data-tippy data-tippy-placement="top">' }
								</a>
								<div class="message-text">
									<div class="typing-indicator">
										<span></span>
										<span></span>
										<span></span>
									</div>
								</div>
							</div>
							<div class="clearfix"></div>
						</div>
					`)
				}
			}

			function addMessageNotification(data) {
				if ($headerMessagesTrigger.find("a span").length) {
					$headerMessagesTrigger.find("a span").text(Number($headerMessagesTrigger.find("a span").text()) + 1)
				} else {
					$headerMessagesTrigger.find("a").append("<span>1</span>")
				}

				$headerMessagesDropDown.find(".header-notifications-content").find("ul").prepend(`
					<li class="${!data.message.was_read ? 'notifications-not-read' : ''}" id="message-${data.message._id}">
						<a href="/dashboard/conversations/${data.conversation}?message=${data.message._id}">
							<span class="notification-avatar ${(data.from.is_active) ? "status-online" : "status-offline"}">
								${
									(data.from.account.picture || data.from.account.picture_sm)
									? '<img src=/' + `${(!data.from.account.picture) ? data.from.account.picture_md.path : data.from.account.picture.path}` + '>'
									: '<img src='+`${data.from_gravatar}`+'>'
								}
							</span>
							<div class="notification-text">
								<strong>${data.from.account.name}</strong>
								<p class="notification-msg-text">${data.message.content}</p>
								<span class="color">${moment(data.message.created_at).calendar()}</span>
							</div>
						</a>
					</li>
				`);
			}

			function decrementMessageNotificationCounter(data) {
				if ($headerMessagesTrigger.find("a span").length) {
					var counter = Number($headerMessagesTrigger.find("a span").text()) - data.messages.length;
					if (counter > 0) {
						$headerMessagesTrigger.find("a span").text(counter);
					} else {
						$headerMessagesTrigger.find("a span").remove();
					}
				}

				data.messages.forEach(element => {
					$headerMessagesDropDown.find(".header-notifications-content").find(`ul`).find(`.notifications-not-read[id='message-${element._id}']`).removeClass("notifications-not-read");
				});
			}

			function addMessageSideBarCounter() {
				if ($messagesNavItemContainer.find("a span").length) {
					$messagesNavItemContainer.find("a span").text(Number($messagesNavItemContainer.find("a span").text()) + 1)
				} else {
					$messagesNavItemContainer.find("a").append("<span>1</span>")
				}
			}

			function decrementMessageSideBarCounter(data) {
				if ($messagesNavItemContainer.find("a span").length) {
					var counter = Number($messagesNavItemContainer.find("a span").text()) - data.messages.length;
					if (counter > 0) {
						$messagesNavItemContainer.find("a span").text(counter)
					} else {
						$messagesNavItemContainer.find("a span").remove();
					}
				}
			}

			function changeUserStatusIndicator(data) {
				// caching dom.
				var $status_indicator = $(`i[data-user='${data.id}']`);
				if ($status_indicator.length) {
					$status_indicator.each(function(index, ele) {
						if (data.is_active) {
							if ($(ele).hasClass("status-offline")) {
								$(ele).removeClass("status-offline").addClass("status-online");
							}
						} else {
							if ($(ele).hasClass("status-online")) {
								$(ele).removeClass("status-online").addClass("status-offline");
							}
						}

						Snackbar.show({
							text: `${data.name} is ${data.is_active ? "online" : "offline"}.`,
							pos: "bottom-center",
							duration: 5000,
							textColor: "#fff",
							backgroundColor: "#383838"
						});
					});
				}
			}
		})();
		// ------------------ End Document ------------------ //
	});
})(this.jQuery);
