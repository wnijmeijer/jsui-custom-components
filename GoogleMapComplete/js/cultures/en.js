(function() {
  var dict = {
      "Unknown": "Unknown",
      "And": "AND",
      "Authenticating": "Authenticating {0}...",
      "Clear": "Clear {0}",
      "CompleteQuery": "Complete Query",
      "Exclude": "Exclude {0}",
      "EnterTag": "Add Tag",
      "Next": "Next",
      "Last": "Last",
      "Link": "Link",
      "Or": "OR",
      "Previous": "Previous",
      "QueryDidntMatchAnyDocuments": "Your query did not match any documents.",
      "QueryException": "Your query has an error: {0}.",
      "Me": "Me",
      "Remove": "Remove",
      "Search": "Search",
      "SearchFor": "Search for {0}",
      "ShareQuery": "Share Query",
      "Preferences": "Preferences",
      "LinkOpeningSettings": "Link Opening Settings",
      "Reauthenticate": "Reauthenticate {0}",
      "ResultsFilteringExpression": "Results Filtering Expressions",
      "FiltersInYourPreferences": "Filters in your preferences",
      "Create": "Create",
      "SearchIn": "Search in {0}",
      "Seconds": "in {0} second<pl>s</pl>",
      "ShowingResultsOf": "Result<pl>s</pl> {0}<pl>-{1}</pl> of {2}",
      "SwitchTo": "Switch to {0}",
      "Unexclude": "Unexclude {0}",
      "ClearAllFilters": "Clear All Filters",
      "SkipLogin": "Skip login",
      "LoginInProgress": "Login in progress, please wait ...",
      "Login": "Log In",
      "GetStarted": "Get Started",
      "More": "More",
      "Less": "Fewer",
      "Settings": "Settings",
      "Score": "Score",
      "ScoreDescription": "The score is computed from the number of occurrences as well as from the position in the result set.",
      "Occurrences": "Occurrences",
      "OccurrencesDescription": "Sort by number of occurrences, with values having the highest number appearing first.",
      "Label": "Label",
      "Of": "of",
      "LabelDescription": "Sort alphabetically on the field values.",
      "Value": "Value",
      "ValueDescription": "Sort on the values of the first computed field",
      "AlphaAscending": "Value Ascending",
      "AlphaDescending": "Value Descending",
      "ChiSquare": "Chi Square",
      "Nosort": "No Sort",
      "RelativeFrequency": "Relative Frequency",
      "RelativeFrequencyDescription": "Sort based on the relative frequency of values. Less common values will appear higher",
      "Custom": "Custom",
      "CustomDescription": "Sort based on a custom order",
      "ComputedField": "Computed Field",
      "Ascending": "Ascending",
      "Descending": "Descending",
      "noResultFor": "No results for {0}",
      "autoCorrectedQueryTo": "Query was automatically corrected to {0}",
      "didYouMean": "Did you mean: {0}",
      "SuggestedResults": "Suggested Results",
      "SuggestedQueries": "Suggested Queries",
      "MostRelevantItems": "Most relevant items:",
      "AllItems": "All items:",
      "ShowLess": "Show less",
      "ShowMore": "Show more",
      "HideFacet": "Hide Facet",
      "ShowFacet": "Show Facet",
      "AndOthers": "and {0} other<pl>s</pl>",
      "MostRelevantPosts": "Most Relevant Posts:",
      "CompleteThread": "Complete Thread:",
      "ShowCompleteThread": "Show Complete Thread",
      "ShowOnlyTopMatchingPosts": "Show Only Top Matching Posts",
      "MostRelevantReplies": "Most Relevant Replies:",
      "AllConversation": "All Conversation:",
      "ShowAllConversation": "Show All Conversation",
      "ShowAllReplies": "Show All Replies",
      "ShowOnlyMostRelevantReplies": "Show Only Most Relevant Replies",
      "Close": "Close",
      "Open": "Open",
      "OpenInOutlookWhenPossible": "Open in Outlook (when possible)",
      "AlwaysOpenInNewWindow": "Always open results in new window",
      "QuickView": "Quick View",
      "ErrorReport": "Error Report",
      "OopsError": "Oops! Something went wrong on the server.",
      "ProblemPersists": "If the problem persists contact the administrator.",
      "GoBack": "Go Back",
      "Reset": "Reset",
      "Retry": "Retry",
      "MoreInfo": "More Information",
      "Username": "Username",
      "Password": "Password",
      "CannotConnect": "Cannot connect to the server address.",
      "BadUserPass": "Password does not match with user name.",
      "PleaseEnterYourCredentials": "Please enter your credentials for {0}.",
      "PleaseEnterYourSearchPage": "Please enter your search page URL",
      "Collapse": "Collapse",
      "Expand": "Expand",
      "Today": "Today",
      "Yesterday": "Yesterday",
      "Tomorrow": "Tomorrow",
      "Duration": "Duration: {0}",
      "IndexDuration": "Index Duration: {0}",
      "ProxyDuration": "Proxy Duration: {0}",
      "ClientDuration": "Client Duration: {0}",
      "Unavailable": "Unavailable",
      "Reply": "Reply",
      "ReplyAll": "Reply All",
      "Forward": "Forward",
      "From": "From",
      "Caption": "Caption",
      "Expression": "Expression",
      "Tab": "Tab",
      "Tabs": "Tabs",
      "EnterExpressionName": "Enter Expression Name",
      "EnterExpressionToFilterWith": "Enter Expression To Filter Results With",
      "SelectTab": "Select Tab",
      "SelectAll": "Select All",
      "PageUrl": "Search page URL",
      "ErrorSavingToDevice": "Error while saving the information to your device",
      "ErrorReadingFromDevice": "Error while reading the information from your device",
      "AppIntro": "Speak with a product specialist who can answer your questions about Coveo and help your decide which Coveo solution is right for you. Or, try a live demo !",
      "TryDemo": "Try the demo",
      "ContactUs": "Contact us",
      "NewToCoveo": "New to Coveo ?",
      "LetUsHelpGetStarted": "Let us help you get started",
      "CannotConnectSearchPage": "Cannot connect to your search page",
      "AreYouSureDeleteFilter": "Are you sure you want to delete the filter {0} with the expression {1}",
      "OnlineHelp": "Online Help",
      "Done": "Done",
      "SaveFacetState": "Save this facet state",
      "ClearFacetState": "Clear facet state",
      "DisplayingTheOnlyMessage": "Displaying the only message in this conversation",
      "NoNetworkConnection": "No network connection",
      "UnknownConnection": "Unknown connection",
      "EthernetConnection": "Ethernet connection",
      "WiFi": "WiFi connection",
      "CELL": "Cellular connection",
      "CELL_2G": "Cellular 2G connection",
      "CELL_3G": "Cellular 3G connection",
      "CELL_4G": "Cellular 4G connection",
      "QueryExceptionNoException": "No exception",
      "QueryExceptionInvalidSyntax": "Invalid syntax",
      "QueryExceptionInvalidCustomField": "Invalid custom field",
      "QueryExceptionInvalidDate": "Invalid date",
      "QueryExceptionInvalidExactPhrase": "Invalid exact phrase",
      "QueryExceptionInvalidDateOp": "Invalid date operator",
      "QueryExceptionInvalidNear": "Invalid Near",
      "QueryExceptionInvalidWeightedNear": "Invalid weighted near",
      "QueryExceptionInvalidTerm": "Invalid term",
      "QueryExceptionTooManyTerms": "Too many terms",
      "QueryExceptionWildcardTooGeneral": "Wildcard too general",
      "QueryExceptionInvalidSortField": "Invalid sort field",
      "QueryExceptionInvalidSmallStringOp": "Invalid small string operator",
      "QueryExceptionRequestedResultsMax": "Requested results maximum",
      "QueryExceptionAggregatedMirrorDead": "Aggregated mirror is offline",
      "QueryExceptionAggregatedMirrorQueryTimeOut": "Aggregated mirror query timeout",
      "QueryExceptionAggregatedMirrorInvalidBuildNumber": "Aggregated mirror invalid build number",
      "QueryExceptionAggregatedMirrorCannotConnect": "Aggregated mirror cannot connect",
      "QueryExceptionNotEnoughLeadingCharsWildcard": "Not enough leading character wildcard",
      "QueryExceptionSecurityInverterNotFound": "Security inverter not found",
      "QueryExceptionSecurityInverterAccessDenied": "Security inverter access denied",
      "QueryExceptionAggregatedMirrorCannotImpersonate": "Aggregated mirror cannot impersonate",
      "QueryExceptionUnexpected": "Unexpected",
      "QueryExceptionAccessDenied": "Access denied",
      "QueryExceptionSuperUserTokenInvalid": "Super user token invalid",
      "QueryExceptionSuperUserTokenExpired": "Super user token is expired",
      "QueryExceptionLicenseQueriesExpired": "Queries license expired",
      "QueryExceptionLicenseSuperUserTokenNotSupported": "License super user token not supported",
      "QueryExceptionInvalidSession": "Invalid session",
      "QueryExceptionInvalidDocument": "Invalid document",
      "QueryExceptionSearchDisabled": "Search disabled",
      "objecttype_people": "People",
      "objecttype_message": "Message",
      "objecttype_feed": "RSS Feed",
      "objecttype_thread": "Thread",
      "objecttype_board": "",
      "objecttype_category": "",
      "objecttype_account": "Account",
      "objecttype_campaign": "Campaign",
      "objecttype_case": "Case",
      "objecttype_contact": "Contact",
      "objecttype_contract": "Contract",
      "objecttype_event": "Event",
      "objecttype_lead": "Lead",
      "objecttype_solution": "Solution",
      "objecttype_task": "Task",
      "objecttype_user": "User",
      "objecttype_attachment": "Attachment",
      "objecttype_casecomment": "Case Comment",
      "objecttype_opportunity": "Opportunity",
      "objecttype_note": "Note",
      "objecttype_product": "Product",
      "objecttype_partner": "Partner",
      "objecttype_kbdocumentation": "Documentation",
      "objecttype_kbsolution": "Solution",
      "objecttype_kbknowledgearticle": "Knowledge Article",
      "objecttype_kbattachment": "Attachment",
      "sysfiletype_html": "HTML File",
      "sysfiletype_image": "Image",
      "sysfiletype_folder": "Folder",
      "sysfiletype_txt": "Text",
      "sysfiletype_zip": "Zip File",
      "sysfiletype_pdf": "PDF File",
      "sysfiletype_xml": "XML File",
      "sysfiletype_doc": "Word Document",
      "sysfiletype_xls": "Excel Document",
      "sysfiletype_ppt": "PowerPoint Document",
      "sysfiletype_video": "Video",
      "sysfiletype_exchangemessage": "Message",
      "sysfiletype_exchangeappointment": "Appointment",
      "sysfiletype_exchangenote": "Note",
      "sysfiletype_exchangetask": "Task",
      "sysfiletype_exchangeperson": "Exchange user",
      "sysfiletype_activedirperson": "Active Directory user",
      "sysfiletype_exchangeactivity": "Activity",
      "sysfiletype_exchangecalendarmessage": "Calendar message",
      "sysfiletype_exchangedocument": "Exchange document",
      "sysfiletype_exchangerssfeed": "RSS Feed",
      "sysfiletype_exchangejunkmessage": "Junk email",
      "sysfiletype_exchangeofficecom": "Communications",
      "sysfiletype_spportal": "Portal",
      "sysfiletype_spsite": "Site",
      "sysfiletype_spuserprofile": "SharePoint User",
      "sysfiletype_sparea": "Area",
      "sysfiletype_spannouncement": "Announcement",
      "sysfiletype_spannouncementlist": "Announcements",
      "sysfiletype_spcontact": "Contact",
      "sysfiletype_spcontactlist": "Contacts",
      "sysfiletype_spcustomlist": "Custom Lists",
      "sysfiletype_spdiscussionboard": "Discussion Board",
      "sysfiletype_spdiscussionboardlist": "Discussion Boards",
      "sysfiletype_spdocumentlibrarylist": "Document Library",
      "sysfiletype_spevent": "Event",
      "sysfiletype_speventlist": "Events",
      "sysfiletype_spformlibrarylist": "Form Library",
      "sysfiletype_spissue": "Issue",
      "sysfiletype_spissuelist": "Issues",
      "sysfiletype_splink": "Link",
      "sysfiletype_splinklist": "Links",
      "sysfiletype_sppicturelibrarylist": "Picture Library",
      "sysfiletype_spsurvey": "Survey",
      "sysfiletype_spsurveylist": "Surveys",
      "sysfiletype_sptask": "Task",
      "sysfiletype_sptasklist": "Tasks",
      "sysfiletype_spagenda": "Agenda",
      "sysfiletype_spagendalist": "Agendas",
      "sysfiletype_spattendee": "Attendee",
      "sysfiletype_spattendeelist": "Attendees",
      "sysfiletype_spcustomgridlist": "Custom Grids",
      "sysfiletype_spdecision": "Decision",
      "sysfiletype_spdecisionlist": "Decisions",
      "sysfiletype_spobjective": "Objective",
      "sysfiletype_spobjectivelist": "Objectives",
      "sysfiletype_sptextbox": "Textbox",
      "sysfiletype_sptextboxlist": "Textbox list",
      "sysfiletype_spthingstobring": "Thing To Bring",
      "sysfiletype_spthingstobringlist": "Things To Bring",
      "sysfiletype_sparealisting": "Area Listing",
      "sysfiletype_spmeetingserie": "Meeting series",
      "sysfiletype_spmeetingserielist": "Meeting Series List",
      "sysfiletype_spsitedirectory": "Site Directory Item",
      "sysfiletype_spsitedirectorylist": "Site Directory",
      "sysfiletype_spdatasource": "Data Source",
      "sysfiletype_spdatasourcelist": "Data Source List",
      "sysfiletype_splisttemplatecataloglist": "List Template Catalog List",
      "sysfiletype_spwebpartcataloglist": "WebPart catalog list",
      "sysfiletype_spwebtemplatecataloglist": "Web Template Catalog List",
      "sysfiletype_spworkspacepagelist": "Workspace Page List",
      "sysfiletype_spunknownlist": "Custom List",
      "sysfiletype_spadministratortask": "Administrator Task",
      "sysfiletype_spadministratortasklist": "Administrator Tasks",
      "sysfiletype_spareadocumentlibrarylist": "Area Document Library",
      "sysfiletype_spblogcategory": "Blog Category",
      "sysfiletype_spblogcategorylist": "Blog Category",
      "sysfiletype_spblogcomment": "Blog Comment",
      "sysfiletype_spblogcommentlist": "Blog Comments",
      "sysfiletype_spblogpost": "Blog Post",
      "sysfiletype_spblogpostlist": "Blog Posts",
      "sysfiletype_spdataconnectionlibrarylist": "Data Connection Library",
      "sysfiletype_spdistributiongroup": "Distribution Group",
      "sysfiletype_spdistributiongrouplist": "Distribution Groups",
      "sysfiletype_spipfslist": "InfoPath Form Servers",
      "sysfiletype_spkeyperformanceindicator": "Key Performance Indicator",
      "sysfiletype_spkeyperformanceindicatorlist": "Key Performance Indicators",
      "sysfiletype_splanguagesandtranslator": "Languages and Translator",
      "sysfiletype_splanguagesandtranslatorlist": "Languages and Translators",
      "sysfiletype_spmasterpagescataloglist": "Master Pages Library",
      "sysfiletype_spnocodeworkflowlibrarylist": "No Code Workflow Library",
      "sysfiletype_spprojecttask": "Project Task",
      "sysfiletype_spprojecttasklist": "Project Tasks",
      "sysfiletype_sppublishingpageslibrarylist": "Page Library",
      "sysfiletype_spreportdocumentlibrarylist": "Report Document Library",
      "sysfiletype_spreportlibrarylist": "Report Library",
      "sysfiletype_spslidelibrarylist": "Slide Library",
      "sysfiletype_sptab": "Tabs",
      "sysfiletype_sptablist": "Tabs List",
      "sysfiletype_sptranslationmanagementlibrarylist": "Translation Management Library",
      "sysfiletype_spuserinformation": "User Information",
      "sysfiletype_spuserinformationlist": "User Information List",
      "sysfiletype_spwikipagelibrarylist": "Wiki Page Library",
      "sysfiletype_spworkflowhistory": "Workflow History",
      "sysfiletype_spworkflowhistorylist": "Workflow Histories",
      "sysfiletype_spworkflowprocess": "Custom Workflow Process",
      "sysfiletype_spworkflowprocesslist": "Custom Workflow Processes",
      "sysfiletype_sppublishingimageslibrarylist": "Publishing Image Library",
      "sysfiletype_spcirculation": "Circulation",
      "sysfiletype_spcirculationlist": "Circulations",
      "sysfiletype_spdashboardslibrarylist": "Dashboard Library",
      "sysfiletype_spdataconnectionforperformancepointlibrarylist": "Data Connection for Performance Point Library",
      "sysfiletype_sphealthreport": "Health Report",
      "sysfiletype_sphealthreportlist": "Health Reports",
      "sysfiletype_sphealthrule": "Health Rule",
      "sysfiletype_sphealthrulelist": "Health Rules",
      "sysfiletype_spimedictionary": "IME Dictionary",
      "sysfiletype_spimedictionarylist": "IME Dictionaries",
      "sysfiletype_spperformancepointcontent": "Performance Point Content",
      "sysfiletype_spperformancepointcontentlist": "Performance Point Contents",
      "sysfiletype_spphonecallmemo": "Phone Call Memo",
      "sysfiletype_spphonecallmemolist": "Phone Call Memos",
      "sysfiletype_sprecordlibrarylist": "Record Library",
      "sysfiletype_spresource": "Resource",
      "sysfiletype_spresourcelist": "Resources",
      "sysfiletype_spprocessdiagramslibrarylist": "Process Diagram Library",
      "sysfiletype_spsitethemeslibrarylist": "Site Theme Library",
      "sysfiletype_spsolutionslibrarylist": "Solution Library",
      "sysfiletype_spwfpublibrarylist": "WFPUB Library",
      "sysfiletype_spwhereabout": "Whereabout",
      "sysfiletype_spwhereaboutlist": "Whereabouts",
      "sysfiletype_spdocumentlink": "Link to a Document",
      "sysfiletype_spdocumentset": "Document Set",
      "sysfiletype_spmicrofeedpost": "Microfeed Post",
      "sysfiletype_spmicrofeedlist": "Microfeed",
      "sysfiletype_splistfolder": "List Folder",
  }
  var locales = String["locales"] || (String["locales"] = {});
  locales["en"] = dict;
  String["toLocaleString"].call(this, { "en": dict });
  String["locale"] = "en";
  String["defaultLocale"] = "en";
})();
/*
 * Globalize Culture en-US
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */

(function( window, undefined ) {

var Globalize;

if ( typeof require !== "undefined" &&
	typeof exports !== "undefined" &&
	typeof module !== "undefined" ) {
	// Assume CommonJS
	Globalize = require( "globalize" );
} else {
	// Global variable
	Globalize = window.Globalize;
}

Globalize.addCultureInfo( "en-US", "default", {
	name: "en-US",
	englishName: "English (United States)"
});

}( this ));
