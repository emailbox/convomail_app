
App.Router = Backbone.Router.extend({

	routes: {
		
		'body' : 'body',         // entry point: no hash fragment or #

		'body_login' : 'body_login',
		'body_unreachable_server' : 'body_unreachable_server',

		'home' : 'home',

		'conversations' : 'conversations',
		'people' : 'people',

		// View email/thread
		'view_conversation/:convo_id' : 'view_conversation',
		'view_conversation/:convo_id/:returnpage' : 'view_conversation',

		// Reply
		'reply/:convo_id' : 'reply',

		'settings' : 'settings',
		'stats' : 'stats',
		'launch_settings' : 'launch_settings',

		'confirm_logout' : 'confirm_logout',
		'logout' : 'logout'
		
	},

	showView: function(hash, view, view_key){
		// Used to discard zombies
		
		if (!this.currentView){
			this.currentView = {};
		}
		if (this.currentView && this.currentView[hash]){
			this.currentView[hash].view.close();
		}
		this.currentView[hash] = {
			key: view_key, // usually undefined
			view: view.render()
		}
	},

	getView: function(hash, view_key){
		// Returns boolean

		// returns string if view_key not set
		if(view_key == undefined){
			return this.currentView[hash].key;
		}

		// Any view?
		if (!this.currentView){
			return false;
		}

		// Is this the current view already? (just clicking refresh)
		if(this.currentView[hash] && this.currentView[hash].key == view_key && view_key){
			return true;
		}

		return false;

	},

	emitView: function(hash, event){
		// Emit an event to the specified view (like a 'refresh')

		// Is this the current view already? (just clicking refresh)
		this.currentView[hash].view.trigger(event);

	},


	body: function(){

		// Body
		// console.log(App.Models.Search);
		var page = new App.Views.Body();
		$('body').append(page.$el);
		App.router.showView('body',page);

	},


	body_login: function(){
		// Redirect through OAuth

		// Unless user_token is already in querystring
		
		if(typeof App.Credentials.access_token != 'string' || App.Credentials.prefix_access_token.length < 1){
			
			// var qs = App.Utils.getUrlVars();
			var oauthParams = App.Utils.getOAuthParamsInUrl();
			// console.log('oauthParams');
			// console.log(oauthParams);
			// alert('oauth');
			// return false;

			// if(typeof qs.user_token == "string"){
			if(typeof oauthParams.access_token == "string"){

				// Have an access_token
				// - save it to localStorage
				// localStorage.setItem(App.Credentials.prefix_access_token + 'user',oauthParams.user_identifier);
				// localStorage.setItem(App.Credentials.prefix_access_token + 'access_token',oauthParams.access_token);
				
				// // Reload page, back to #home
				// window.location = [location.protocol, '//', location.host, location.pathname].join('');
			} else {
				// Show login splash screen
				var page = new App.Views.BodyLogin();
				App.router.showView('bodylogin',page);
			}

		} else {
			// Reload page, back to #home
			window.location = [location.protocol, '//', location.host, location.pathname].join('');
			return;
		} 



	},


	body_unreachable_server: function(){
		// Unable to reach emailbox, reload

		var page = new App.Views.BodyUnreachable();
		App.router.showView('bodylogin',page);


	},


	conversations: function(){
		// Display the "inbox" (our version of an inbox)

		// Already displaying all?
		// - just refresh
		if(App.router.getView('main_view', 'conversations')){
			App.router.emitView('main_view', 'refresh');
			return;
		}

		// Does page already exist?
		// - some pages just stay in memory, do not get .close unless by force
		var page;
		if(!App.Data.PermaViews.conversations){
			// Create page for first time
			App.Data.PermaViews.conversations = new App.Views.Conversations();

			// Display 

		} else {

		}

		// Display page
		$('.body_container').html(App.Data.PermaViews.conversations.$el);
		App.router.showView('main_view',App.Data.PermaViews.conversations, 'conversations');
	},


	people: function(){
		// Display the "inbox" (our version of an inbox)

		// Already displaying all?
		// - just refresh
		if(App.router.getView('main_view', 'people')){
			App.router.emitView('main_view', 'refresh');
			return;
		}

		// Does page already exist?
		// - some pages just stay in memory, do not get .close unless by force
		var page;
		if(!App.Data.PermaViews.people){
			// Create page for first time
			App.Data.PermaViews.people = new App.Views.People();

			// Display 

		} else {

		}

		// Display page
		$('.body_container').html(App.Data.PermaViews.people.$el);
		App.router.showView('main_view',App.Data.PermaViews.people, 'people');
	},


	view_conversation: function(convo_id){

		var page = new App.Views.CommonConversation({
			convo_id: convo_id
		});
		// Hide other .main_body
		$('.main_body').addClass('nodisplay');

		// Add to page
		$('body').append(page.$el);
		App.router.showView('conversation',page); // don't want to delete 'undecided' view because we go back to it and want to save position

	},


	reply: function(threadid){

		var page = new App.Views.CommonReply({
			threadid: threadid
		});
		// Hide other .main_body(s)
		$('body > div').addClass('nodisplay');

		// Add to page
		$('body').append(page.$el);
		App.router.showView('reply',page); // don't want to delete 'common_thread' view because we go back to it and want to save position

	},


	confirm_logout: function(){
		// Already displaying menu?
		if($('div.logout').length > 0){
			$('div.logout').remove();
		} else {
			var page = new App.Views.Logout();
			$('body').append(page.$el);
			App.router.showView('logout',page);
		}
	},


	logout: function(){
		// Logout

		// alert('Logging out');

		// Reset user_token
		if(useForge){

			// Unsubscribe
			App.Plugins.Convomail.unsubscribe_from_push()
				.then(function(){

					// Clear prefs
					forge.prefs.clearAll(function(){
						$('body').html('');
						window.location = [location.protocol, '//', location.host, location.pathname].join('');
					},function(err){
						alert('Failed signing out');
						console.log('failed signing out');
						console.log(err);
					});

				});

		} else if(usePg) {

			// Unsubscribe from Push Notifications
			// - todo...
			App.Data.pushNotification.unregister(function(){
				// Success
				console.log('Unsubscribed from Push OK');
			}, function(){
				// Error
				console.log('Failed Unsubscribe from Push');
			});

			// Clear preferences (including file preferences)
			window.localStorage.clear();
			App.Data.InMemory = {};
			App.Events.trigger('FileSave',true);

			// Clear HTML
			$('body').html('');
			window.location = [location.protocol, '//', location.host, location.pathname].join('');

		} else {
			localStorage.clear();//(App.Credentials.prefix_user_token + 'user_token','');
			window.location = [location.protocol, '//', location.host, location.pathname].join('');
		}

	},

	launch_settings: function(){
		
		// Only launches settings if we're on the main view
		// - should figure out what view is currently displayed, and emit the "menuclicked" event to that View (to handle as appropriate)

		if($('.main_body').hasClass('nodisplay')){
			// Don't show settings, not on the main page
		} else {
			Backbone.history.loadUrl('settings');
		}


	},

	settings: function(){
		
		// // Confirm they want to open settings
		// var c = confirm('Go to Settings?');
		// if(!c){
		// 	return;
		// }

		var page = new App.Views.Settings();
		// Hide other .main_body
		$('.main_body').addClass('nodisplay');

		// Add to page
		$('body').append(page.$el);
		App.router.showView('settings',page); // don't want to delete 'undecided' view because we go back to it and want to save position

	},

	stats: function(){

		var page = new App.Views.Stats();
		// Hide other .main_body
		$('.main_body').addClass('nodisplay');

		// Add to page
		$('body').append(page.$el);
		App.router.showView('stats',page); // don't want to delete 'undecided' view because we go back to it and want to save position

	}


});
