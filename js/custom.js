jQuery(document).ready(function () {

var base_url = $('.base_url').val();



$.validator.addMethod("lettersonly", function(value, element) {
         return this.optional(element) || /^[a-z," "]+$/i.test(value);
   }, "Only alphabets are allowed.");

   jQuery.validator.addMethod("noSpace", function(value, element) {
		return value.indexOf(" ") < 0 && value != "";
	}, "Space are not allowed");

   jQuery.validator.addMethod("regex", function(value, element, param){
         return this.optional(element) || /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i.test(value);
      }, "Please enter a valid email address.");




 $("#bookingCars").validate({
   errorClass: "has-error",
     highlight: function(element, errorClass) {
         //$(element).parents('.form-group').addClass(errorClass);
     },
     unhighlight: function(element, errorClass, validClass) {
       //  $(element).parents('.form-group').removeClass(errorClass);
     },
 rules:
 {
  adult: {
    required: true,
    },
  child: {
    required: true,
  },
  name: {
    required: true
  },
  dob: {
    required: true
  },
  city: {
    required: true
  },
  phone: {
    required: true,
    number:true,
  },
  otp: {
    required: true,
    number:true,
  },
 },
 messages:
 {
  adult: {
    required: "Please select adult",
  },
  child: {
    required: "Please select child",
  },
  name: {
    required: "Please enter name",
  },
  dob: {
    required: "Please select dob",
  },
  city: {
    required: "Please enter city",
  },
  phone: {
    required: "Please enter phone",
  },
  otp: {
    required: "Please enter otp",
  },
 },
 submitHandler: function (form)
 {
  formSubmit(form);
 }
 });


 $('#carsCityphone').keyup(debounce(function(){
     var val = $(this).val();
     var url = $('.base_url').val();

    if (val.match(/^\d{10}$/))
    {
   $('.classotp').removeClass('d-none');
     $.ajax({
       url :url+'sms.php',
       type :'post',
       data : {
         phone:val
       },
       enctype : 'multipart/form-data',
      headers     : {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },

      dataType    : "json",
       success: function(response){

             $('.orgCode').val(response.data);

           }
        });
    }
 },500));

});

