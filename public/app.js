$(function() {
  var username;
  var adRef = new Firebase('https://taehwanjo.firebaseio.com/brochure');
  var userRef;

  var auth = new FirebaseSimpleLogin(adRef, function(error, user) {
    if (error) {
      alert(error);
    } else if (user) {
      $('.loggedin').removeClass('hidden');
      username = user.username;
      console.log(username);

      adRef.child(username).once('value', function(snapshot){
        console.log('adRef CHILD saraloves snapshot val is: ', snapshot.val());
        if (snapshot.val() === null) {
          //create a new user object with blank fields
          //(and then do work);
          adRef.push(username, function(){
            var defaultContent = "Click to edit";
            var defaultName = "Click to enter your name";
            var highlightText = "<ul><li>Please follow this format</li><li>To list out all the highlights</li><li>During your wonderful experience with Hack Reactor!</li><li>Please make it about this long</li><li>Ex: Learned programming by writing basic functions and FNUPlots to explore pathfinding via ant simulations.</li></ul>";
            var codingText = "\"Please click here to write an awesome quote about your coding insights.  This is your opportunity to display not only your smarts, but also your personality! Feel free to make it longer but it'll be way ugly.\"";

            adRef.child(username).set({fullname: "Click to enter your name", coding_insight: codingText, core: "Javascript, Backbone.js, Angular.js, Node.js", notable_experience: "[]", github: "http://github.com/" + username, highlights: highlightText, photo: 0 });
            userRef = adRef.child(username);
            displayData();
          });
        } else {
          userRef = adRef.child(username);
          displayData();
        }
      });

    } else {
      $('.loggedout').removeClass('hidden');
    }
  });

  $('.login').on('click', function() {
    $('.loggedout').addClass('hidden');
    auth.login('github', {
      rememberMe: true,
      scope: 'user: email'
    });
  });

  $(".logout").on('click', function(){
    $('.loggedin').addClass('hidden');
    auth.logout();
    location.reload();
  });

  var displayData = function() {
  //displaying data from database on screen
  userRef.once('value', function(snapshot){
     var notable = "";
     var eventTags = $('#notableexp');
     
    var parsedNotable = JSON.parse(snapshot.val().notable_experience);

    if (parsedNotable.length>0) {
      var notableList = "";
      for (var i = 0; i < parsedNotable.length; i++) {
        notable += "<li>" + parsedNotable[i] + "</li>";
      }
      $('#notableexp').append(notable);
    }
    var addEvent = function(text) {
      userRef.child('notable_experience').once('value', function(snapshot){
        var notableArray = JSON.parse(snapshot.val());
        notableArray.push(text);
        userRef.child('notable_experience').set(JSON.stringify(notableArray));
      });
    };

    var deleteEvent = function(text) {
      userRef.child('notable_experience').once('value', function(snapshot){
        var notableArray = JSON.parse(snapshot.val());
        for (var i=0; i<notableArray.length; i++) {
          if(notableArray[i] === text){
            notableArray.splice(i, 1);
          }
        }
        userRef.child('notable_experience').set(JSON.stringify(notableArray));
      });
    };

    eventTags.tagit({
        availableTags: sampleTags,
        afterTagAdded: function(evt, ui) {
            if (!ui.duringInitialization) {
                addEvent(eventTags.tagit('tagLabel', ui.tag));
            }
        },
        afterTagRemoved: function(evt, ui) {
            deleteEvent(eventTags.tagit('tagLabel', ui.tag));
        }
    });
  });

  $('#buttoncontainer').attr('action', "/upload/" + username);

  userRef.on('value', function(snapshot) {
    var highlights = snapshot.val().highlights;
    var coding_insight = snapshot.val().coding_insight;
    var github = snapshot.val().github;
    var core = snapshot.val().core;
    var fullname = snapshot.val().fullname;

    if (snapshot.val().photo) {
      $('#studentpic').attr('src', '/imageuploads/' + username);
      $('#studentpic').removeClass('hidden');
      $('#buttoncontainer').addClass('hidden');
    } else {
      $('#studentpic').attr('src', '/imageuploads/placeholder.png');
      $('#studentpic').removeClass('hidden');
      $('#buttoncontainer').removeClass('hidden');
    }
    $('#github').html(github);
    $('#highlights').html(highlights);
    $('#coding_insight').html(coding_insight);
    $('#core').html(core);
    $('#fullname').html(fullname);
  });

    $("#fullname").editable("post/"+ username + "/fullname", { 
      indicator : "<img src='img/indicator.gif'>",
      type   : 'textarea',
      submitdata: { _method: "post" },
      select : true,
      submit : 'OK',
      cancel : 'cancel',
      cssclass : "editable"
   });

  $("#highlights").editable("post/"+ username + "/highlights", { 
      indicator : "<img src='img/indicator.gif'>",
      type   : 'textarea',
      submitdata: { _method: "post" },
      select : true,
      submit : 'OK',
      cancel : 'cancel',
      cssclass : "editable"
   });

  $("#coding_insight").editable("post/" + username + "/coding_insight", { 
      indicator : "<img src='img/indicator.gif'>",
      type   : 'textarea',
      submitdata: { _method: "post" },
      select : true,
      submit : 'OK',
      cancel : 'cancel',
      cssclass : "editable"
   });
  $(":file").change(function(){
    $('#buttoncontainer').append('<input type="submit" class="upload" value="Upload"/>');
  });
  };

  //tag logic
  var sampleTags = ['c++', 'java', 'php', 'coldfusion', 'javascript', 'asp', 'ruby', 'python', 'c', 'scala', 'groovy', 'haskell', 'perl', 'erlang', 'apl', 'cobol', 'go', 'lua'];
  $('#corecurriculum').tagit({
      availableTags: sampleTags,
      itemName: 'item',
      fieldName: 'tags'
  });
  $('#readOnlyTags').tagit({
      readOnly: true
  });
  $('#methodTags').tagit({
      availableTags: sampleTags
  });
  $('#allowSpacesTags').tagit({
      availableTags: sampleTags,
      allowSpaces: true
  });
  $('#removeConfirmationTags').tagit({
      availableTags: sampleTags,
      removeConfirmation: true
  });
});