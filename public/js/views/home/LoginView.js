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
      'submit form': 'login',
      'submit #logout': 'logout'
    },
    logout: function(e){
      e.preventDefault();
      $.getJSON('/api/v0/logout', function(data){
      });
    },
    login: function(e){
      e.preventDefault();
      var form = $(e.target);
      var self = this;
      var url = '/api/v0/login';
      console.log('Loggin in... ');
      var formValues = {
        name: form.find('#username').val(),
        password: form.find('#password').val()
      }
      console.log(formValues);
      //var model = this.usersCollection.find( function(model){ return model.get('name') === auth.name} );
      $.ajax({
          url:url,
          type:'POST',
          dataType:"json",
          data: formValues,
          success:function (data) {
            console.log(["Login request details: ", data]);
            if(data.error) {  // If there is an error, show the error messages
              //$('.alert-error').text(data.error.text).show();
            }
            else { // If not, send them back to the home page
              self.session = data;
              self.$el.remove('#login');
              window.location.replace('#');
            }
          }
      });
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
