



$(document).ready(function() {
    $('.my_form').submit(function() { // On form submit event
        $.ajax({ // create an AJAX call...
            data: $(this).serialize(), // get the form data
            type: $(this).attr('method'), // GET or POST
            url: $(this).attr('action'), // the file to call
            success: function(data) { // on success..
            $('#refresh').html(data)// update the DIV
            },
            error: function(e, x, r) { // on error..
                $('#error_div').html(e); // update the DIV
            }
        });
        return false;
    });
    $(".submit_form").click(function(){
    $(".my_form").submit();
  });
  $('#my_form').submit(function() { // On form submit event
        $.ajax({ // create an AJAX call...
            data: $(this).serialize(), // get the form data
            type: $(this).attr('method'), // GET or POST
            url: $(this).attr('action'), // the file to call
            success: function(data) { // on success..
            $('#refresh').html(data)// update the DIV
            },
            error: function(e, x, r) { // on error..
                $('#error_div').html(e); // update the DIV
            }
        });
        return false;
    });
  
$(".submit_form_order").click(function(){
$(".my_form_order").submit();
});
$('.my_form_customer').submit(function() { // On form submit event
  $.ajax({ // create an AJAX call...
      data: $(this).serialize(), // get the form data
      type: $(this).attr('method'), // GET or POST
      url: $(this).attr('action'), // the file to call
      success: function(data) { // on success..
      $('#refresh').html(data)// update the DIV
      },
      error: function(e, x, r) { // on error..
          $('#error_div').html(e); // update the DIV
      }
  });
  return false;
});
$(".submit_form_customer").click(function(){
$(".my_form_customer").submit();
});
  
});




input_message = $('#input-message')
message_body = $('.msg_card_body')
send_message_form = $('#send-message-form')
USER_ID = $('#logged-in-user').val()
times =$('#time')
loc = window.location
wsStart = 'ws://'

if(loc.protocol === 'https') {
    wsStart = 'wss://'
}
 endpoint = wsStart + loc.host + loc.pathname

 socket = new WebSocket(endpoint)

socket.onopen = async function(e){
    console.log('open', e)
    send_message_form.on('submit', function (e){
        e.preventDefault()
        let message = input_message.val()
        let time = times.val()
        let send_to = get_active_other_user_id()
        let thread_id = get_active_thread_id()
       
        
        
        let data = {
            'message': message,
            'sent_by': USER_ID,
            'send_to': send_to,
            'thread_id': thread_id, 
            'time':time,
        }
        data = JSON.stringify(data)
        socket.send(data)
        $(this)[0].reset()
    })
}

socket.onmessage = async function(e){
    console.log('message', e)
    let data = JSON.parse(e.data)
    let message = data['message']
    let sent_by_id = data['sent_by']
    let thread_id = data['thread_id']
    let time= data['time']
    newMessage(message, sent_by_id, thread_id,time)
}

socket.onerror = async function(e){
    console.log('error', e)
}

socket.onclose = async function(e){
    console.log('close', e)
}


function newMessage(message, sent_by_id, thread_id,time) {
	if ($.trim(message) === '') {
		return false;
	}
	let message_element;
	let chat_id = 'chat_' + thread_id
	if(sent_by_id == USER_ID){
	    message_element = `
			
                
                <div class="d-flex justify-content-end">
                <span class="send">${message}</span>
                </div>   
                <div class="d-flex justify-content-center">
                    <span class="msg_time_received">${time}</span>
                </div>  
            `
           
    }
	else{
	    message_element = `

        <div class="d-flex justify-content-star ">
          <span class="received">${message}</span>
        </div>
        <div class="d-flex justify-content-center">
            <span class="msg_time_received">${time}</span>
        </div>
        `
      
    }

    let message_body = $('.messages-wrapper[chat-id="' + chat_id + '"] .msg_card_body')
	message_body.append($(message_element))
    message_body.animate({
        scrollTop: $(document).height()
    }, 100);
	input_message.val(null);
}


$('.contact-li').on('click', function (){
    $('.contacts .active').removeClass('active')
    $(this).addClass('active')

    // message wrappers
    let chat_id = $(this).attr('chat-id')
    $('.messages-wrapper.is_active').removeClass('is_active')
    $('.messages-wrapper[chat-id="' + chat_id +'"]').addClass('is_active')

})

function get_active_other_user_id(){
    let other_user_id = $('.messages-wrapper.is_active').attr('other-user-id')
    other_user_id = $.trim(other_user_id)
    return other_user_id
}

function get_active_thread_id(){
    let chat_id = $('.messages-wrapper.is_active').attr('chat-id')
    let thread_id = chat_id.replace('chat_', '')
    return thread_id
}

