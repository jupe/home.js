define([
  'jquery',
  'underscore',
  'backbone',
  'models/user/UserModel',
  'collections/users/UsersCollection',
  'views/sidebar/SidebarInfoView',
  'text!templates/home/loginTemplate.html'
], function($, _, Backbone, UserModel, UsersCollection, SidebarView, loginTemplate){

  var LoginView = Backbone.View.extend({
    el: $("#page"),
    initialize: function(){
      this.usersCollection = new UsersCollection;
      this.usersCollection.fetch();
      this.session = false;
    },
    events: {
      'submit form': 'submit'
    },
    
    submit: function(e){
      e.preventDefault();
      console.log('login..');      
      var form = $(e.target);
      var self = this;
      var auth = {
        name: form.find('#username').val(),
        password: form.find('#password').val()
      }
      console.log(auth);
      var model = this.usersCollection.find( function(model){ return model.get('name') === auth.name} );
      if( model ) {
        console.log('username exists, check pwd');
        this.usersCollection.create( auth, {
          success: function(model, response){
            console.log('login success');
            self.session = response;
            self.$el.remove('#login');
          }, error: function(model, response){
            console.log(response);
            console.log('login fail');
          }
        });
      } else {
        console.log('invalid username');
      }
    },

    render: function(){
      console.log('render loginView');
      //$('.menu li').removeClass('active');
      //$('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      if( this.session ) {
        //there might be better solution for check if session  already exists
      } else {
        this.$el.html(loginTemplate);
      }
    }

  });

  return LoginView;
  
});
