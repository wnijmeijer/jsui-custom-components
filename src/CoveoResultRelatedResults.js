/* jshint undef:true, eqeqeq:true, curly:true, strict:true, laxbreak: true, laxcomma: true */
/* global Coveo,window */


var Coveo;
(function (Coveo) {
    var Ui;
    (function (Ui) {
        var ResultsRelated = (function (_super) {
            __extends(ResultsRelated, _super);
            function ResultsRelated(element, options, bindings, result) {
                _super.call(this, element, ResultsRelated.ID, bindings);
                this.element = element;
                this.options = options;
                this.result = result;
				this.showingMoreResults = false;
                this.options = Ui.ComponentOptions.initComponentOptions(this.element, ResultsRelated, options);
                Coveo.Assert.exists(result);
                this.buildElements();
				this.updateElementVisibility();
				if (this.options.alwaysShow)
				{
				   this.showMoreResults();
				}
            }
            ResultsRelated.prototype.buildElements = function () {
                this.buildHeader();
                this.buildResults();
				if (!this.options.alwaysShow)
				{
					this.buildFooter();
				}
            };
			ResultsRelated.prototype.showMoreResults = function () {
					var _this = this;
					this.updateElementVisibility();
					this.showingMoreResults = true;
					var queryBuilder = new Coveo.Ui.QueryBuilder();
				  queryBuilder.numberOfResults = this.options.numberOfResults;
				  var newquery=this.options.query;
				  var a = this.options.fields.split(";");
				  var i=0;
				  for (i = 0; i < a.length; i++) {
					newquery=newquery.replace("[FIELD"+(i+1)+"]",this.result.raw[a[i]]);
				  }
				  queryBuilder.advancedExpression.add(newquery);
				  Coveo.Rest.SearchEndpoint.endpoints["default"].search(queryBuilder.build()).done(function(data) {
						
                    _this.showingMoreResults = true;
                    _this.updateElementVisibility(data.results.length);
                    _this.displayThoseResults(data.results);
                });
            };
            ResultsRelated.prototype.showLessResults = function () {
                this.results.empty();
				this.showingMoreResults = false;
                this.updateElementVisibility();
                this.scrollToResultElement();
            };
            ResultsRelated.prototype.buildHeader = function () {
                var header = Coveo.$('<div/>').addClass('coveo-folding-header').appendTo(this.element);
                if (this.options.normalCaption != undefined && this.options.expandedCaption != undefined) {
//                    this.normalCaption = Coveo.$('<div/>').addClass('coveo-folding-header-caption').text(this.options.normalCaption).appendTo(header);
  //                  this.expandedCaption = Coveo.$('<div/>').addClass('coveo-folding-header-caption').text(this.options.expandedCaption).appendTo(header);
                }
            };
            ResultsRelated.prototype.buildResults = function () {
                this.results = Coveo.$('<div/>').addClass('coveo-folding-results').appendTo(this.element);
                this.noResultsCaption = Coveo.$('<div/>').addClass('coveo-folding-header-caption').text(this.options.noResultsCaption).appendTo(this.results);
            };
            ResultsRelated.prototype.buildFooter = function () {
                var _this = this;
                var footer = Coveo.$('<div/>').addClass('coveo-folding-footer').appendTo(this.element.parentElement);
                if (true) {
                    this.showMore = Coveo.$("<div/>").addClass("coveo-folding-footer-section-for-less").appendTo(footer).fastClick(function () { return _this.showMoreResults(); });
                    this.showLess = Coveo.$("<div/>").addClass("coveo-folding-footer-section-for-more").appendTo(footer).fastClick(function () { return _this.showLessResults(); });
                    var footerIconShowMore = Coveo.$("<div><span class='coveo-folding-footer-icon'></span></div>").addClass('coveo-more');
                    var footerIconShowLess = Coveo.$("<div><span class='coveo-folding-footer-icon'></span></div>").addClass('coveo-less');
                    var showMoreLink = Coveo.$('<a/>').addClass('coveo-folding-show-more').text(this.options.normalCaption);
                    var showLessLink = Coveo.$('<a/>').addClass('coveo-folding-show-less').text(this.options.expandedCaption);
                    this.showMore.append(showMoreLink);
                    this.showLess.append(showLessLink);
                    this.showMore.append(footerIconShowMore);
                    this.showLess.append(footerIconShowLess);
					if (this.options.indent>0)
					{
						this.showMore.css('left',this.options.indent+'px');
						this.showLess.css('left',this.options.indent+'px');
					}
                }
            };
            ResultsRelated.prototype.updateElementVisibility = function (subResultsLength) {
               /* if (this.normalCaption) {
                    this.normalCaption.fastToggle(!this.showingMoreResults);
                }
                if (this.expandedCaption) {
                    this.expandedCaption.fastToggle(this.showingMoreResults);
                }*/
				this.noResultsCaption.hide();
				if (subResultsLength && subResultsLength == 0)
				{
				   this.noResultsCaption.show();
				}
				if (!this.options.alwaysShow)
				{
					if (true) {
						this.showMore.fastToggle(!this.showingMoreResults);
						this.showLess.fastToggle(this.showingMoreResults);
					}
				}
                Coveo.$(this.element).find('.coveo-show-if-normal').fastToggle(!this.showingMoreResults);
                Coveo.$(this.element).find('.coveo-show-if-expanded').fastToggle(this.showingMoreResults);
            };
			
            ResultsRelated.prototype.scrollToResultElement = function () {
                var elementOffset = Coveo.$(this.element).closest('.CoveoResult').offset();
                var resultListElement = Coveo.$(this.root).find("." + Ui.Component.computeCssClassNameForType(Ui.ResultList.ID));
                var wasScrolled = false;
                if (resultListElement.length != 0) {
                    var resultList = resultListElement.coveo();
                    var resultListScrollContainer = resultList.options.mobileScrollContainer || resultList.options.infiniteScrollContainer;
                    var resultListIsScrollable = resultListScrollContainer.scrollHeight > Coveo.$(resultListScrollContainer).height();
                    if (resultListIsScrollable) {
                        wasScrolled = true;
                        Coveo.$(resultListScrollContainer).animate({
                            scrollTop: resultListScrollContainer.scrollTop + elementOffset.top - (Coveo.DeviceUtils.isMobileDevice() ? 50 : 0)
                        });
                    }
                }
                if (elementOffset.top < Coveo.$(window).scrollTop() && !wasScrolled) {
                    Coveo.$("html, body").animate({
                        scrollTop: elementOffset.top
                    });
                }
            };
            ResultsRelated.prototype.displayThoseResults = function (results) {
                var _this = this;
                this.results.empty();
				if (results.length==0)
				{
                    this.noResultsCaption = Coveo.$('<div/>').addClass('coveo-folding-header-caption').text(this.options.noResultsCaption).appendTo(this.results);
				}
				else
				{
                    this.titleCaption = Coveo.$('<div/>').addClass('coveo-folding-footer-section-for-less coveo-folding-footer').text(this.options.titleCaption).appendTo(this.results);
					this.titleCaption.css('position','relative').css('bottom','0px');
				}
                Coveo._.each(results, function (result) {
                    _this.renderChildResult(result);
                });
            };
            ResultsRelated.prototype.renderChildResult = function (childResult) {
                var oneChild = Coveo.$(this.options.resultTemplate.instantiateToElement(childResult)).addClass('coveo-child-result').appendTo(this.results);
                this.autoCreateComponentsInsideResult(oneChild.get(0), childResult);
            };
            ResultsRelated.prototype.autoCreateComponentsInsideResult = function (element, result) {
                Coveo.Assert.exists(element);
                var initOptions = this.searchInterface.options;
                var initParameters = Coveo.$.extend({}, { options: initOptions }, this.getBindings(), { result: result });
                Ui.CoveoJQuery.automaticallyCreateComponentsInside(element, initParameters);
            };
            
            ResultsRelated.ID = "ResultsRelated";
            ResultsRelated.options = {
                resultTemplate: Ui.ComponentOptions.buildTemplateOption({ defaultFunction: function () { return new Ui.DefaultResultTemplate(); } }),
                normalCaption: Ui.ComponentOptions.buildLocalizedStringOption(),
				titleCaption: Ui.ComponentOptions.buildLocalizedStringOption(),
                expandedCaption: Ui.ComponentOptions.buildLocalizedStringOption(),
                noResultsCaption: Ui.ComponentOptions.buildLocalizedStringOption(),
				query:Ui.ComponentOptions.buildLocalizedStringOption(),                 // The Advanced query to execute, fields are noted as [FIELD1][FIELD2] from the fields section
				fields:Ui.ComponentOptions.buildLocalizedStringOption(),             	  // The fields to use from the current result
				numberOfResults:Ui.ComponentOptions.buildNumberOption(),
				alwaysShow:Ui.ComponentOptions.buildBooleanOption({ defaultValue: false }),
				indent:Ui.ComponentOptions.buildNumberOption()
            };
            return ResultsRelated;
        })(Ui.Component);
        Ui.ResultsRelated = ResultsRelated;
        Coveo.Ui.CoveoJQuery.registerAutoCreateComponent(ResultsRelated);
    })(Ui = Coveo.Ui || (Coveo.Ui = {}));
})(Coveo || (Coveo = {}));
