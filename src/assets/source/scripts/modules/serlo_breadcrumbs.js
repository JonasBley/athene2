/**
 *
 * Athene2 - Advanced Learning Resources Manager
 *
 * @author  Jonas Keinholz (jonas.keinholz@serlo.org)
 * @license   http://www.apache.org/licenses/LICENSE-2.0  Apache License 2.0
 * @link    https://github.com/serlo-org/athene2 for the canonical source repository
 *
 * Breadcrumb
 *
 */

/*global define*/
define('breadcrumbs', ['jquery'], function ($) {
    'use strict';
    var Breadcrumbs,
        instance,
        defaults;

    defaults = {
        // main wrapper selector
        wrapperId: '#subject-nav-wrapper',

        // breadcrumb selector
        breadcrumbId: '#breadcrumbs',

        // desired height
        height: '45',

        // separator icon
        icon: $('<i>', { class: 'fa fa-angle-left' })
    };

    /**
     * @class Breadcrumbs
     * @param {Object} options See defaults
     *
     * Main constructor
     **/
    Breadcrumbs = function (options) {
        if (!(this instanceof Breadcrumbs)) {
            return new Breadcrumbs(options);
        }

        var self = this;

        self.options = options ? $.extend({}, defaults, options) : $.extend({}, defaults);

        self.$wrapper = $(this.options.wrapperId);
        self.$breadcrumbs = $(this.options.breadcrumbId);

        self.$breadcrumbs.children().each(function () {
            $(this).find('a').append(self.options.icon.clone());
        });

        // defines all elements
        self.elements = this.$breadcrumbs.children();
        self.elementsCopy = [];
        $.each(self.elements, function (i, n) {
            self.elementsCopy.push(n);
        });
        console.log(this.elements, 'elements');

        // queue of shown elements that are not subject name, content name and second to last element
        self.shownElements = [];
        // queue of shown default elements (subject name, content name and second to last element)
        self.shownDefaultElements = [];
        // stack of hidden elements
        self.hiddenElements = [];
        // stack of hidden default elements
        self.hiddenDefaultElements = [];

        Breadcrumbs.prototype.makeDefaultElements = function () {
            console.log(this.elementsCopy, 'elements copy');
            self.elementsCopy.shift();
            console.log(this.elementsCopy, 'elements copy');
            self.elementsCopy.pop();
            self.elementsCopy.pop();
        };

        // fills shownElements and shownDefaultElements Arrays
        if (this.elements.length > 0) {
            this.elements.slice(1, -2).each(function (i, el) {
                self.shownElements.push(el);
            });
            self.makeDefaultElements();
            $(this.elementsCopy).each(function (i, el2) {
                self.shownDefaultElements.push(el2);
            });
            console.log(this.shownElements, 'shown Elements');
            console.log(this.shownDefaultElements, 'Shown Default Elements');
            self.initDots();
        } else {
            self.$wrapper.addClass('has-no-backlink');
        }

        // adapt height; repeat on resize
        this.adaptHeight();
        $(window).bind('resizeDelay', function () {
            self.adaptHeight();
        });
    };

    /**
     * @method initDots
     */
    Breadcrumbs.prototype.initDots = function () {
        this.$dots = $('<li>', { class: 'hidden' });
        this.$dotsLink = $('<a>', { html: '…'}).append(this.options.icon.clone());
        this.$dots.append(this.$dotsLink);

        this.$breadcrumbs.children().first().after(this.$dots);
    };

    /**
     * @method hasxElements
     * @return {boolean} true if there are two/three elements (idea: delete last element when at 3, delete first when at 2)
     */
    Breadcrumbs.prototype.hasThreeElements = function () {
        return  this.shownElements.length === 0;
    };

    Breadcrumbs.prototype.hasTwoElements = function () {
        return this.shownDefaultElements === 2;
    };

    Breadcrumbs.prototype.hasOneElement = function () {
        return this.shownDefaultElements === 1;
    };

    Breadcrumbs.prototype.hasShownElements = function () {
        return  this.shownElements.length > 0;
    };
    /**
     * @method hasHiddenElements
     * @return {boolean} true iff there are hidden elements
     */
    Breadcrumbs.prototype.hasHiddenElements = function () {
        return this.hiddenElements.length > 0 || this.hiddenDefaultElements > 0;
    };

    /**
     * @method isTooHigh
     * @return {boolean} true iff the wrapper is too high
     */
    Breadcrumbs.prototype.isTooHigh = function () {
        return this.$wrapper.height() > this.options.height;
    };

    /**
     * @method showElement
     *
     * Shows the first hidden element
     */
    Breadcrumbs.prototype.showNextElement = function () {
        if (this.hasThreeElements()) {
            var el = this.hiddenElements.pop();
            el.removeClass('hidden');
            this.shownElements.unshift(el);
        }

        // hide suspension points if there are no hidden elements left
        if (!this.hasHiddenElements()) {
            this.$dots.addClass('hidden');
        }
    };
    Breadcrumbs.prototype.showNextDefaultElement = function () {
        if (!this.hasShownElements()) {
            var el = this.hiddenDefaultElements.pop();
            el.removeClass('hidden');
            this.shownDefaultElements.unshift(el);
        }
    };

    /**
     * @method hideNextElement
     *
     * Hides the last shown element
     */
    Breadcrumbs.prototype.hideNextElement = function () {
        var el3 = $(this.shownElements).shift();
        console.log(this.shownElements, 'shown Elements after first hide');
        el3.addClass('hidden');
        this.hiddenElements.push(el3);

        // show suspension points and update its href
        this.$dots.removeClass('hidden');
        this.$dotsLink.attr('href', el3.children().first().attr('href'));
    };

    Breadcrumbs.prototype.hideContentName = function () {
        var contentName = $(this.shownDefaultElements).last();
        contentName.addClass('hidden');
        this.hiddenDefaultElements.push(contentName);
        this.shownDefaultElements.pop();
    };

    Breadcrumbs.prototype.hideSubjectName = function () {
        var subjectName = this.shownDefaultElements[0];
        subjectName.addClass('hidden');
        this.hiddenDefaultElements.push(subjectName);
        this.shownDefaultElements.shift();

        // hide dots when Subject Name is removed
        this.$dots.addClass('hidden');
    };

    /**
     * @method adaptHeight
     *
     * Shows as much elements as possible without breaking the wrappers height. Hides exceeding elements.
     */
    Breadcrumbs.prototype.adaptHeight = function () {
        var self = this;

        // try to show more elements
        self.$wrapper.removeClass('backlink-only');

        while (self.hasHiddenElements() && !self.isTooHigh()) {
            self.showNextElement();
            self.showNextDefaultElement();
        }

        while (self.hasShownElements() && self.isTooHigh()) {
            self.hideNextElement();
        }
        // When only three Elements are left, the content title will be removed
        if (self.hasThreeElements() && self.isTooHigh()) {
            self.hideContentName();
        }
        // When only two Elements are left, the subject title will be removed
        else if (self.hasTwoElements() && self.isTooHigh()) {
            self.hideSubjectName();
        }
        // show backlink only if still too high
        else if (self.hasOneElement() && self.isTooHigh()) {
            self.$wrapper.addClass('backlink-only');
        }
    };

    /**
     * Breadcrumb constructor wrapper
     * for creating a singleton
     */
    return function (options) {
        // singleton
        return instance || (function () {
                instance = new Breadcrumbs(options);
                return instance;
            }());
    };
});