function debounce(func, wait, immediate) {
 	var timeout;
 	return function() {
 		var context = this, args = arguments;
 		var later = function() {
 			timeout = null;
 			if (!immediate) func.apply(context, args);
 		};
 		var callNow = immediate && !timeout;
 		clearTimeout(timeout);
 		timeout = setTimeout(later, wait);
 		if (callNow) func.apply(context, args);
 	};
 };

 function formSubmit(form)
{

  $.ajax({
    url         : form.action,
    type        : form.method,
    data        : new FormData(form),
    enctype : 'multipart/form-data',
    contentType : false,
    cache       : false,
    headers     : {
     'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    },
    processData : false,
    dataType    : "json",
    beforeSend  : function () {
      $(".button-disabled").attr("disabled", "disabled");
      $(".loader_panel").css('display','block');
    },
    complete: function () {
      $(".loader_panel").css('display','none');
        $(".button-disabled").attr("disabled",false);
    },
    success: function (response) {

      if(response.url)
      {
        if(response.delayTime)
        setTimeout(function() { window.location.href=response.url;}, response.delayTime);
        else
        window.location.href=response.url;
      }
      $.toast().reset('all');
      var delayTime = 3000;
      if(response.delayTime)
      delayTime = response.delayTime;
      // setTimeout(function(){  location.reload(); }, delayTime)

      if (response.success)
      {
        $('.reset')[0].reset();

        $.toast({
          heading             : 'Success',
          text                : response.success_message,
          loader              : true,
          loaderBg            : '#fff',
          showHideTransition  : 'fade',
          icon                : 'success',
          hideAfter           : delayTime,
          position            : 'top-right'
        });

            if (response.modelhide) {

            if (response.delay)
            {

            setTimeout(function (){ $(response.modelhide).modal('hide') },response.delay);
            }
             else
             {

            $(response.modelhide).modal('hide');
              }
            }
      }

        if( response.formErrors)
        {
          $.toast({
            heading             : 'Error',
            text                : response.errors,
            loader              : true,
            loaderBg            : '#fff',
            showHideTransition  : 'fade',
            icon                : 'error',
            hideAfter           : delayTime,
            position            : 'top-right'
          });
        }

    },
    error:function(response){
        $.toast({
          heading             : 'Error',
          text                : "Server Error",
          loader              : true,
          loaderBg            : '#fff',
          showHideTransition  : 'fade',
          icon                : 'error',
          hideAfter           : 4000,
          position            : 'top-right'
        });

    }
  });
}



 // *************** submit function******************
 function formSubmit1(form)
{
    $.ajax({
        url         : form.action,
        type        : form.method,
        // data        : form.serialize(),
        data        : new FormData(form),
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        contentType : false,
        cache       : false,
        processData : false,
        dataType    : "json",
        beforeSend  : function () {
            $("input[type=submit]").attr("disabled", "disabled");
            $("#preloader").show();
        },
        complete: function () {
            $("#preloader").hide();
            $("input[type=submit]").removeAttr("disabled");
            $("button[type=submit]").removeAttr("disabled");
        },
        success: function (response) {
            console.log(response);
            $("#preloader").hide();
            $("input[type=submit]").removeAttr("disabled");
            if (response.success)
            {
                form.reset();
                toastr.success(response.message,response.delayTime);
                if( response.updateRecord)
                {
                    $.each(response.data, function( index, value )
                    {
                        $(document).find('#tableRow_'+response.data.id).find("td[data-name='"+index+"']").html(value);
                    });
                }
                if( response.addRecord)
                {
                    $.each(response.data, function( index, value )
                    {
                        $("input[name='"+index+"']").parents('.form-group').addClass('has-error');
                        $("input[name='"+index+"']").after('<label id="'+index+'-error" class="has-error" for="'+index+'">'+value+'</label>');

                        $("select[name='"+index+"']").parents('.form-group').addClass('has-error');
                        $("select[name='"+index+"']").after('<label id="'+index+'-error" class="has-error" for="'+index+'">'+value+'</label>');
                    });
                }
                if(response.showElement)
                {
                    var showIDs = response.showElement.split(",");
                    $.each(showIDs, function(i, val){ $(val).removeClass('d-none'); });
                }
                if(response.hideElement)
                {
                    var hideIDs = response.hideElement.split(",");
                    $.each(hideIDs, function(i, val){ $(val).addClass('d-none'); });
                }
            }
            if(response.validation===false){
                jQuery.each(response.message,function(index,value){
                    $('#error_'+index).html(value);
                    $('#error_'+index).show();
                    $("input[name='"+index+"']").addClass('is-invalid');
                    $("select[name='"+index+"']").addClass('is-invalid');
                    $("textarea[name='"+index+"']").addClass('is-invalid');
                });
            }
            if(response.error){
                toastr.error(response.message,response.delayTime);
            }
            if(response.html){
                jQuery(response.target).html(response.content);
            }

            if(response.ajaxPageCallBack)
            {
                response.formid = form.id;
                ajaxPageCallBack(response);
            }

            if(response.resetform)
            {
                $('#'+form.id).trigger('reset');
            }
            if(response.submitDisabled)
            {
                $("input[type=submit]").attr("disabled", "disabled");
                $("button[type=submit]").attr("disabled", "disabled");

            }
            if (response.modelhide) {

                if (response.delay)
                    setTimeout(function (){ $(response.modelhide).modal('hide') },response.delay);
                else
                    $(response.modelhide).modal('hide');
            }
            if(response.url)
            {
                if(response.delayTime)
                    setTimeout(function() { window.location.href=response.url;}, response.delayTime);
                else
                    window.location.href=response.url;
            }
            if (response.reload) {
                if(response.delayTime)
                    setTimeout(function(){  location.reload(); }, response.delayTime)
                else
                    location.reload();
            }

            if (response.elementHide) {
                jQuery(response.elementHide).addClass('d-none');
            }
            if (response.elementShow) {
                jQuery(response.elementShow).removeClass('d-none');
            }

            if (response.customScript=='adminWalletTxn') {
                $('#walletModelForm').attr('action',response.wallet_url);
                $('.w_ag_name').text(response.agent_name);
                $('.w_ag_amt').text(response.wallet_amount);
            }

        },
        error:function(response){
            networkError();
            console.log('Connection Error');
        }
    });
}

function delete_record() {
 	var anyBoxesChecked = false;
 	jQuery('.single-checkbox').each(function () {
 		if (jQuery(this).is(":checked")) {
 			anyBoxesChecked = true;
 		}
 	});
 	if (anyBoxesChecked == false) {
 		//alert('Please select at least one record');
    $.toast({
      heading             : 'Error',
      text                : 'Please select at least one record',
      loader              : true,
      loaderBg            : '#fff',
      showHideTransition  : 'fade',
      icon                : 'error',
      hideAfter           : 3000,
      position            : 'top-right'
    });
 		return false;
 	} else {
 		var r = confirm("Are you sure you want to delete  ?");
 		if (r == true) {

 			// jQuery().submit();
         let form = $('.list-form')[0];
        formSubmit(form);

 			return(true);

 		} else {
 			return(false);
 		}
 	}
 }
