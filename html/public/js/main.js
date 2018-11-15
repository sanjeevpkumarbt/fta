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

function performSearch(string) {
  if(gl(string) == 0) {
    alert("Please put in a name or number to search!");
    return;
  }
  $.post("/api/searchUser", {string: string})
   .done(function(data){
     sv("string","");
     sv("search_string","");
     if (data === "NO_RESULTS")
      renderSearch('<tr><td style="width:33%"></td><td style="width:33%">No Results</td><td style="width:33%"></td></tr>');
     else
      renderSearch(data);
   });
}

function renderSearch(search_results){
  $("nav").find(".active").removeClass("active");
  $(".main-content").find(".active_content").removeClass("active_content").addClass("inactive_content");
  $(".main-content").find(".search_entries").removeClass("inactive_content").addClass("active_content");
  $(".search_list_entries").html(search_results);
}

function reset_search_results() {
  sv("user_result","");
  sv("phone_result","");
}

function render(page,val){
  if (page == "Index" && val == 'list_requests') {
    $.get("/api/getUsers", function (data){
      $(".list_entries").html(data);
      //alert('Data is ' + data);
    });
  }
  if (page == "Index" && val == 'add_entries') {
      $(".list_entries").html('<tr><td style="width:33%"></td><td style="width:33%"><div class="loader"></div></td><td style="width:33%"></td></tr>');
  }
}

function initIndex() {
  $("nav .nav-link").on("click", function(){
    reset_search_results();
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


  $('#submit').click(function() {
    performSubmit(gv("user"),gv("phone"));
    sv("user","");
    sv("phone","");
  });

  $('#search_requests').click(function(){
    performSearch(gv("search_string"));
  });

}
