angular
  .module('Feed')
  .controller('PostController', function($scope, $interval, $timeout, supersonic){

    var width = window.innerWidth;

    // Set up database
    /*
    var config =
      {
        apiKey: "<API_KEY>",
        authDomain: "<PROJECT_ID>.firebaseapp.com",
        databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
        storageBucket: "<BUCKET>.appspot.com",
        messagingSenderId: "<SENDER_ID>"
      }
    */


    firebase.initializeApp(config);
    var database = firebase.database();
    $scope.publicIds = [];

    // Cloudinary Setting

    $.cloudinary.config({
      cloud_name: "daxutqqyt"
    });

    // For compatibility on Android
    $(".cloudinary_fileupload").attr("accept", "image/*;capture=camera");

    $('.upload_form').append($.cloudinary.unsigned_upload_tag("mmbawtto", {
      cloud_name: 'daxutqqyt',
      tags: "browser_uploads"
    }))

    // After photo is uploaded, callbacks follow to show images (+ progress bar if wished)
    .bind("cloudinarydone", function(e, data) {
      $(".prevImage").remove();
      $(".preview").append("<div class='prevImage' id=" + data.result.public_id + "></div>");
      $("#" + data.result.public_id).append($.cloudinary.image(data.result.public_id, {
          format: data.result.format,
          version: data.result.version,
          crop: "fill",
          width: 300,
          height: 300
        }))
        // .append("<button class="+data.result.public_id+">X</button>");

      $scope.publicIds.push(data.result.public_id);
      $scope.image = "http://res.cloudinary.com/daxutqqyt/image/upload/v1478125497/" + $scope.publicIds.pop();
      $(".progress_bar").css("width", 0 + "%");
      flag = true;
      if (flag) {
        $("#placeholder").css("display", "none");
      }
    })

    .bind("cloudinaryprogress", function(e, data) {
      $(".progress_bar").css("width",
        Math.round((data.loaded * 100.0) / data.total) + "%");
    });


    $scope.user = localStorage.getItem('snail_usr');

    $scope.image = 'https://s15.postimg.org/4il31c7cr/fill_in.png';

    $scope.pushData = function() {
      supersonic.logger.log("???");

      var recv_acc = '/users/' + $scope.receiver + '/messages/' + $scope.user;
      var ref = database.ref().child(recv_acc);

      var currentTime = Date.now();
      var futureTime = Math.floor(2000*60 + 3000*60*Math.random()) + currentTime ;

      var data = {
        'image': $scope.image,
        'message': $scope.caption,
        'timestamp': currentTime,
        'timestampFuture': futureTime,
        'read': 0,
        'delivered': 0
      }


      ref.push(data);

      $scope.image = "";
      $scope.caption = "";
      $scope.receiver = "";

      $(".preview").empty();

      $("#myModal2").modal();

    }

    $scope.dismiss = function(){
      supersonic.ui.layers.pop();
    }

  if ($scope.user) {
    $scope.contacts = [];
    $scope.loadContact = (function() {
      var ref = "/users/" + $scope.user + "/contacts";
      database.ref(ref).once('value').then(function (snapshot) {
        var data = snapshot.val();
        for (var prop in data) {
          $scope.contacts.push(data[prop]);
        }
      })

    })();
  }

  $scope.contactVisible = false;
  $scope.receiver = "";

  $scope.showContacts = function () {
    $scope.contactVisible = true;
    supersonic.logger.log("showContacts");
  }
  $scope.selectFriend = function(input) {
    $scope.receiver = input;
    $scope.contactVisible = false;
    supersonic.logger.log("selectFriend");
  }

  supersonic.ui.views.current.whenVisible( function(){
    if (steroids.view.params.id) {
      var clickParams = steroids.view.params.id;
      var arr = clickParams.split(",");
      $scope.receiver = arr[0]
    }
  });



});