import $ from 'jquery';
import Cookies from 'js-cookie';

/**
 * csrfSafeMethod - checks if the request method is CSRF safe (using regex)
 * this function is called before every request made using jQuery, and
 * the CSRF token is set accordingly
 *
 * @param  {string} method - request method name
 * @return {boolean} true if the method is CSRF safe
 */
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader('X-CSRFToken', Cookies.get('csrftoken'));
        }
    }
});
