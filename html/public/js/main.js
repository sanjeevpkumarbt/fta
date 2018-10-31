function gv(val){
  return $('#' + val).val();
}

function gl(val){
  return val.length;
}

function performSubmit(user,phone) {
 if(gl(user) == 0) {
   alert("Please specify a name.");
   return;
 }
 if(gl(phone) == 0) {
   alert("Please specify a phone number.")
   return;
 }
 $.post("/api/addUsers", {user: user, phone: phone})
  .done(function(data){
    alert(data);
  });
}

function initIndex() {
  $('#submit').click(function() {
    performSubmit(gv("user"),gv("phone"));
  })
}
