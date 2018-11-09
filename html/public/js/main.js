function gv(val){
  return $('#' + val).val();
}

function sv(param,value){
  return $('#' + param).val(value);
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
  $("nav .nav-link").on("click", function(){
    $("nav").find(".active").removeClass("active");
    $(this).addClass("active");
    //var a = $.parseHTML($("div.row.content.add_entries.active_content").find(".active_content"));
    //$('.main-content').find(".active_content").removeClass("active_content");
    //alert($('div').find(".active_content").removeClass("active_content"));
    $(".main-content").find(".active_content").removeClass("active_content").addClass("inactive_content");
    $(".main-content").find("." + $(this).attr('id')).removeClass("inactive_content").addClass("active_content");
    render("Index",$(this).attr('id'));
    //$("div.row.main-content." + $(this).attr('id')).addClass("active_content").removeClass("inactive_content");
  });

  function render(page,val){
    if (page == "Index" && val == 'list_requests') {
      $.get("/api/getUsers", function (data){
        $(".list_entries").html(data);
        alert('Data is ' + data);
      });
    }
    if (page == "Index" && val == 'add_entries') {
        $(".list_entries").html('<tr><td style="width:33%"></td><td style="width:33%"><div class="loader"></div></td><td style="width:33%"></td></tr>');
    }
  }

  $('#submit').click(function() {
    performSubmit(gv("user"),gv("phone"));
    sv("user","");
    sv("phone","");
  });
}
