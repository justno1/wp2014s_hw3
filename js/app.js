//Application Key : D1QUmCsQ8oUa8LSLHOWbHLNI6AXuTBlA4W13spz1
//JavaScript Key : x0kPunkKrfmiMmBj4iIoci4UTh0uJOV80ffLRMfj

(function(){

 //初始化Parse();
  Parse.initialize("D1QUmCsQ8oUa8LSLHOWbHLNI6AXuTBlA4W13spz1","x0kPunkKrfmiMmBj4iIoci4UTh0uJOV80ffLRMfj");

 //編譯template engine函數();
  var templates = {};
  ['loginView','evaluationView','updateSuccessView'].forEach(function(e){
    var dom = document.getElementById(e).text;
    templates[e] = doT.template(dom);
  }); 

// 可選-編寫共用函數();
  var pagingCheck = {
    loginRequiredView: function(ViewFunction){
      return function(){
        var currentUser = Parse.User.current();
        if(currentUser){
          ViewFunction();
        }else{
          window.location.hash = "login/";
        }
      }
    },
  };

 var handler = {

   navbarFunc: function(){
    var currentUser = Parse.User.current();
    
     if(currentUser){

 //      顯示哪些button();
       document.getElementById('loginButton').style.display = "none"; 
       document.getElementById('evaluationButton').style.display = "display"; 
       document.getElementById('logoutButton').style.display = "display"; 

     } else {

 //      顯示哪些button();    
       document.getElementById('loginButton').style.display = "display"; 
       document.getElementById('evaluationButton').style.display = "none"; 
       document.getElementById('logoutButton').style.display = "none"; 
     }

     document.getElementById('logoutButton').addEventListener("click",function(){
      Parse.User.logOut();
      handler.navbarFunc();
      window.location.hash = "login/";
     })
   },

   logInViewFunc: function(redirect){
  //   把版型印到瀏覽器上();
      document.getElementById('content').innerHTML = templates.loginView();

      var currentUser = Parse.User.current();
      var postAction = function(){
        handler.navbarFunc();
  //      alert("HAHAHA");
        window.location.hash = (redirect) ? redirect : '';
      }

      if(currentUser){
        //window.location.hash = '';

      } 
      else{
        console.log("logInViewFunc");

 //    綁定登入表單的學號檢查事件(); // 可以利用TAHelp物件
       document.getElementById('form-signin-student-id').addEventListener("keyup",function(){
        var signinID = document.getElementById('form-signin-student-id').value;
        var input = document.getElementById('form-signin-message');
        if(TAHelp.getMemberlistOf(signinID)===false){
          input.innerHTML = '學號不存在，請再確認一次';
          input.style.display = "block";
        }else{
          input.style.display = "none";
        }
        if(signinID===''){
          input.style.display = 'none';
        }
      });
          
 //    綁定註冊表單的學號檢查事件(); // 可以利用TAHelp物件
       document.getElementById('form-signup-student-id').addEventListener("keyup",function(){
        var signupID = document.getElementById('form-signup-student-id').value;
        var input = document.getElementById('form-signup-message');
        if(TAHelp.getMemberlistOf(signupID)===false){
          input.innerHTML = '學號不存在，請再確認一次';
          input.style.display = "block";
        }else{
          input.style.display = "none";          
        }
        if(signupID===''){
          input.style.display = 'none';
        }
      });

 //    綁定註冊表單的密碼檢查事件(); // 參考上課範例
      document.getElementById('form-signup-password1').addEventListener("keyup",function(){
        var signupPassword0 = document.getElementById('form-signup-password').value;
        var signupPassword1 = document.getElementById('form-signup-password1').value;
        var input = document.getElementById('form-signup-message')
        if(signupPassword1 !== signupPassword0){
          input.innerHTML = '密碼不一致，請再確認一次';
          input.style.display="block";
          } else {
            input.style.display='none';
          };
        var message = (signupPassword1 !== signupPassword0) ? '密碼不一致，請再確認一次' : '';
        
     });

  //   綁定登入表單的登入檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.logIn
     document.getElementById('form-signin').addEventListener("submit",function(){
      var signinID = document.getElementById('form-signin-student-id').value;
      var signinPassword = document.getElementById('form-signin-password').value;
      Parse.User.logIn(signinID,signinPassword,{
          success: function(user){
            postAction();
 //           alert("TEST")
          },
          error: function(user,error){
            //alert("something wrong");
            console.log(user);
            console.log(error);
          }
        });
    }, false);

  //   綁定註冊表單的註冊檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.signUp和相關函數
     document.getElementById('form-signup').addEventListener('submit',function(j){
      j.preventDefault();
      var user = new Parse.User();
      user.set("username",document.getElementById('form-signup-student-id').value);
      user.set("password",document.getElementById('form-signup-password').value);
      user.set("email",document.getElementById('form-signup-email').value);

      user.signUp(null,{
        success: function(user){
          postAction();
        },
        error: function(user,error){
          document.getElementById('form-signin-message').innerHTML = error.message + '[' + error.code + ']';
        }
      });
    },false);
      }
    },

    evalViewFunc: function(){
//      alert("In evalViewFunc");
     document.getElementById('content').innerHTML = templates.evaluationView();

    pagingCheck.loginRequiredView(function(){

           // 基本上和上課範例購物車的函數很相似，這邊會用Parse DB
     var Evaluation = Parse.Object.extend("Evaluation");
     var userCurrent = Parse.User.current();
     var parseACL = new Parse.ACL;
         parseACL.setPublicReadAccess(false);
         parseACL.setPublicWriteAccess(false);
         parseACL.setReadAccess(userCurrent,true);
         parseACL.setWriteAccess(userCurrent,true);

     var parseQuery = new Parse.Query(Evaluation);
         parseQuery.equalTo("user",userCurrent);
         
         parseQuery.first({
            success:function(evaluation){
    //          alert("parseQuery first success");
              window.EVAL = parseQuery;
              if(parseQuery===undefined){
                var idCheck = TAHelp.getMemberlistOf(userCurrent.get("username")).filter(function(e){
                  return e.StudentID !== userCurrent.get("username") ? true:false
                }).map(function(e){
                    e.scores=["0","0","0","0"];
                    return e
                  })
                }
              else{
                var idCheck = parseQuery.toJSON().evaluations;
              }

              document.getElementById("content").innerHTML = templates.evaluationView(idCheck);
              document.getElementById("evaluationForm-submit").value = (evaluation === undefined) ? '送出表單' : '修改表單';
              document.getElementById("evaluationForm").addEventListener('submit',function(){
                for(var i=0 ; i<idCheck.length ; i++){
                  for(var j=0 ; j<idCheck[i].scores.length ; j++){
                    var e = document.getElementById('stu' + idCheck[i].StudentID + '-q' + j);
                    var amount = e.options[e.selectedIndex].value;
                    idCheck[i].scores[j] = amount;
                  }
                }

                if(evaluation === undefined){
                  evaluation = new Evaluation();
                  evaluation.set('user',currentUser);
                  evaluation.setACL(evaluationACL);
                }
                console.log(idCheck);
                evaluation.set('evaluations',idCheck);
                evaluation.save(null,{
                  success: function(){
                    document.getElementById('content').innerHTML = templates.updateSuccessView();
                  },
                  error: function(){

                  },
                });
              },false);
          },error:function(Object,err){

          }


          })
            });

    },};
         

//     問看看Parse有沒有這個使用者之前提交過的peer review物件(

//     沒有的話: 從TAHelp生一個出來(加上scores: [‘0’, ‘0’, ‘0’, ‘0’]屬性存分數並把自己排除掉)

//     把peer review物件裡的東西透過版型印到瀏覽器上();

//     綁定表單送出的事件(); // 如果Parse沒有之前提交過的peer review物件，要自己new一個。或更新分數然後儲存。

 
   var router = Parse.Router.extend({

     routes:{
      '': 'index',
      'evaluation/': 'peerEvaluation',
      'login/*redirect':'login',
     },

     login: handler.logInViewFunc,
     index: handler.evalViewFunc,
     peerEvaluation: handler.evalViewFunc,

   });

  this.Router = new router();
  Parse.history.start();
  handler.navbarFunc();

})();